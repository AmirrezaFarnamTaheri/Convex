/**
 * Widget: Polyhedron Visualizer
 *
 * Description: Interactively define a polyhedron by adding and manipulating
 *              linear inequality constraints.
 * Version: 2.0.0
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { polygonClip } from "d3-polygon";

export function initPolyhedronVisualizer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // --- WIDGET LAYOUT ---
    container.innerHTML = `
        <div class.polyhedron-visualizer-widget">
            <div id="plot-container" style="width: 100%; height: 400px; cursor: crosshair;"></div>
            <div class="widget-controls" style="padding: 15px;">
                <div id="constraints-list"></div>
                <div id="instructions" class="widget-output" style="margin-top: 10px;">
                    Click and drag on the plot to add a new constraint.
                </div>
            </div>
        </div>
    `;

    const plotContainer = container.querySelector("#plot-container");
    const constraintsList = container.querySelector("#constraints-list");
    let constraints = [];
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

        x = d3.scaleLinear().domain([-5, 5]).range([0, width]);
        y = d3.scaleLinear().domain([-5, 5]).range([height, 0]);

        svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));
        svg.append("g").call(d3.axisLeft(y));

        svg.append("path").attr("class", "feasible-region")
            .attr("fill", "var(--color-primary-light)").attr("opacity", 0.8);
        svg.append("g").attr("class", "constraint-lines");

        const drag = d3.drag()
            .on("start", (event) => {
                const [x0, y0] = d3.pointer(event, svg.node());
                svg.append("line").attr("class", "drag-line")
                    .attr("x1", x0).attr("y1", y0).attr("x2", x0).attr("y2", y0)
                    .attr("stroke", "var(--color-accent)").attr("stroke-width", 2);
            })
            .on("drag", (event) => {
                const [x1, y1] = d3.pointer(event, svg.node());
                svg.select(".drag-line").attr("x2", x1).attr("y2", y1);
            })
            .on("end", (event) => {
                const [x0, y0] = [svg.select(".drag-line").attr("x1"), svg.select(".drag-line").attr("y1")];
                const [x1, y1] = d3.pointer(event, svg.node());
                svg.select(".drag-line").remove();

                const p1 = [x.invert(x0), y.invert(y0)];
                const p2 = [x.invert(x1), y.invert(y1)];
                const normal = [(p2[1] - p1[1]), -(p2[0] - p1[0])];
                const norm = Math.sqrt(normal[0]**2 + normal[1]**2);
                if (norm < 1e-6) return;
                normal[0] /= norm; normal[1] /= norm;

                const b = normal[0] * p1[0] + normal[1] * p1[1];
                constraints.push({ a: normal, b: b });
                update();
            });

        svg.call(drag);
    }

    function update() {
        renderConstraintsList();

        // Sutherland-Hodgman clipping algorithm
        let subjectPolygon = [[-10,-10], [10,-10], [10,10], [-10,10]]; // Large bounding box
        constraints.forEach(c => {
            const clipPolygon = halfPlaneToPolygon(c);
            subjectPolygon = polygonClip(clipPolygon, subjectPolygon);
        });

        if (subjectPolygon && subjectPolygon.length > 0) {
            const line = d3.line().x(d => x(d[0])).y(d => y(d[1]));
            svg.select(".feasible-region").attr("d", line(subjectPolygon) + "Z");
        } else {
            svg.select(".feasible-region").attr("d", null);
        }
    }

    function halfPlaneToPolygon({a, b}) {
        // Defines a large polygon representing the half-plane Ax <= b
        const p1 = [a[0]*b, a[1]*b]; // A point on the line
        const p2 = [p1[0] - a[1]*20, p1[1] + a[0]*20];
        const p3 = [p1[0] + a[1]*20, p1[1] - a[0]*20];
        const p4 = [p3[0] - a[0]*20, p3[1] - a[1]*20];
        const p5 = [p2[0] - a[0]*20, p2[1] - a[1]*20];
        return [p2, p3, p4, p5];
    }

    function renderConstraintsList() {
        constraintsList.innerHTML = '<h4>Constraints (Ax ≤ b)</h4>';
        if (constraints.length === 0) {
            constraintsList.innerHTML += '<p>No constraints defined.</p>';
        }
        constraints.forEach((c, i) => {
            const div = document.createElement("div");
            div.innerHTML = `
                <span>${c.a[0].toFixed(2)}x₁ + ${c.a[1].toFixed(2)}x₂ ≤ ${c.b.toFixed(2)}</span>
                <button data-index="${i}">✖</button>
            `;
            div.querySelector('button').onclick = () => {
                constraints.splice(i, 1);
                update();
            };
            constraintsList.appendChild(div);
        });
    }

    new ResizeObserver(setupChart).observe(plotContainer);
    setupChart();
    update();
}
