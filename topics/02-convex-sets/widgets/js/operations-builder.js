/**
 * Widget: Operations Preserve Convexity Builder
 *
 * Description: A tool where users can apply operations (intersection, affine transformation) to pre-defined convex sets to see the result.
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { getPyodide } from "../../../../static/js/pyodide-manager.js";

export async function initOperationsBuilder(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="operations-builder-widget">
            <div class="widget-controls">
                <label for="op-select">Operation:</label>
                <select id="op-select">
                    <option value="intersection">Intersection</option>
                    <option value="affine">Affine Transformation</option>
                </select>
                <div id="affine-controls" style="display:none;">
                    <p>Transform: <strong>y = Ax + b</strong></p>
                    A = [<input type="number" step="0.1" value="1">, <input type="number" step="0.1" value="0.5">;
                    <input type="number" step="0.1" value="0.5">, <input type="number" step="0.1" value="1">]
                    b = [<input type="number" step="0.1" value="1">, <input type="number" step="0.1" value="1">]
                </div>
            </div>
            <div id="plot-container"></div>
        </div>
    `;

    const opSelect = container.querySelector("#op-select");
    const affineControls = container.querySelector("#affine-controls");
    const plotContainer = container.querySelector("#plot-container");
    const affineInputs = affineControls.querySelectorAll('input');

    const margin = {top: 20, right: 20, bottom: 20, left: 20};
    const width = plotContainer.clientWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(plotContainer).append("svg")
        .attr("width", "100%").attr("height", height + margin.top + margin.bottom)
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .append("g")
        .attr("transform", `translate(${width/2 + margin.left},${height/2 + margin.top})`);

    const x = d3.scaleLinear().domain([-10, 10]).range([-width/2, width/2]);
    const y = d3.scaleLinear().domain([-10, 10]).range([height/2, -height/2]);

    svg.append("g").call(d3.axisBottom(x));
    svg.append("g").call(d3.axisLeft(y));

    let set1 = d3.range(0, 2*Math.PI, 0.2).map(a => [3*Math.cos(a) - 2, 3*Math.sin(a)]);
    let set2 = [[2, -4], [6, -4], [6, 4], [2, 4]];

    const pyodide = await getPyodide();
    await pyodide.loadPackage("shapely");
    const pythonCode = `
import numpy as np
from shapely.geometry import Polygon, Point
from shapely.affinity import affine_transform
import json

def get_intersection(poly1_pts, poly2_pts):
    poly1 = Polygon(poly1_pts)
    poly2 = Polygon(poly2_pts)
    intersection = poly1.intersection(poly2)
    return list(intersection.exterior.coords) if not intersection.is_empty else []

def apply_affine(poly_pts, A, b):
    # A is a 2x2 matrix, b is a 2-vector
    # Shapely's affine_transform takes [a, b, c, d, xoff, yoff]
    # corresponding to [A00, A01, A10, A11, b0, b1]
    matrix = [A[0][0], A[0][1], A[1][0], A[1][1], b[0], b[1]]
    poly = Polygon(poly_pts)
    transformed_poly = affine_transform(poly, matrix)
    return list(transformed_poly.exterior.coords)
`;
    await pyodide.runPythonAsync(pythonCode);
    const get_intersection = pyodide.globals.get('get_intersection');
    const apply_affine = pyodide.globals.get('apply_affine');

    const set1_path = svg.append("path").attr("fill", "var(--color-primary-light)").attr("stroke", "var(--color-primary)").style("cursor", "move");
    const set2_path = svg.append("path").attr("fill", "var(--color-accent-light)").attr("stroke", "var(--color-accent)").style("cursor", "move");
    const result_path = svg.append("path").attr("fill", "var(--color-danger)").attr("opacity", 0.7);

    async function update() {
        const operation = opSelect.value;
        affineControls.style.display = (operation === 'affine') ? 'block' : 'none';

        set1_path.attr("d", d3.line().x(d=>x(d[0])).y(d=>y(d[1]))(set1) + "Z");
        set2_path.attr("d", d3.line().x(d=>x(d[0])).y(d=>y(d[1]))(set2) + "Z").style("display", operation === 'intersection' ? 'block' : 'none');

        if (operation === 'intersection') {
            const result = await get_intersection(set1, set2).then(r => r.toJs());
            if (result.length > 0) {
                result_path.attr("d", d3.line().x(d=>x(d[0])).y(d=>y(d[1]))(result) + "Z").style("display", "block");
            } else {
                result_path.style("display", "none");
            }
        } else { // Affine
            const A = [[+affineInputs[0].value, +affineInputs[1].value], [+affineInputs[2].value, +affineInputs[3].value]];
            const b = [+affineInputs[4].value, +affineInputs[5].value];
            const result = await apply_affine(set1, A, b).then(r => r.toJs());
            result_path.attr("d", d3.line().x(d=>x(d[0])).y(d=>y(d[1]))(result) + "Z").style("display", "block");
        }
    }

    const dragBehavior = (poly) => d3.drag()
        .on("drag", (event) => {
            const {dx, dy} = event;
            for(let i=0; i<poly.length; i++) {
                poly[i][0] += x.invert(dx) - x.invert(0);
                poly[i][1] += y.invert(dy) - y.invert(0);
            }
            update();
        });

    set1_path.call(dragBehavior(set1));
    set2_path.call(dragBehavior(set2));
    opSelect.addEventListener("change", update);
    affineInputs.forEach(i => i.addEventListener("input", update));

    update();
}
