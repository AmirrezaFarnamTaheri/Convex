/**
 * Widget: LP Visualizer & Simplex Animator
 *
 * Description: Interactively define a 2D Linear Program, visualize the feasible region,
 *              and animate the steps of the simplex algorithm.
 * Version: 2.0.0
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { polygonClip } from "d3-polygon";

export async function initLPVisualizer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // --- WIDGET LAYOUT ---
    container.innerHTML = `
        <div class="lp-visualizer-widget">
            <div id="plot-container" style="width: 100%; height: 400px; cursor: crosshair;"></div>
            <div class="widget-controls" style="padding: 15px;">
                <h4>Objective: Maximize cᵀx</h4>
                c = [<input type="number" id="c1" value="1" step="0.1">, <input type="number" id="c2" value="2" step="0.1">]
                <h4 style="margin-top:10px;">Constraints: Ax ≤ b</h4>
                <p class="widget-instructions">Click-drag on the plot to add constraints. Non-negativity (x₁, x₂ ≥ 0) is assumed.</p>
                <div id="lp-constraints-list"></div>
                <button id="run-simplex-btn">Animate Simplex</button>
                <button id="clear-constraints-btn">Clear Constraints</button>
                <div id="lp-solution-text" class="widget-output" style="margin-top: 10px;"></div>
            </div>
        </div>
    `;

    const plotContainer = container.querySelector("#plot-container");
    const constraintsList = container.querySelector("#lp-constraints-list");
    const runBtn = container.querySelector("#run-simplex-btn");
    const clearBtn = container.querySelector("#clear-constraints-btn");
    const solutionText = container.querySelector("#lp-solution-text");
    const c1_in = container.querySelector("#c1");
    const c2_in = container.querySelector("#c2");

    const initialConstraints = [[-1, 1, 1], [1, 1, 3], [1, 0, 2]];
    let constraints = [...initialConstraints]; // Default a1, a2, b
    let svg, x, y;

    function setupChart() {
        plotContainer.innerHTML = '';
        const margin = { top: 20, right: 20, bottom: 30, left: 40 };
        const width = plotContainer.clientWidth - margin.left - margin.right;
        const height = plotContainer.clientHeight - margin.top - margin.bottom;

        svg = d3.select(plotContainer).append("svg")
            .attr("width", "100%").attr("height", "100%")
            .attr("viewBox", `0 0 ${plotContainer.clientWidth} ${plotContainer.clientHeight}`)
            .append("g").attr("transform", `translate(${margin.left},${margin.top})`);

        x = d3.scaleLinear().domain([-1, 4]).range([0, width]);
        y = d3.scaleLinear().domain([-1, 4]).range([height, 0]);

        svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));
        svg.append("g").call(d3.axisLeft(y));

        svg.append("g").attr("class", "content");

        const drag = d3.drag()
            .on("start", (event) => {
                const [x0, y0] = d3.pointer(event, svg.node());
                svg.append("line").attr("class", "drag-line")
                    .attr("x1", x0).attr("y1", y0).attr("x2", x0).attr("y2", y0)
                    .attr("stroke", "var(--color-accent)").attr("stroke-width", 2);
            })
            .on("drag", (event) => svg.select(".drag-line").attr("x2", event.x).attr("y2", event.y))
            .on("end", (event) => {
                const [x0, y0] = [svg.select(".drag-line").attr("x1"), svg.select(".drag-line").attr("y1")];
                const [x1, y1] = d3.pointer(event, svg.node());
                svg.select(".drag-line").remove();

                const p1 = [x.invert(x0), y.invert(y0)];
                const p2 = [x.invert(x1), y.invert(y1)];
                let normal = [y0 - y1, x1 - x0];
                const norm = Math.sqrt(normal[0]**2 + normal[1]**2);
                if (norm < 1e-6) return;
                normal = normal.map(n => n / norm);

                const b = normal[0] * p1[0] + normal[1] * p1[1];
                constraints.push([normal[0], normal[1], b]);
                updateFeasibleRegion();
            });

        svg.call(drag);
    }

    function updateFeasibleRegion() {
        renderConstraintsList();

        let subjectPolygon = [[-10,-10], [10,-10], [10,10], [-10,10]];
        const allConstraints = [...constraints, [-1, 0, 0], [0, -1, 0]]; // Add non-negativity

        allConstraints.forEach(c => {
            const clipPolygon = halfPlaneToPolygon({ a: c.slice(0, 2), b: c[2] });
            subjectPolygon = polygonClip(clipPolygon, subjectPolygon);
        });

        svg.select(".content").selectAll("*").remove(); // Clear previous visuals
        const lineGen = d3.line().x(d => x(d[0])).y(d => y(d[1]));

        if (subjectPolygon) {
            svg.select(".content").append("path").attr("class", "feasible-region")
                .datum(subjectPolygon).attr("d", lineGen).attr("fill", "var(--color-primary-light)");
        }
        return subjectPolygon;
    }

    function halfPlaneToPolygon({ a, b }) {
        const p1 = [a[0]*b, a[1]*b];
        const p2 = [p1[0] - a[1]*20, p1[1] + a[0]*20];
        const p3 = [p1[0] + a[1]*20, p1[1] - a[0]*20];
        const p4 = [p3[0] - a[0]*20, p3[1] - a[1]*20];
        const p5 = [p2[0] - a[0]*20, p2[1] - a[1]*20];
        return [p2, p3, p4, p5];
    }

    function renderConstraintsList() {
        constraintsList.innerHTML = '';
        constraints.forEach((c, i) => {
            const div = document.createElement("div");
            div.innerHTML = `<span>${c[0].toFixed(2)}x₁ + ${c[1].toFixed(2)}x₂ ≤ ${c[2].toFixed(2)}</span>
                             <button data-index="${i}">✖</button>`;
            div.querySelector('button').onclick = () => { constraints.splice(i, 1); updateFeasibleRegion(); };
            constraintsList.appendChild(div);
        });
    }

    async function runSimplex() {
        const region = updateFeasibleRegion();
        solutionText.innerHTML = "";
        if (!region || region.length < 3) {
            solutionText.innerHTML = "Feasible region is empty or unbounded.";
            return;
        }

        const c = [+c1_in.value, +c2_in.value];
        let vertices = region.slice(0, region.length - 1);

        // Sort vertices to trace the perimeter
        const center = vertices.reduce((acc, v) => [acc[0] + v[0], acc[1] + v[1]], [0,0]).map(v => v/vertices.length);
        vertices.sort((a,b) => Math.atan2(a[1]-center[1], a[0]-center[0]) - Math.atan2(b[1]-center[1], b[0]-center[0]));

        let path = [];
        let maxObjective = -Infinity;
        let bestVertex = null;

        for (const vertex of vertices) {
            path.push(vertex);
            const obj = c[0] * vertex[0] + c[1] * vertex[1];
            if (obj > maxObjective) {
                maxObjective = obj;
                bestVertex = vertex;
            }

            svg.select(".content").selectAll(".vertex").data(vertices)
                .join("circle").attr("class", "vertex").attr("cx", d => x(d[0])).attr("cy", d => y(d[1]))
                .attr("r", 4).attr("fill", "var(--color-text-main)");

            svg.select(".content").append("circle").attr("class", "current-vertex")
                .attr("cx", x(vertex[0])).attr("cy", y(vertex[1]))
                .attr("r", 6).attr("fill", "var(--color-accent)")
                .transition().duration(400).attr("r", 8).transition().attr("r", 6);

            await new Promise(resolve => setTimeout(resolve, 400));
        }

        svg.select(".content").append("circle").attr("class", "optimal-vertex")
            .attr("cx", x(bestVertex[0])).attr("cy", y(bestVertex[1]))
            .attr("r", 8).attr("fill", "var(--color-success)");

        solutionText.innerHTML = `<strong>Solution:</strong> [${bestVertex[0].toFixed(2)}, ${bestVertex[1].toFixed(2)}]<br>
                                  <strong>Optimal Value:</strong> ${maxObjective.toFixed(3)}`;
    }

    runBtn.onclick = runSimplex;
    clearBtn.onclick = () => {
        constraints = [...initialConstraints];
        updateFeasibleRegion();
        solutionText.innerHTML = "";
    };
    new ResizeObserver(setupChart).observe(plotContainer);
    setupChart();
    updateFeasibleRegion();
}
