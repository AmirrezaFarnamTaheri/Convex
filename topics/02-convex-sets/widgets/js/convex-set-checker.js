/**
 * Widget: Convex Set Checker
 *
 * Description: Allows users to draw a 2D shape by placing vertices and checks if it's a convex set in real-time.
 *              Provides visual feedback by coloring the shape and showing its convex hull.
 * Version: 2.1.0 (Refined)
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function initConvexSetChecker(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="convex-checker-widget">
            <div id="plot-area" class="plot-area"></div>
            <div class="controls-area">
                <button id="clear-btn" class="widget-button">Clear Polygon</button>
                <div id="status-output" class="output-box">Click on the grid to add vertices and create a polygon.</div>
            </div>
        </div>
    `;

    const plotArea = container.querySelector("#plot-area");
    const clearBtn = container.querySelector("#clear-btn");
    const statusOutput = container.querySelector("#status-output");

    let svg, x, y;
    let points = [];

    function setupChart() {
        plotArea.innerHTML = '';
        const margin = { top: 10, right: 10, bottom: 10, left: 10 };
        const width = plotArea.clientWidth - margin.left - margin.right;
        const height = plotArea.clientHeight - margin.top - margin.bottom;

        svg = d3.select(plotArea).append("svg")
            .attr("width", "100%").attr("height", "100%")
            .attr("viewBox", `0 0 ${plotArea.clientWidth} ${plotArea.clientHeight}`)
            .append("g").attr("transform", `translate(${margin.left},${margin.top})`);

        x = d3.scaleLinear().domain([-10, 10]).range([0, width]);
        y = d3.scaleLinear().domain([-10, 10]).range([height, 0]);

        svg.append("rect").attr("width", width).attr("height", height).attr("class", "plot-background").on("click", addPoint);
        const grid = svg.append("g").attr("class", "grid");
        grid.selectAll("line.x-grid").data(x.ticks(20)).enter().append("line").attr("class", "x-grid").attr("x1",d=>x(d)).attr("x2",d=>x(d)).attr("y1",0).attr("y2",height);
        grid.selectAll("line.y-grid").data(y.ticks(20)).enter().append("line").attr("class", "y-grid").attr("x1",0).attr("x2",width).attr("y1",d=>y(d)).attr("y2",d=>y(d));

        svg.append("path").attr("class", "hull-path");
        svg.append("path").attr("class", "drawn-polygon");
        svg.append("g").attr("class", "points-group");
    }

    const drag = d3.drag()
        .on("start", (event) => event.subject.active = true)
        .on("drag", (event, d) => {
            const [mx, my] = d3.pointer(event, svg.node());
            d[0] = x.invert(mx);
            d[1] = y.invert(my);
            update();
        })
        .on("end", (event) => delete event.subject.active);

    function addPoint(event) {
        const [mx, my] = d3.pointer(event);
        points.push([x.invert(mx), y.invert(my)]);
        update();
    }

    function update() {
        const pointsGroup = svg.select(".points-group");
        pointsGroup.selectAll("circle").data(points)
            .join("circle")
            .attr("class", "vertex-handle")
            .attr("cx", d => x(d[0])).attr("cy", d => y(d[1]))
            .attr("r", 6).call(drag);

        if (points.length > 2) {
            const polygon = points.map(p => [x(p[0]), y(p[1])]);
            const hull = d3.polygonHull(points);

            svg.select(".drawn-polygon").attr("d", "M" + polygon.join("L") + "Z");
            svg.select(".hull-path").datum(hull).attr("d", d => "M" + d.map(p => [x(p[0]), y(p[1])]).join("L") + "Z");

            const isShapeConvex = checkConvexity(points);
            svg.select(".drawn-polygon").classed("convex", isShapeConvex).classed("non-convex", !isShapeConvex);

            if (isShapeConvex) {
                statusOutput.innerHTML = `<strong class="convex">This shape is convex.</strong> The shape and its convex hull are the same.`;
            } else {
                statusOutput.innerHTML = `<strong class="non-convex">This shape is not convex.</strong> The dotted line shows its convex hull.`;
            }
        } else {
             statusOutput.innerHTML = `Add ${3 - points.length} more point(s) to form a polygon.`;
        }
    }

    function checkConvexity(polygon) {
        if (polygon.length < 3) return true;

        let got_negative = false;
        let got_positive = false;
        const num_points = polygon.length;
        let B, C;
        for (let A = 0; A < num_points; A++) {
            B = (A + 1) % num_points;
            C = (B + 1) % num_points;

            const cross_product =
                (polygon[B][0] - polygon[A][0]) * (polygon[C][1] - polygon[B][1]) -
                (polygon[B][1] - polygon[A][1]) * (polygon[C][0] - polygon[B][0]);

            if (cross_product < 0) got_negative = true;
            else if (cross_product > 0) got_positive = true;

            if (got_negative && got_positive) return false;
        }
        return true;
    }

    function reset() {
        points = [];
        svg.selectAll(".drawn-polygon, .hull-path").attr("d", null);
        svg.select(".points-group").selectAll("*").remove();
        statusOutput.innerHTML = "Click on the grid to add vertices and create a polygon.";
    }

    clearBtn.addEventListener("click", reset);
    new ResizeObserver(setupChart).observe(plotArea);
    setupChart();
}

const style = document.createElement('style');
style.textContent = `
.convex-checker-widget { display: flex; flex-direction: column; height: 100%; background: var(--color-background); border-radius: var(--border-radius-lg); overflow: hidden; }
.plot-area { flex-grow: 1; position: relative; cursor: crosshair; }
.plot-background { fill: var(--color-surface-1); }
.grid line { stroke: var(--color-surface-2); }
.drawn-polygon.convex { fill: var(--color-success); fill-opacity: 0.3; stroke: var(--color-success); stroke-width: 2; }
.drawn-polygon.non-convex { fill: var(--color-error); fill-opacity: 0.3; stroke: var(--color-error); stroke-width: 2; }
.hull-path { fill: none; stroke: var(--color-accent); stroke-width: 2.5; stroke-dasharray: 6 6; }
.vertex-handle { fill: var(--color-primary); stroke: var(--color-background); stroke-width: 2; cursor: grab; }
.vertex-handle:active { cursor: grabbing; }
.output-box strong.convex { color: var(--color-success); }
.output-box strong.non-convex { color: var(--color-error); }
`;
document.head.appendChild(style);
