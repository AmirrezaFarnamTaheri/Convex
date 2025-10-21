/**
 * Widget: QP Solver Sandbox
 *
 * Description: An interactive sandbox for defining and solving a simple 2D
 *              Quadratic Program (QP).
 * Version: 2.0.0
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { polygonClip } from "d3-polygon";
// NOTE: A full QP solver is complex. This widget will visualize the problem
// and identify the solution by checking vertices, which is sufficient for this 2D case.

export async function initQPSandbox(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // --- WIDGET LAYOUT ---
    container.innerHTML = `
        <div class="qp-sandbox-widget">
            <div id="plot-container" style="width: 100%; height: 400px; cursor: crosshair;"></div>
            <div class="widget-controls" style="padding: 15px;">
                <h4>Objective: Minimize ½xᵀPx + qᵀx</h4>
                <div id="qp-objective" class="matrix-controls">
                     P = [[<input id="p00" type="number" value="1">, <input id="p01" type="number" value="0">],
                         [<input id="p10" type="number" value="0">, <input id="p11" type="number" value="1">]]
                     q = [<input id="q0" type="number" value="0">, <input id="q1" type="number" value="0">]
                </div>
                <h4>Constraints: Ax ≤ b</h4>
                <p class="widget-instructions">Click-drag on the plot to add constraints.</p>
                <div id="qp-constraints-list"></div>
                <button id="solve-qp-btn">Solve QP</button>
                <div id="qp-solution-text" class="widget-output" style="margin-top: 10px;"></div>
            </div>
        </div>
    `;

    const plotContainer = container.querySelector("#plot-container");
    const constraintsList = container.querySelector("#qp-constraints-list");
    const solveBtn = container.querySelector("#solve-qp-btn");
    const solutionText = container.querySelector("#qp-solution-text");

    let constraints = [[1, 1, 2], [-1, 0, 0], [0, -1, 0]]; // a1, a2, b
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

        x = d3.scaleLinear().domain([-3, 3]).range([0, width]);
        y = d3.scaleLinear().domain([-3, 3]).range([height, 0]);

        svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));
        svg.append("g").call(d3.axisLeft(y));
        svg.append("g").attr("class", "content");

        const drag = d3.drag()
            .on("start", (event) => svg.append("line").attr("class", "drag-line").attr("stroke", "var(--color-accent)"))
            .on("drag", (event) => svg.select(".drag-line").attr("x1", event.subject.x).attr("y1", event.subject.y).attr("x2", event.x).attr("y2", event.y))
            .on("end", (event) => {
                svg.select(".drag-line").remove();
                const p1 = [x.invert(event.subject.x), y.invert(event.subject.y)];
                const p2 = [x.invert(event.x), y.invert(event.y)];
                let normal = [p1[1] - p2[1], p2[0] - p1[0]];
                const norm = Math.sqrt(normal[0]**2 + normal[1]**2);
                if (norm < 1e-6) return;
                normal = normal.map(n => n / norm);
                const b = normal[0] * p1[0] + normal[1] * p1[1];
                constraints.push([...normal, b]);
                update();
            });
        svg.call(drag);
    }

    function getObjective() {
        const P = [
            [+container.querySelector('#p00').value, +container.querySelector('#p01').value],
            [+container.querySelector('#p10').value, +container.querySelector('#p11').value]
        ];
        const q = [+container.querySelector('#q0').value, +container.querySelector('#q1').value];
        return (x, y) => 0.5 * (P[0][0]*x*x + (P[0][1]+P[1][0])*x*y + P[1][1]*y*y) + q[0]*x + q[1]*y;
    }

    function update() {
        renderConstraintsList();
        const objectiveFunc = getObjective();

        let subjectPolygon = [[-10, -10], [10, -10], [10, 10], [-10, 10]];
        constraints.forEach(c => {
            const clipPolygon = halfPlaneToPolygon({ a: c.slice(0, 2), b: c[2] });
            subjectPolygon = polygonClip(clipPolygon, subjectPolygon);
        });

        svg.select(".content").selectAll("*").remove();

        // Draw Contours
        const gridSize = 50;
        const range = 3;
        const grid = d3.range(-range, range + 0.1, 2 * range / gridSize);
        const contourData = grid.flatMap(y => grid.map(x => objectiveFunc(x, y)));
        const contours = d3.contours().size([gridSize, gridSize]).thresholds(15)(contourData);
        svg.select(".content").append("g").selectAll("path").data(contours)
            .join("path").attr("d", d3.geoPath(d3.geoIdentity().scale(x(grid[1]) - x(grid[0]))))
            .attr("fill", "none").attr("stroke", "var(--color-surface-1)");

        if (subjectPolygon) {
             svg.select(".content").append("path").datum(subjectPolygon)
                .attr("d", d3.line().x(d => x(d[0])).y(d => y(d[1]))).attr("fill", "var(--color-primary-light)");
        }

        // Find Solution
        if (subjectPolygon) {
            const vertices = subjectPolygon.slice(0, subjectPolygon.length - 1);
            if(vertices.length > 0) {
                let bestVertex = vertices[0];
                let minObjective = objectiveFunc(bestVertex[0], bestVertex[1]);
                vertices.forEach(v => {
                    const obj = objectiveFunc(v[0], v[1]);
                    if (obj < minObjective) {
                        minObjective = obj;
                        bestVertex = v;
                    }
                });

                svg.select(".content").append("circle").attr("cx", x(bestVertex[0])).attr("cy", y(bestVertex[1]))
                    .attr("r", 6).attr("fill", "var(--color-danger)");
                solutionText.textContent = `Solution: [${bestVertex[0].toFixed(2)}, ${bestVertex[1].toFixed(2)}]`;
            }
        }
    }

    function halfPlaneToPolygon({ a, b }) {
        const p1 = [a[0] * b, a[1] * b];
        const p2 = [p1[0] - a[1] * 20, p1[1] + a[0] * 20];
        const p3 = [p1[0] + a[1] * 20, p1[1] - a[0] * 20];
        return [p2, p3, ...p3.map((v,i) => v - a[i]*20), ...p2.map((v,i) => v - a[i]*20)];
    }

    function renderConstraintsList() {
        constraintsList.innerHTML = '';
        constraints.forEach((c, i) => {
            const div = document.createElement("div");
            div.innerHTML = `<span>${c[0].toFixed(2)}x₁ + ${c[1].toFixed(2)}x₂ ≤ ${c[2].toFixed(2)}</span>
                             <button>✖</button>`;
            div.querySelector('button').onclick = () => { constraints.splice(i, 1); update(); };
            constraintsList.appendChild(div);
        });
    }

    solveBtn.onclick = update;
    new ResizeObserver(setupChart).observe(plotContainer);
    setupChart();
    update();
}
