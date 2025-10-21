/**
 * Widget: Convex Combination Animator
 *
 * Description: Animates the concept of a convex combination by showing the line segment between two points remaining within a set.
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { polygonContains } from "d3-polygon";

export function initConvexCombination(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="convex-combination-widget">
            <div class="widget-controls">
                <button id="toggle-set-btn">Show Non-Convex Set</button>
                <label for="theta-slider">θ:</label>
                <input type="range" id="theta-slider" min="0" max="1" step="0.01" value="0.5">
                <span id="theta-value">0.50</span>
            </div>
            <div id="plot-container"></div>
            <div id="status-text" class="widget-output"></div>
        </div>
    `;

    const plotContainer = container.querySelector("#plot-container");
    const toggleBtn = container.querySelector("#toggle-set-btn");
    const thetaSlider = container.querySelector("#theta-slider");
    const thetaValueSpan = container.querySelector("#theta-value");
    const statusText = container.querySelector("#status-text");

    const margin = {top: 20, right: 20, bottom: 20, left: 20};
    const width = plotContainer.clientWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(plotContainer).append("svg")
        .attr("width", "100%")
        .attr("height", height + margin.top + margin.bottom)
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .append("g")
        .attr("transform", `translate(${width/2 + margin.left},${height/2 + margin.top})`);

    const x = d3.scaleLinear().domain([-10, 10]).range([-width/2, width/2]);
    const y = d3.scaleLinear().domain([-10, 10]).range([height/2, -height/2]);

    const convexSetData = d3.range(0, 2 * Math.PI, 0.1).map(a => [8 * Math.cos(a), 8 * Math.sin(a)]);
    const nonConvexSetData = [[-8,-8], [8,-8], [8,0], [0,0], [0,8], [-8,8]];

    let isConvex = true;
    let currentSetData = convexSetData;

    const setPath = svg.append("path")
        .attr("fill", "var(--color-primary-light)")
        .attr("stroke", "var(--color-primary)")
        .attr("stroke-width", 2);

    let p1 = {x: -5, y: -2};
    let p2 = {x: 5, y: 3};

    const lineSegment = svg.append("line")
        .attr("stroke", "var(--color-text-secondary)")
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "5 5");

    const p1_handle = svg.append("circle").attr("r", 8).attr("fill", "var(--color-accent)").call(createDrag(p1));
    const p2_handle = svg.append("circle").attr("r", 8).attr("fill", "var(--color-accent)").call(createDrag(p2));
    const interpolatedPoint = svg.append("circle").attr("r", 6).attr("fill", "var(--color-danger)");

    function update() {
        setPath.attr("d", d3.line().x(d => x(d[0])).y(d => y(d[1]))(currentSetData) + "Z");

        p1_handle.attr("cx", x(p1.x)).attr("cy", y(p1.y));
        p2_handle.attr("cx", x(p2.x)).attr("cy", y(p2.y));

        lineSegment.attr("x1", x(p1.x)).attr("y1", y(p1.y))
                   .attr("x2", x(p2.x)).attr("y2", y(p2.y));

        updateInterpolation();
    }

    function updateInterpolation() {
        const theta = +thetaSlider.value;
        thetaValueSpan.textContent = theta.toFixed(2);

        const ix = (1 - theta) * p1.x + theta * p2.x;
        const iy = (1 - theta) * p1.y + theta * p2.y;

        interpolatedPoint.attr("cx", x(ix)).attr("cy", y(iy));

        const isInside = polygonContains(currentSetData.map(p => [x(p[0]), y(p[1])]), [x(ix), y(iy)]);

        interpolatedPoint.attr("fill", isInside ? "var(--color-success)" : "var(--color-danger)");
        statusText.innerHTML = `For θ=${theta.toFixed(2)}, the point is
            <strong style="color: ${isInside ? 'var(--color-success)' : 'var(--color-danger)'};">
            ${isInside ? 'INSIDE' : 'OUTSIDE'}
            </strong> the set.`;
    }

    function createDrag(point) {
        return d3.drag().on("drag", function(event) {
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

    update();
}
