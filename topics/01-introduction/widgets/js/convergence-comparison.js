/**
 * Widget: Convergence Comparison
 *
 * Description: An animated plot comparing the convergence rates of a convex solver vs. a generic nonconvex solver.
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function initConvergenceComparison(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="convergence-comparison-widget">
            <div class="widget-controls">
                <button id="run-comparison-btn">Run Comparison</button>
            </div>
            <div id="plot-container"></div>
            <div class="widget-output" id="status-text"></div>
        </div>
    `;

    const runBtn = container.querySelector("#run-comparison-btn");
    const plotContainer = container.querySelector("#plot-container");
    const statusText = container.querySelector("#status-text");

    const margin = {top: 30, right: 30, bottom: 40, left: 50};
    const width = plotContainer.clientWidth - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;

    const svg = d3.select(plotContainer).append("svg")
        .attr("width", "100%")
        .attr("height", height + margin.top + margin.bottom)
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    svg.append("text")
        .attr("x", width/2)
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text("Solver Convergence Comparison");

    const x = d3.scaleLinear().domain([0, 20]).range([0, width]);
    const y = d3.scaleLinear().domain([0, 12]).range([height, 0]);

    svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x)).append("text").text("Iteration").attr("x", width).attr("dy", "-0.5em").attr("text-anchor", "end").attr("fill", "currentColor");
    svg.append("g").call(d3.axisLeft(y)).append("text").text("Objective Value").attr("transform", "rotate(-90)").attr("dy", "1.5em").attr("text-anchor", "end").attr("fill", "currentColor");

    const convexPath = svg.append("path").attr("fill", "none").attr("stroke", "var(--color-success)").attr("stroke-width", 2.5);
    const nonConvexPath = svg.append("path").attr("fill", "none").attr("stroke", "var(--color-danger)").attr("stroke-width", 2.5);

    function generateData() {
        const convexData = d3.range(0, 21).map(i => ({iter: i, val: 10 * Math.exp(-0.4 * i) + 0.1}));
        const nonConvexData = d3.range(0, 21).map(i => {
            let val = 10 * Math.exp(-0.2 * i) + 2;
            if (i > 5 && i < 15) val += 1.5 * Math.sin(i); // Get stuck in local min
            return {iter: i, val: val};
        });
        return { convexData, nonConvexData };
    }

    function runAnimation() {
        runBtn.disabled = true;
        statusText.textContent = "Running simulation...";

        const { convexData, nonConvexData } = generateData();

        const line = d3.line().x(d => x(d.iter)).y(d => y(d.val));

        animatePath(convexPath, convexData, () => {
            animatePath(nonConvexPath, nonConvexData, () => {
                runBtn.disabled = false;
                statusText.textContent = "Convex solver finds the global optimum reliably.";
            });
        });
    }

    function animatePath(pathElement, data, onEnd) {
        pathElement.datum(data)
            .attr("d", line);

        const totalLength = pathElement.node().getTotalLength();

        pathElement
            .attr("stroke-dasharray", totalLength + " " + totalLength)
            .attr("stroke-dashoffset", totalLength)
            .transition()
            .duration(2000)
            .ease(d3.easeLinear)
            .attr("stroke-dashoffset", 0)
            .on("end", onEnd);
    }

    runBtn.addEventListener("click", runAnimation);

    // Initial empty state
    convexPath.attr("d", null);
    nonConvexPath.attr("d", null);
    statusText.textContent = "Press 'Run Comparison' to start.";
}
