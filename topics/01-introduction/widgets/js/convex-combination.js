/**
 * Widget: Convex Combination Explorer
 *
 * Description: Animates the concept of a convex combination, showing the line segment
 *              between two points and allowing exploration of the parameter θ.
 * Version: 2.1.0
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function initConvexCombination(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // --- WIDGET LAYOUT ---
    container.innerHTML = `
        <div class="widget-container">
            <div class="widget-controls">
                 <div class="widget-control-group">
                    <button id="toggle-set-btn" class="widget-btn primary">Switch to Non-Convex Set</button>
                </div>
                <div class="widget-control-group" style="flex: 2;">
                    <label class="widget-label">Interpolation θ = <span id="theta-value" class="widget-value-display">0.50</span></label>
                    <input type="range" id="theta-slider" min="0" max="1" step="0.01" value="0.5" class="widget-slider">
                </div>
            </div>

            <div class="widget-canvas-container" id="plot-container" style="height: 400px;"></div>

            <div id="status-text" class="widget-output"></div>
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

    const convexSetData = [[-8,8], [-8,-8], [8,-8], [8,8]]; // Square
    // U-shape or C-shape polygon for non-convex
    const nonConvexSetData = [[-8,-8], [8,-8], [8,8], [2,8], [2,-2], [-2,-2], [-2,8], [-8,8]];

    let isConvex = true;
    let currentSetData = convexSetData;

    function setupChart() {
        plotContainer.innerHTML = '';
        const margin = { top: 20, right: 20, bottom: 20, left: 20 };
        const width = plotContainer.clientWidth - margin.left - margin.right;
        const height = plotContainer.clientHeight - margin.top - margin.bottom;

        svg = d3.select(plotContainer).append("svg")
            .attr("class", "widget-svg")
            .attr("width", "100%").attr("height", "100%")
            .attr("viewBox", `0 0 ${plotContainer.clientWidth} ${plotContainer.clientHeight}`)
            .append("g").attr("transform", `translate(${margin.left + width / 2},${margin.top + height / 2})`);

        x = d3.scaleLinear().domain([-10, 10]).range([-width / 2, width / 2]);
        y = d3.scaleLinear().domain([-10, 10]).range([height / 2, -height / 2]);

        // Draw set
        svg.append("path").attr("class", "set-path")
            .attr("fill", "rgba(124, 197, 255, 0.2)")
            .attr("stroke", "var(--color-primary)")
            .attr("stroke-width", 2);

        // Draw line segment
        svg.append("line").attr("class", "line-segment")
            .attr("stroke", "var(--color-text-muted)")
            .attr("stroke-width", 2)
            .attr("stroke-dasharray", "5 5");

        // Handles
        svg.append("circle").attr("class", "p1-handle handle").attr("r", 8).attr("fill", "var(--color-accent)").call(createDrag(p1));
        svg.append("circle").attr("class", "p2-handle handle").attr("r", 8).attr("fill", "var(--color-accent)").call(createDrag(p2));

        // Interpolated point
        svg.append("circle").attr("class", "interpolated-point").attr("r", 6).attr("stroke", "#fff").attr("stroke-width", 1.5);

        // Labels
        svg.append("text").attr("class", "p1-label").attr("fill", "var(--color-text-main)").attr("font-weight", "bold").text("x").attr("dy", -12);
        svg.append("text").attr("class", "p2-label").attr("fill", "var(--color-text-main)").attr("font-weight", "bold").text("y").attr("dy", -12);
    }

    function update() {
        // Update set
        const pathGen = d3.line().x(d => x(d[0])).y(d => y(d[1]));
        svg.select(".set-path").attr("d", pathGen(currentSetData) + "Z");

        // Update handles
        svg.select(".p1-handle").attr("cx", x(p1.x)).attr("cy", y(p1.y));
        svg.select(".p2-handle").attr("cx", x(p2.x)).attr("cy", y(p2.y));

        svg.select(".p1-label").attr("x", x(p1.x)).attr("y", y(p1.y));
        svg.select(".p2-label").attr("x", x(p2.x)).attr("y", y(p2.y));

        // Update line
        svg.select(".line-segment")
            .attr("x1", x(p1.x)).attr("y1", y(p1.y))
            .attr("x2", x(p2.x)).attr("y2", y(p2.y));

        updateInterpolation();
    }

    function updateInterpolation() {
        const theta = parseFloat(thetaSlider.value);
        thetaValueSpan.textContent = theta.toFixed(2);

        const ix = (1 - theta) * p1.x + theta * p2.x;
        const iy = (1 - theta) * p1.y + theta * p2.y;

        svg.select(".interpolated-point")
            .attr("cx", x(ix))
            .attr("cy", y(iy));

        const isInside = d3.polygonContains(currentSetData, [ix, iy]);

        const color = isInside ? "var(--color-success)" : "var(--color-error)";
        svg.select(".interpolated-point").attr("fill", color);

        statusText.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <div>
                    Point z = (1-θ)x + θy is
                    <strong style="color: ${color}; font-size: 1.1em;">
                        ${isInside ? 'INSIDE' : 'OUTSIDE'}
                    </strong> the set.
                </div>
                <div style="margin-left: auto; font-size: 0.9em; color: var(--color-text-muted);">
                    ${isConvex ? "Convex Set: Line segment is always inside." : "Non-Convex Set: Line segment may exit set."}
                </div>
            </div>
        `;
    }

    function createDrag(point) {
        return d3.drag()
            .on("start", (event) => d3.select(event.sourceEvent.target).raise().classed("active", true))
            .on("drag", (event) => {
                const [mx, my] = d3.pointer(event, svg.node());
                // Clamp to plot
                point.x = Math.max(-10, Math.min(10, x.invert(mx)));
                point.y = Math.max(-10, Math.min(10, y.invert(my)));
                update();
            })
            .on("end", (event) => d3.select(event.sourceEvent.target).classed("active", false));
    }

    toggleBtn.addEventListener("click", () => {
        isConvex = !isConvex;
        currentSetData = isConvex ? convexSetData : nonConvexSetData;
        toggleBtn.textContent = isConvex ? "Switch to Non-Convex Set" : "Switch to Convex Set";
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
