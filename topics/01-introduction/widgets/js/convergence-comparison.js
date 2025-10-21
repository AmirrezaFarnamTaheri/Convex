/**
 * Widget: Convergence Comparison
 *
 * Description: An animated plot comparing the convergence rates of a convex
 *              solver vs. a generic non-convex solver.
 * Version: 2.0.0
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function initConvergenceComparison(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // --- WIDGET LAYOUT ---
    container.innerHTML = `
        <div class="convergence-comparison-widget">
            <div id="plot-container" style="width: 100%; height: 350px;"></div>
            <div class="widget-controls" style="padding: 15px; text-align: center;">
                <button id="run-comparison-btn">Run Comparison</button>
                <div id="legend" style="margin-top: 10px;"></div>
                <div class="widget-output" id="status-text" style="margin-top: 10px; min-height: 2em;">
                    Press 'Run Comparison' to start.
                </div>
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
        const margin = { top: 30, right: 30, bottom: 40, left: 50 };
        const width = plotContainer.clientWidth - margin.left - margin.right;
        const height = plotContainer.clientHeight - margin.top - margin.bottom;

        svg = d3.select(plotContainer).append("svg")
            .attr("width", "100%").attr("height", "100%")
            .attr("viewBox", `0 0 ${plotContainer.clientWidth} ${plotContainer.clientHeight}`)
            .append("g").attr("transform", `translate(${margin.left},${margin.top})`);

        svg.append("text").attr("x", width / 2).attr("y", -10).attr("text-anchor", "middle")
            .style("font-size", "14px").text("Solver Convergence Comparison");

        x = d3.scaleLinear().domain([0, 20]).range([0, width]);
        y = d3.scaleLog().domain([0.01, 20]).range([height, 0]);

        svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x))
            .append("text").text("Iteration").attr("x", width).attr("dy", "-0.5em")
            .attr("text-anchor", "end").attr("fill", "currentColor");

        svg.append("g").call(d3.axisLeft(y).ticks(3, ".1f"))
            .append("text").text("Error (log scale)").attr("transform", "rotate(-90)").attr("dy", "1.5em")
            .attr("text-anchor", "end").attr("fill", "currentColor");

        svg.append("path").attr("class", "convex-path").attr("fill", "none")
            .attr("stroke", "var(--color-success)").attr("stroke-width", 2.5);
        svg.append("path").attr("class", "non-convex-path").attr("fill", "none")
            .attr("stroke", "var(--color-danger)").attr("stroke-width", 2.5);
    }

    function generateData() {
        const convexData = d3.range(0, 21).map(i => ({ iter: i, val: 10 * Math.exp(-0.4 * i) + 0.01 }));
        const nonConvexData = d3.range(0, 21).map(i => {
            let val = 10 * Math.exp(-0.2 * i) + 0.5;
            if (i > 5) val += 0.4 * Math.sin(i * 1.5) + 0.4;
            return { iter: i, val: Math.max(0.01, val) };
        });
        return { convexData, nonConvexData };
    }

    function runAnimation() {
        runBtn.disabled = true;
        statusText.textContent = "Running simulation...";

        const { convexData, nonConvexData } = generateData();
        const line = d3.line().x(d => x(d.iter)).y(d => y(d.val));

        animatePath(svg.select(".convex-path"), convexData, () => {
            animatePath(svg.select(".non-convex-path"), nonConvexData, () => {
                runBtn.disabled = false;
                statusText.innerHTML = "<strong>Done!</strong> Convex solvers are reliable; non-convex solvers can get stuck.";
            });
        });
    }

    function animatePath(pathElement, data, onEnd) {
        pathElement.datum(data).attr("d", line);
        const totalLength = pathElement.node().getTotalLength();

        pathElement
            .attr("stroke-dasharray", `${totalLength} ${totalLength}`)
            .attr("stroke-dashoffset", totalLength)
            .transition().duration(1500).ease(d3.easeSinOut)
            .attr("stroke-dashoffset", 0)
            .on("end", onEnd);
    }

    function setupLegend() {
        legendContainer.innerHTML = `
            <span style="color: var(--color-success);">&#9632;</span> Convex Solver
            <span style="color: var(--color-danger); margin-left: 15px;">&#9632;</span> Non-convex Solver
        `;
    }

    runBtn.addEventListener("click", runAnimation);

    new ResizeObserver(() => {
        setupChart();
        setupLegend();
    }).observe(plotContainer);

    setupChart();
    setupLegend();
}
