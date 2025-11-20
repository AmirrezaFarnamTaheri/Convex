/**
 * Widget: Convergence Comparison
 *
 * Description: An animated plot comparing the convergence rates of algorithms on
 *              convex vs non-convex problems. Illustrates linear convergence vs getting stuck.
 * Version: 3.0.0
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function initConvergenceComparison(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // --- WIDGET LAYOUT ---
    container.innerHTML = `
        <div class="widget-container">
            <div class="widget-controls">
                 <div class="widget-control-group" style="flex: 1;">
                    <label class="widget-label">Comparison Scenario</label>
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <button id="run-btn" class="widget-btn primary">Run Comparison</button>
                    </div>
                </div>
            </div>

            <div class="widget-canvas-container" id="plot-container" style="height: 350px;"></div>

            <div class="widget-output" style="display: flex; justify-content: space-between; align-items: center;">
                 <div id="legend"></div>
                 <div id="status-text" style="color: var(--color-text-muted); font-size: 0.9rem;">Ready to simulate.</div>
            </div>
        </div>
    `;

    const runBtn = container.querySelector("#run-btn");
    const plotContainer = container.querySelector("#plot-container");
    const statusText = container.querySelector("#status-text");
    const legendContainer = container.querySelector("#legend");

    let svg, x, y;

    function setupChart() {
        plotContainer.innerHTML = '';
        const margin = { top: 20, right: 20, bottom: 40, left: 50 };
        const width = plotContainer.clientWidth - margin.left - margin.right;
        const height = plotContainer.clientHeight - margin.top - margin.bottom;

        svg = d3.select(plotContainer).append("svg")
            .attr("class", "widget-svg")
            .attr("width", "100%").attr("height", "100%")
            .attr("viewBox", `0 0 ${plotContainer.clientWidth} ${plotContainer.clientHeight}`)
            .append("g").attr("transform", `translate(${margin.left},${margin.top})`);

        x = d3.scaleLinear().domain([0, 50]).range([0, width]);
        y = d3.scaleLog().domain([1e-5, 10]).range([height, 0]);

        // Grid
        svg.append("g").attr("class", "grid-line").call(d3.axisLeft(y).ticks(5).tickSize(-width).tickFormat(""));
        svg.append("g").attr("class", "grid-line").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x).ticks(10).tickSize(-height).tickFormat(""));

        // Axes
        svg.append("g").attr("class", "axis").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));
        svg.append("g").attr("class", "axis").call(d3.axisLeft(y).ticks(5, ".0e"));

        // Labels
        svg.append("text").attr("class", "axis-label").attr("x", width).attr("y", height + 35).attr("text-anchor", "end").text("Iterations (k)")
           .attr("fill", "var(--color-text-muted)").style("font-size", "0.85rem");

        svg.append("text").attr("class", "axis-label").attr("transform", "rotate(-90)").attr("y", -40).attr("dy", "1em").attr("text-anchor", "end").text("Log Error |f(x) - f*|")
           .attr("fill", "var(--color-text-muted)").style("font-size", "0.85rem");

        // Paths
        svg.append("path").attr("class", "convex-path").attr("fill", "none")
            .attr("stroke", "var(--color-success)").attr("stroke-width", 3).attr("opacity", 0.9);

        svg.append("path").attr("class", "non-convex-path").attr("fill", "none")
            .attr("stroke", "var(--color-error)").attr("stroke-width", 3).attr("opacity", 0.9);

        // Marker dots
        svg.append("circle").attr("class", "convex-dot").attr("r", 0).attr("fill", "var(--color-success)").attr("stroke", "#fff").attr("stroke-width", 2);
        svg.append("circle").attr("class", "non-convex-dot").attr("r", 0).attr("fill", "var(--color-error)").attr("stroke", "#fff").attr("stroke-width", 2);
    }

    function generateData() {
        const n = 50;
        // Convex: Linear convergence (geometric decay)
        const convexData = d3.range(0, n+1).map(i => ({ iter: i, val: 8 * Math.pow(0.75, i) + 1e-6 }));

        // Non-Convex: Fast initial drop, then stuck in local min (flatline)
        const nonConvexData = d3.range(0, n+1).map(i => {
            let val;
            if (i < 15) val = 8 * Math.pow(0.6, i); // Fast descent
            else val = 0.1 + 0.02 * Math.cos(i * 0.5); // Stuck in local valley with noise
            return { iter: i, val: Math.max(1e-5, val) };
        });
        return { convexData, nonConvexData };
    }

    function runAnimation() {
        runBtn.disabled = true;
        statusText.textContent = "Running Descent Algorithms...";

        // Reset
        svg.selectAll("path").attr("d", null);
        svg.selectAll("circle").attr("r", 0);

        const { convexData, nonConvexData } = generateData();
        const line = d3.line().x(d => x(d.iter)).y(d => y(d.val));

        const animateLine = (selector, data, dotSelector, onComplete) => {
            const path = svg.select(selector);
            const dot = svg.select(dotSelector);

            path.datum(data).attr("d", line);
            const len = path.node().getTotalLength();

            path.attr("stroke-dasharray", `${len} ${len}`)
                .attr("stroke-dashoffset", len)
                .transition().duration(4000).ease(d3.easeLinear)
                .attr("stroke-dashoffset", 0)
                .on("end", onComplete);

            dot.attr("r", 6).attr("cx", x(data[0].iter)).attr("cy", y(data[0].val))
               .transition().duration(4000).ease(d3.easeLinear)
               .tween("move", function() {
                   return function(t) {
                       const p = path.node().getPointAtLength(t * len);
                       d3.select(this).attr("cx", p.x).attr("cy", p.y);
                   }
               });
        };

        animateLine(".convex-path", convexData, ".convex-dot", () => {});
        animateLine(".non-convex-path", nonConvexData, ".non-convex-dot", () => {
            runBtn.disabled = false;
            statusText.innerHTML = `
                Convex: <span style="color: var(--color-success);">Converged (Global Min)</span> &nbsp;|&nbsp;
                Non-Convex: <span style="color: var(--color-error);">Stuck (Local Min)</span>
            `;
        });
    }

    function setupLegend() {
        legendContainer.innerHTML = `
            <div style="display: flex; gap: 24px; align-items: center;">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="width: 14px; height: 4px; background: var(--color-success); border-radius: 2px;"></div>
                    <span style="font-size: 0.85rem;">Convex (Linear Rate)</span>
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="width: 14px; height: 4px; background: var(--color-error); border-radius: 2px;"></div>
                    <span style="font-size: 0.85rem;">Non-Convex (Stuck)</span>
                </div>
            </div>
        `;
    }

    runBtn.addEventListener("click", runAnimation);

    const resizeObserver = new ResizeObserver(() => {
        setupChart();
    });
    resizeObserver.observe(plotContainer);

    setupChart();
    setupLegend();
}
