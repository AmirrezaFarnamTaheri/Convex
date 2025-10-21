/**
 * Widget: Polyhedron Visualizer
 *
 * Description: Allows users to add or modify linear inequalities (Ax <= b) and see the resulting 2D polyhedron update in real-time.
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { getPyodide } from "../../../../static/js/pyodide-manager.js";

export async function initPolyhedronVisualizer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="polyhedron-visualizer-widget">
            <div class="widget-controls">
                <div>
                    <input type="number" value="1" step="0.1" id="a1"> x₁ +
                    <input type="number" value="1" step="0.1" id="a2"> x₂ ≤
                    <input type="number" value="2" step="0.1" id="b">
                    <button id="add-constraint-btn">Add</button>
                </div>
                <div id="constraints-list"></div>
            </div>
            <div id="plot-container"></div>
        </div>
    `;

    const plotContainer = container.querySelector("#plot-container");
    const addBtn = container.querySelector("#add-constraint-btn");
    const constraintsList = container.querySelector("#constraints-list");
    const a1_input = container.querySelector("#a1");
    const a2_input = container.querySelector("#a2");
    const b_input = container.querySelector("#b");

    let constraints = [
        { a: [-1, 0], b: 0 }, { a: [0, -1], b: 0 }, { a: [1, 0], b: 5 }, { a: [0, 1], b: 5 }
    ];

    const margin = {top: 20, right: 20, bottom: 40, left: 40};
    const width = plotContainer.clientWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(plotContainer).append("svg")
        .attr("width", "100%")
        .attr("height", height + margin.top + margin.bottom)
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().domain([-6, 6]).range([0, width]);
    const y = d3.scaleLinear().domain([-6, 6]).range([height, 0]);

    svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));
    svg.append("g").call(d3.axisLeft(y));

    const feasibleRegion = svg.append("path").attr("fill", "var(--color-primary-light)").attr("opacity", 0.8);

    const pyodide = await getPyodide();
    await pyodide.loadPackage("scipy");
    const pythonCode = `
import numpy as np
from scipy.optimize import linprog

def find_feasible_point(A, b):
    # Find a point inside the polyhedron
    c = np.zeros(A.shape[1])
    res = linprog(c, A_ub=A, b_ub=b, bounds=[(None, None), (None, None)], method='highs')
    return res.x if res.success else None

def get_vertices(A, b):
    # This is a complex problem; for now, we'll find a feasible region by clipping half-planes
    # This is a simplified approach for visualization
    from shapely.geometry import Polygon, HalfPlane

    # Start with a large bounding box
    bounds = 100
    feasible_poly = Polygon([(-bounds,-bounds), (bounds,-bounds), (bounds,bounds), (-bounds,bounds)])

    for i in range(A.shape[0]):
        a = A[i]
        b_val = b[i]
        # Create half-plane Ax <= b
        # Normal vector is a, point on boundary is a*b_val/|a|^2
        p_on_boundary = a * b_val / np.dot(a, a)
        half_plane = HalfPlane(p_on_boundary, -a)
        feasible_poly = feasible_poly.intersection(half_plane)

    if feasible_poly.is_empty:
        return []

    return list(feasible_poly.exterior.coords)
`;
    await pyodide.runPythonAsync(pythonCode);
    const get_vertices = pyodide.globals.get('get_vertices');

    async function updateVisualization() {
        renderConstraintsList();

        const A = constraints.map(c => c.a);
        const b = constraints.map(c => c.b);

        const verticesPy = await get_vertices(A, b);
        const vertices = verticesPy.toJs();
        verticesPy.destroy();

        if (vertices.length > 0) {
            feasibleRegion.attr("d", d3.line().x(d => x(d[0])).y(d => y(d[1]))(vertices) + "Z");
        } else {
            feasibleRegion.attr("d", null);
        }
    }

    function renderConstraintsList() {
        constraintsList.innerHTML = '<strong>Constraints:</strong>';
        constraints.forEach((c, i) => {
            const div = document.createElement("div");
            div.innerHTML = `
                <span>${c.a[0].toFixed(1)}x₁ + ${c.a[1].toFixed(1)}x₂ ≤ ${c.b.toFixed(1)}</span>
                <button data-index="${i}">Remove</button>
            `;
            div.querySelector('button').addEventListener('click', () => {
                constraints.splice(i, 1);
                updateVisualization();
            });
            constraintsList.appendChild(div);
        });
    }

    addBtn.addEventListener('click', () => {
        const a1 = +a1_input.value || 0;
        const a2 = +a2_input.value || 0;
        const b = +b_input.value || 0;

        if (Math.abs(a1) + Math.abs(a2) > 1e-6) { // Avoid zero vector for 'a'
            constraints.push({ a: [a1, a2], b: b });
            updateVisualization();
        }
    });

    updateVisualization();
}
