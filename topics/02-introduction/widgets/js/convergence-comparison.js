/**
 * Widget: Convergence Comparison
 *
 * Description: An animated plot comparing the convergence rates of algorithms on
 *              convex vs non-convex problems. Illustrates linear convergence vs getting stuck.
 * Version: 3.1.0 (Styled)
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function initConvergenceComparison(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // --- WIDGET LAYOUT ---
    container.innerHTML = `
        <div class="widget-container">
            <div class="widget-controls" style="display:flex; justify-content:space-between; align-items:center;">
                 <div class="control-group">
                    <label style="font-size:var(--text-xs); color:var(--text-tertiary);">Scenario</label>
                    <div style="font-weight:600; color:var(--text-primary); font-size:0.9rem;">Descent Trajectory</div>
                </div>
                <button id="run-btn" class="btn btn-primary btn-sm"><i data-feather="play" style="width:14px;margin-right:4px;"></i> Run Comparison</button>
            </div>

            <div class="widget-canvas-container" id="plot-container" style="height: 350px; background:var(--bg-surface-1);"></div>

            <div class="widget-output" style="display: flex; justify-content: space-between; align-items: center; background:var(--bg-surface-2); padding:12px; border-top:1px solid var(--border-subtle);">
                 <div id="legend"></div>
                 <div id="status-text" style="color: var(--text-tertiary); font-size: 0.8rem;">Ready to simulate.</div>
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
        const margin = { top: 20, right: 30, bottom: 40, left: 50 };
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
           .attr("fill", "var(--text-secondary)").style("font-size", "0.75rem").style("font-family", "var(--font-sans)");

        svg.append("text").attr("class", "axis-label").attr("transform", "rotate(-90)").attr("y", -40).attr("dy", "1em").attr("text-anchor", "end").text("Error |f(x) - p*|")
           .attr("fill", "var(--text-secondary)").style("font-size", "0.75rem").style("font-family", "var(--font-sans)");

        // Paths
        svg.append("path").attr("class", "convex-path").attr("fill", "none")
            .attr("stroke", "var(--success)").attr("stroke-width", 3).attr("opacity", 0.9);

        svg.append("path").attr("class", "non-convex-path").attr("fill", "none")
            .attr("stroke", "var(--error)").attr("stroke-width", 3).attr("opacity", 0.9);

        // Marker dots
        svg.append("circle").attr("class", "convex-dot").attr("r", 0).attr("fill", "var(--success)").attr("stroke", "var(--bg-surface-1)").attr("stroke-width", 2);
        svg.append("circle").attr("class", "non-convex-dot").attr("r", 0).attr("fill", "var(--error)").attr("stroke", "var(--bg-surface-1)").attr("stroke-width", 2);
    }

    function generateData() {
        const n = 50;
        const convexData = d3.range(0, n+1).map(i => ({ iter: i, val: 8 * Math.pow(0.75, i) + 1e-6 }));
        const nonConvexData = d3.range(0, n+1).map(i => {
            let val;
            if (i < 15) val = 8 * Math.pow(0.6, i); 
            else val = 0.1 + 0.02 * Math.cos(i * 0.5); 
            return { iter: i, val: Math.max(1e-5, val) };
        });
        return { convexData, nonConvexData };
    }

    function runAnimation() {
        runBtn.disabled = true;
        statusText.textContent = "Simulating...";

        svg.selectAll("path").attr("d", null);
        svg.selectAll("circle").attr("r", 0);

        const { convexData, nonConvexData } = generateData();
        const line = d3.line().x(d => x(d.iter)).y(d => y(d.val));

        const animateLine = (selector, data, dotSelector, onComplete) => {
            const path = svg.select(selector);
            const dot = svg.select(dotSelector);

            path.datum(data).attr("d", line);
            const len = path.node().getTotalLength();

            path.attr("stroke-dasharray", `${len} ${len}`).attr("stroke-dashoffset", len)
                .transition().duration(4000).ease(d3.easeLinear).attr("stroke-dashoffset", 0)
                .on("end", onComplete);

            dot.attr("r", 5).attr("cx", x(data[0].iter)).attr("cy", y(data[0].val))
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
            statusText.innerHTML = `<span style="color:var(--success)">Convex: Global Min</span> vs <span style="color:var(--error)">Non-Convex: Stuck</span>`;
        });
    }

    function setupLegend() {
        legendContainer.innerHTML = `
            <div style="display: flex; gap: 16px; align-items: center;">
                <div style="display: flex; align-items: center; gap: 6px;">
                    <span style="width: 10px; height: 10px; background: var(--success); border-radius: 50%;"></span>
                    <span style="font-size: 0.75rem; color: var(--text-secondary);">Convex</span>
                </div>
                <div style="display: flex; align-items: center; gap: 6px;">
                    <span style="width: 10px; height: 10px; background: var(--error); border-radius: 50%;"></span>
                    <span style="font-size: 0.75rem; color: var(--text-secondary);">Non-Convex</span>
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
    if (typeof feather !== 'undefined') feather.replace();
}
