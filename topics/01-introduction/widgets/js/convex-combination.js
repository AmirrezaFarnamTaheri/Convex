/**
 * Widget: Convex Combination Explorer
 *
 * Description: Animates the concept of a convex combination, showing the line segment
 *              between two points and allowing exploration of the parameter θ.
 * Version: 2.0.0
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { polygonContains } from "d3-polygon";

export function initConvexCombination(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // --- WIDGET LAYOUT ---
    container.innerHTML = `
        <div class="convex-combination-widget">
            <div id="plot-container" style="width: 100%; height: 400px;"></div>
            <div class="widget-controls" style="padding: 15px;">
                <button id="toggle-set-btn">Show Non-Convex Set</button>
                <div style="margin-top: 10px;">
                    <label for="theta-slider">θ = <span id="theta-value">0.50</span></label>
                    <input type="range" id="theta-slider" min="0" max="1" step="0.01" value="0.5" style="width: 100%;">
                </div>
                <div id="status-text" class="widget-output" style="margin-top: 10px; min-height: 2em;"></div>
            </div>
        </div>
    `;

    const plotContainer = container.querySelector("#plot-container");
    const toggleBtn = container.querySelector("#toggle-set-btn");
    const thetaSlider = container.querySelector("#theta-slider");
    const thetaValueSpan = container.querySelector("#theta-value");
    const statusText = container.querySelector("#status-text");

    let svg, x, y;
    let p1 = { x: -5, y: -2 };
    let p2 = { x: 5, y: 3 };

    const convexSetData = [[-8,8], [-8,-8], [8,-8], [8,8]]; // A simple square
    const nonConvexSetData = [[-8,-8], [8,-8], [8,4], [-2,4], [-2,0], [2,0], [2,8], [-8,8]];

    let isConvex = true;
    let currentSetData = convexSetData;

    function setupChart() {
        plotContainer.innerHTML = '';
        const margin = { top: 20, right: 20, bottom: 20, left: 20 };
        const width = plotContainer.clientWidth - margin.left - margin.right;
        const height = plotContainer.clientHeight - margin.top - margin.bottom;

        svg = d3.select(plotContainer).append("svg")
            .attr("width", "100%").attr("height", "100%")
            .attr("viewBox", `0 0 ${plotContainer.clientWidth} ${plotContainer.clientHeight}`)
            .append("g").attr("transform", `translate(${margin.left + width / 2},${margin.top + height / 2})`);

        x = d3.scaleLinear().domain([-10, 10]).range([-width / 2, width / 2]);
        y = d3.scaleLinear().domain([-10, 10]).range([height / 2, -height / 2]);

        svg.append("path").attr("class", "set-path")
            .attr("fill", "var(--color-primary-light)")
            .attr("stroke", "var(--color-primary)")
            .attr("stroke-width", 2);

        svg.append("line").attr("class", "line-segment")
            .attr("stroke", "var(--color-text-secondary)")
            .attr("stroke-width", 2).attr("stroke-dasharray", "5 5");

        svg.append("circle").attr("class", "p1-handle").attr("r", 8).attr("fill", "var(--color-accent)").call(createDrag(p1));
        svg.append("circle").attr("class", "p2-handle").attr("r", 8).attr("fill", "var(--color-accent)").call(createDrag(p2));
        svg.append("circle").attr("class", "interpolated-point").attr("r", 6);
    }

    function update() {
        svg.select(".set-path").attr("d", d3.line().x(d => x(d[0])).y(d => y(d[1]))(currentSetData) + "Z");
        svg.select(".p1-handle").attr("cx", x(p1.x)).attr("cy", y(p1.y));
        svg.select(".p2-handle").attr("cx", x(p2.x)).attr("cy", y(p2.y));
        svg.select(".line-segment").attr("x1", x(p1.x)).attr("y1", y(p1.y)).attr("x2", x(p2.x)).attr("y2", y(p2.y));
        updateInterpolation();
    }

    function updateInterpolation() {
        const theta = parseFloat(thetaSlider.value);
        thetaValueSpan.textContent = theta.toFixed(2);

        const ix = (1 - theta) * p1.x + theta * p2.x;
        const iy = (1 - theta) * p1.y + theta * p2.y;

        svg.select(".interpolated-point").attr("cx", x(ix)).attr("cy", y(iy));

        const isInside = polygonContains(currentSetData, [ix, iy]);

        svg.select(".interpolated-point").attr("fill", isInside ? "var(--color-success)" : "var(--color-danger)");
        statusText.innerHTML = `For θ=${theta.toFixed(2)}, the point (1-θ)x₁ + θx₂ is
            <strong style="color: ${isInside ? 'var(--color-success)' : 'var(--color-danger)'};">
            ${isInside ? 'INSIDE' : 'OUTSIDE'}
            </strong> the set.`;
    }

    function createDrag(point) {
        return d3.drag().on("start", (event) => d3.select(event.sourceEvent.target).raise())
            .on("drag", (event) => {
                const [mx, my] = d3.pointer(event, svg.node());
                point.x = x.invert(mx);
                point.y = y.invert(my);
                update();
            });
    }

    toggleBtn.addEventListener("click", () => {
        isConvex = !isConvex;
        currentSetData = isConvex ? convexSetData : nonConvexSetData;
        toggleBtn.textContent = isConvex ? "Show Non-Convex Set" : "Show Convex Set";
        update();
    });

    thetaSlider.addEventListener("input", updateInterpolation);

    new ResizeObserver(() => {
        setupChart();
        update();
    }).observe(plotContainer);

    setupChart();
    update();
}
