/**
 * Widget: Separating Hyperplane Visualizer
 *
 * Description: Draw two convex sets and find a separating hyperplane between them.
 * Version: 2.0.0
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function initSeparatingHyperplane(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // --- WIDGET LAYOUT ---
    container.innerHTML = `
        <div class="separating-hyperplane-widget">
            <div id="drawing-area" style="width: 100%; height: 400px; touch-action: none;"></div>
            <div class="widget-controls" style="padding: 15px;">
                <p><strong>Instructions:</strong> Draw Set 1, then click "Next Set". Then draw Set 2 and click "Find Hyperplane".</p>
                <button id="next-set-btn">Next Set</button>
                <button id="find-hyperplane-btn" disabled>Find Hyperplane</button>
                <button id="reset-btn">Reset</button>
                <div id="status-output" class="widget-output" style="margin-top: 10px;"></div>
            </div>
        </div>
    `;

    const drawingArea = container.querySelector("#drawing-area");
    const nextSetBtn = container.querySelector("#next-set-btn");
    const findBtn = container.querySelector("#find-hyperplane-btn");
    const resetBtn = container.querySelector("#reset-btn");
    const statusOutput = container.querySelector("#status-output");

    let svg, x, y;
    let points1 = [], points2 = [];
    let currentDrawingSet = 1;
    let isDrawing = false;

    function setupChart() {
        drawingArea.innerHTML = '';
        const margin = { top: 10, right: 10, bottom: 10, left: 10 };
        const width = drawingArea.clientWidth - margin.left - margin.right;
        const height = drawingArea.clientHeight - margin.top - margin.bottom;

        svg = d3.select(drawingArea).append("svg")
            .attr("width", "100%").attr("height", "100%")
            .attr("viewBox", `0 0 ${drawingArea.clientWidth} ${drawingArea.clientHeight}`)
            .append("g").attr("transform", `translate(${margin.left},${margin.top})`);

        x = d3.scaleLinear().domain([0, width]).range([0, width]);
        y = d3.scaleLinear().domain([0, height]).range([0, height]);

        svg.append("path").attr("class", "path1").attr("fill", "var(--color-primary-light)").attr("stroke", "var(--color-primary)");
        svg.append("path").attr("class", "path2").attr("fill", "var(--color-accent-light)").attr("stroke", "var(--color-accent)");
        svg.append("line").attr("class", "hyperplane").attr("stroke", "var(--color-danger)").attr("stroke-width", 2.5).style("opacity", 0);

        const drag = d3.drag()
            .on("start", (event) => {
                isDrawing = true;
                const currentPoints = (currentDrawingSet === 1) ? points1 : points2;
                currentPoints.length = 0;
                currentPoints.push(d3.pointer(event, svg.node()));
                svg.select(".hyperplane").style("opacity", 0);
            })
            .on("drag", (event) => {
                if (!isDrawing) return;
                const currentPoints = (currentDrawingSet === 1) ? points1 : points2;
                currentPoints.push(d3.pointer(event, svg.node()));
                updateDrawing();
            })
            .on("end", () => { isDrawing = false; });
        svg.call(drag);
    }

    function updateDrawing() {
        const line = d3.line().curve(d3.curveBasis);
        svg.select(".path1").attr("d", points1.length > 1 ? line(points1) + "Z" : "");
        svg.select(".path2").attr("d", points2.length > 1 ? line(points2) + "Z" : "");
    }

    function reset() {
        points1 = []; points2 = [];
        currentDrawingSet = 1;
        updateDrawing();
        svg.select(".hyperplane").style("opacity", 0);
        statusOutput.textContent = "";
        nextSetBtn.disabled = false;
        findBtn.disabled = true;
    }

    function findAndDrawHyperplane() {
        if (points1.length < 3 || points2.length < 3) return;

        const hull1 = d3.polygonHull(points1);
        const hull2 = d3.polygonHull(points2);

        // Simple check for intersection
        if (d3.polygonContains(hull1, hull2[0]) || d3.polygonContains(hull2, hull1[0])) {
             statusOutput.innerHTML = `<span style="color: var(--color-danger);">Sets must be disjoint.</span>`;
             return;
        }

        let minDist = Infinity;
        let closestPair = [];

        for (let p1 of hull1) {
            for (let p2 of hull2) {
                const dist = (p1[0] - p2[0])**2 + (p1[1] - p2[1])**2;
                if (dist < minDist) {
                    minDist = dist;
                    closestPair = [p1, p2];
                }
            }
        }

        const [p1, p2] = closestPair;
        const midPoint = [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2];
        const normal = [p2[0] - p1[0], p2[1] - p1[1]];

        const [a, b] = normal;
        const c = a * midPoint[0] + b * midPoint[1];

        let x1, y1, x2, y2;
        if (Math.abs(b) > 1e-6) {
            x1 = -1000; y1 = (c - a * x1) / b;
            x2 = 1000; y2 = (c - a * x2) / b;
        } else {
            y1 = -1000; x1 = c / a;
            y2 = 1000; x2 = c / a;
        }

        svg.select(".hyperplane")
            .attr("x1", x1).attr("y1", y1)
            .attr("x2", x2).attr("y2", y2)
            .transition().duration(500)
            .style("opacity", 1);
        statusOutput.innerHTML = `<span style="color: var(--color-success);">Hyperplane found!</span>`;
    }

    nextSetBtn.addEventListener("click", () => {
        if (currentDrawingSet === 1 && points1.length > 2) {
            currentDrawingSet = 2;
            nextSetBtn.disabled = true;
            findBtn.disabled = false;
            statusOutput.textContent = "Now draw Set 2.";
        }
    });
    findBtn.addEventListener("click", findAndDrawHyperplane);
    resetBtn.addEventListener("click", reset);

    new ResizeObserver(setupChart).observe(drawingArea);
    setupChart();
}
