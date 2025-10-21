/**
 * Widget: Operations that Preserve Convexity
 *
 * Description: Interactively apply operations (intersection, affine transform)
 *              to convex sets to demonstrate that the result is also convex.
 * Version: 2.0.0
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { polygonClip } from "d3-polygon";

export function initOperationsBuilder(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // --- WIDGET LAYOUT ---
    container.innerHTML = `
        <div class="operations-builder-widget">
            <div id="plot-container" style="width: 100%; height: 400px; cursor: move;"></div>
            <div class="widget-controls" style="padding: 15px;">
                <label for="op-select">Operation:</label>
                <select id="op-select">
                    <option value="intersection">Intersection</option>
                    <option value="affine">Affine Transformation</option>
                </select>
                <div id="affine-info" class="widget-output" style="margin-top: 10px; display: none;"></div>
            </div>
        </div>
    `;

    const opSelect = container.querySelector("#op-select");
    const plotContainer = container.querySelector("#plot-container");
    const affineInfo = container.querySelector("#affine-info");

    let svg, x, y;
    let set1 = d3.range(0, 2 * Math.PI, 0.2).map(a => [3 * Math.cos(a) - 2, 3 * Math.sin(a)]);
    let set2 = [[2, -4], [6, -4], [6, 4], [2, 4]];
    let affine = { A: [[1, 0.5], [0.5, 1]], b: [1, 1] };

    function setupChart() {
        plotContainer.innerHTML = '';
        const margin = { top: 20, right: 20, bottom: 30, left: 40 };
        const width = plotContainer.clientWidth - margin.left - margin.right;
        const height = plotContainer.clientHeight - margin.top - margin.bottom;

        svg = d3.select(plotContainer).append("svg")
            .attr("width", "100%").attr("height", "100%")
            .attr("viewBox", `0 0 ${plotContainer.clientWidth} ${plotContainer.clientHeight}`)
            .append("g").attr("transform", `translate(${margin.left},${margin.top})`);

        x = d3.scaleLinear().domain([-10, 10]).range([0, width]);
        y = d3.scaleLinear().domain([-10, 10]).range([height, 0]);

        svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));
        svg.append("g").call(d3.axisLeft(y));

        const lineGen = d3.line().x(d => x(d[0])).y(d => y(d[1]));

        svg.append("path").attr("class", "set1-path").datum(set1).attr("d", lineGen).attr("fill", "var(--color-primary-light)").call(dragBehavior(set1));
        svg.append("path").attr("class", "set2-path").datum(set2).attr("d", lineGen).attr("fill", "var(--color-accent-light)").call(dragBehavior(set2));
        svg.append("path").attr("class", "result-path").attr("fill", "var(--color-danger)").attr("opacity", 0.7);
    }

    const dragBehavior = (poly) => d3.drag()
        .on("drag", (event) => {
            const dx = x.invert(event.dx) - x.invert(0);
            const dy = y.invert(event.dy) - y.invert(0);
            poly.forEach(p => { p[0] += dx; p[1] += dy; });
            update();
        });

    function update() {
        const operation = opSelect.value;
        const lineGen = d3.line().x(d => x(d[0])).y(d => y(d[1]));

        svg.select(".set1-path").attr("d", lineGen(set1) + "Z");
        svg.select(".set2-path").attr("d", lineGen(set2) + "Z").style("display", operation === 'intersection' ? 'block' : 'none');
        affineInfo.style.display = operation === 'affine' ? 'block' : 'none';

        if (operation === 'intersection') {
            const intersection = polygonClip(set1, set2);
            if (intersection) {
                svg.select(".result-path").datum(intersection).attr("d", lineGen(intersection) + "Z").style("display", "block");
            } else {
                svg.select(".result-path").style("display", "none");
            }
        } else { // Affine
            const transformedSet = set1.map(p => [
                affine.A[0][0] * p[0] + affine.A[0][1] * p[1] + affine.b[0],
                affine.A[1][0] * p[0] + affine.A[1][1] * p[1] + affine.b[1]
            ]);
            svg.select(".result-path").datum(transformedSet).attr("d", lineGen(transformedSet) + "Z").style("display", "block");

            affineInfo.innerHTML = `
                Transforming with <strong>y = Ax + b</strong>.
                (This is a preset transformation for demonstration).
            `;
        }
    }

    opSelect.addEventListener("change", update);

    new ResizeObserver(setupChart).observe(plotContainer);
    setupChart();
    update();
}
