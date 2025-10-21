/**
 * Widget: Duality Gap Convergence Race
 *
 * Description: Animates the convergence of primal and dual objectives for an LP,
 *              showing the duality gap shrinking to zero.
 * Version: 2.0.0
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function initDualityRace(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // --- WIDGET LAYOUT ---
    container.innerHTML = `
        <div class="duality-race-widget">
            <div id="plot-container" style="width: 100%; height: 350px;"></div>
            <div class="widget-controls" style="padding: 15px; text-align: center;">
                <h4>Problem: Maximize c₁x₁ + c₂x₂</h4>
                <div class="control-row">
                    c₁: <input type="number" id="c1-in" value="1" step="0.1">
                    c₂: <input type="number" id="c2-in" value="2" step="0.1">
                </div>
                <button id="run-duality-race-btn">Run Race</button>
                <div id="legend" style="margin-top: 10px;"></div>
                <div class="widget-output" id="duality-gap-text" style="margin-top: 10px;"></div>
            </div>
        </div>
    `;

    const runBtn = container.querySelector("#run-duality-race-btn");
    const c1In = container.querySelector("#c1-in");
    const c2In = container.querySelector("#c2-in");
    const plotContainer = container.querySelector("#plot-container");
    const gapText = container.querySelector("#duality-gap-text");
    const legendContainer = container.querySelector("#legend");

    let svg, x, y;

    function setupChart() {
        plotContainer.innerHTML = '';
        const margin = { top: 20, right: 20, bottom: 40, left: 50 };
        const width = plotContainer.clientWidth - margin.left - margin.right;
        const height = plotContainer.clientHeight - margin.top - margin.bottom;

        svg = d3.select(plotContainer).append("svg")
            .attr("width", "100%").attr("height", "100%")
            .attr("viewBox", `0 0 ${plotContainer.clientWidth} ${plotContainer.clientHeight}`)
            .append("g").attr("transform", `translate(${margin.left},${margin.top})`);

        x = d3.scaleLinear().range([0, width]);
        y = d3.scaleLinear().range([height, 0]);
        svg.append("g").attr("class", "x-axis").attr("transform", `translate(0,${height})`);
        svg.append("g").attr("class", "y-axis");

        svg.append("path").attr("class", "primal-path").attr("fill", "none").attr("stroke", "var(--color-primary)").attr("stroke-width", 2.5);
        svg.append("path").attr("class", "dual-path").attr("fill", "none").attr("stroke", "var(--color-accent)").attr("stroke-width", 2.5);
    }

    function generateData(c1, c2) {
        // A simple path-following interior-point method simulation
        const n_iter = 20;
        const optimal_val = Math.max(0, c1, c2) * 5; // Simplified optimal value calculation
        let primal_obj = optimal_val * (1 + Math.random());
        let dual_obj = optimal_val * (0 - Math.random());
        const primal_path = [];
        const dual_path = [];

        for(let i=0; i<n_iter; i++) {
            primal_obj -= (primal_obj - optimal_val) * (0.2 + Math.random()*0.2);
            dual_obj += (optimal_val - dual_obj) * (0.2 + Math.random()*0.2);
            primal_path.push(primal_obj);
            dual_path.push(dual_obj);
        }
        return { primal: primal_path, dual: dual_path };
    }

    function runAnimation() {
        runBtn.disabled = true;
        gapText.textContent = "Running...";

        const c1 = +c1In.value;
        const c2 = +c2In.value;
        const data = generateData(c1, c2);

        const n_iter = data.primal.length;
        x.domain([0, n_iter - 1]);
        const all_vals = data.primal.concat(data.dual);
        y.domain(d3.extent(all_vals)).nice();

        svg.select(".x-axis").call(d3.axisBottom(x));
        svg.select(".y-axis").call(d3.axisLeft(y));

        const line = (path_data) => d3.line().x((d, i) => x(i)).y(d => y(d))(path_data);

        animatePath(svg.select(".primal-path"), data.primal);
        animatePath(svg.select(".dual-path"), data.dual);

        const timer = d3.timer((elapsed) => {
            const t = Math.min(1, elapsed / 2000);
            const currentIndex = Math.floor(t * (n_iter - 1));
            const gap = data.primal[currentIndex] - data.dual[currentIndex];
            gapText.innerHTML = `Duality Gap: <strong>${gap.toFixed(2)}</strong>`;
            if (t === 1) {
                timer.stop();
                runBtn.disabled = false;
                 gapText.innerHTML = `Final Duality Gap: <strong>${(data.primal.at(-1) - data.dual.at(-1)).toFixed(3)}</strong>. Converged!`;
            }
        });
    }

    function animatePath(pathElement, data) {
        pathElement.datum(data).attr("d", d3.line().x((d, i) => x(i)).y(d => y(d)));
        const totalLength = pathElement.node().getTotalLength();
        pathElement.attr("stroke-dasharray", `${totalLength} ${totalLength}`)
            .attr("stroke-dashoffset", totalLength)
            .transition().duration(2000).ease(d3.easeLinear)
            .attr("stroke-dashoffset", 0);
    }

    legendContainer.innerHTML = `
        <span style="color: var(--color-primary);">&#9632;</span> Primal Objective (Upper Bound)
        <span style="color: var(--color-accent); margin-left: 15px;">&#9632;</span> Dual Objective (Lower Bound)
    `;

    runBtn.onclick = runAnimation;
    new ResizeObserver(setupChart).observe(plotContainer);
    setupChart();
}
