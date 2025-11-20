/**
 * Widget: Convergence Comparison
 *
 * Description: An animated plot comparing the convergence rates of a convex
 *              solver vs. a generic non-convex solver.
 * Version: 2.1.0
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
                    <button id="run-comparison-btn" class="widget-btn primary">Start Convergence Race</button>
                </div>
            </div>

            <div class="widget-canvas-container" id="plot-container" style="height: 350px;"></div>

            <div class="widget-output" style="display: flex; gap: 20px; justify-content: space-between;">
                 <div id="legend"></div>
                 <div id="status-text" style="color: var(--color-text-muted);">Ready to race.</div>
            </div>
        </div>
    `;

    const runBtn = container.querySelector("#run-comparison-btn");
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

        x = d3.scaleLinear().domain([0, 40]).range([0, width]);
        y = d3.scaleLog().domain([0.001, 10]).range([height, 0]);

        // Grid
        svg.append("g").attr("class", "grid-line").call(d3.axisLeft(y).ticks(5).tickSize(-width).tickFormat(""));
        svg.append("g").attr("class", "grid-line").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x).ticks(10).tickSize(-height).tickFormat(""));

        // Axes
        svg.append("g").attr("class", "axis").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));
        svg.append("g").attr("class", "axis").call(d3.axisLeft(y).ticks(5, ".0e"));

        // Labels
        svg.append("text").attr("class", "axis-label").attr("x", width).attr("y", height + 35).attr("text-anchor", "end").text("Iterations")
           .attr("fill", "var(--color-text-muted)").style("font-size", "0.85rem");

        svg.append("text").attr("class", "axis-label").attr("transform", "rotate(-90)").attr("y", -40).attr("dy", "1em").attr("text-anchor", "end").text("Error |f(x) - p*|")
           .attr("fill", "var(--color-text-muted)").style("font-size", "0.85rem");

        // Paths
        svg.append("path").attr("class", "convex-path").attr("fill", "none")
            .attr("stroke", "var(--color-success)").attr("stroke-width", 3);

        svg.append("path").attr("class", "non-convex-path").attr("fill", "none")
            .attr("stroke", "var(--color-error)").attr("stroke-width", 3);

        // Marker dots
        svg.append("circle").attr("class", "convex-dot").attr("r", 0).attr("fill", "var(--color-success)");
        svg.append("circle").attr("class", "non-convex-dot").attr("r", 0).attr("fill", "var(--color-error)");
    }

    function generateData() {
        // Linear convergence for convex
        const convexData = d3.range(0, 41).map(i => ({ iter: i, val: 8 * Math.pow(0.8, i) }));

        // Stuck in local minima for non-convex
        const nonConvexData = d3.range(0, 41).map(i => {
            let val;
            if (i < 10) val = 8 * Math.pow(0.7, i); // Fast initial
            else if (i < 20) val = 0.2 + 0.1 * Math.sin(i); // Stuck
            else val = 0.2; // Flatline
            return { iter: i, val: Math.max(0.001, val) };
        });
        return { convexData, nonConvexData };
    }

    function runAnimation() {
        runBtn.disabled = true;
        statusText.textContent = "Optimizing...";

        const { convexData, nonConvexData } = generateData();
        const line = d3.line().x(d => x(d.iter)).y(d => y(d.val));

        const animateLine = (selector, data, dotSelector, delay=0) => {
            const path = svg.select(selector);
            const dot = svg.select(dotSelector);

            path.datum(data).attr("d", line);
            const len = path.node().getTotalLength();

            path.attr("stroke-dasharray", `${len} ${len}`)
                .attr("stroke-dashoffset", len)
                .transition().delay(delay).duration(3000).ease(d3.easeLinear)
                .attr("stroke-dashoffset", 0)
                .on("end", () => {
                    if(selector.includes("non-convex")) {
                        runBtn.disabled = false;
                        statusText.innerHTML = "<span style='color: var(--color-success); font-weight: bold;'>Complete.</span>";
                    }
                });

            dot.attr("r", 5).attr("cx", x(data[0].iter)).attr("cy", y(data[0].val))
               .transition().delay(delay).duration(3000).ease(d3.easeLinear)
               .attrTween("transform", function() {
                  return function(t) {
                    const p = path.node().getPointAtLength(t * len);
                    return `translate(${p.x - x(data[0].iter)}, ${p.y - y(data[0].val)})`; // Relative move
                    // Actually easier:
                    // const p = path.node().getPointAtLength(t * len);
                    // d3.select(this).attr("cx", p.x).attr("cy", p.y);
                  };
               })
               .tween("move", function() {
                   return function(t) {
                       const p = path.node().getPointAtLength(t * len);
                       d3.select(this).attr("cx", p.x).attr("cy", p.y);
                   }
               });
        };

        animateLine(".convex-path", convexData, ".convex-dot");
        animateLine(".non-convex-path", nonConvexData, ".non-convex-dot");
    }

    function setupLegend() {
        legendContainer.innerHTML = `
            <div style="display: flex; gap: 16px; align-items: center;">
                <div style="display: flex; align-items: center; gap: 6px;">
                    <div style="width: 12px; height: 12px; background: var(--color-success); border-radius: 2px;"></div>
                    <span style="font-size: 0.9rem;">Convex (Global Opt)</span>
                </div>
                <div style="display: flex; align-items: center; gap: 6px;">
                    <div style="width: 12px; height: 12px; background: var(--color-error); border-radius: 2px;"></div>
                    <span style="font-size: 0.9rem;">Non-Convex (Local Opt)</span>
                </div>
            </div>
        `;
    }

    runBtn.addEventListener("click", runAnimation);

    new ResizeObserver(() => {
        setupChart();
    }).observe(plotContainer);

    setupChart();
    setupLegend();
}
