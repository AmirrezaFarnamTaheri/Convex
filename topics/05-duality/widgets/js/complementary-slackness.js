/**
 * Widget: Complementary Slackness Explorer
 *
 * Description: An interactive tool demonstrating complementary slackness for a simple LP.
 *              Users can move the primal and dual solutions to see how the conditions hold or fail.
 * Version: 2.0.0
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function initComplementarySlacknessExplorer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // --- LP Problem Definition ---
    const c = [-1, -2];
    const A = [[1, 1], [-1, 1], [1, 0], [0, 1]];
    const b = [3, 1, 2, 2];
    const optimal = { x: [1, 2], lambda: [1, 1, 0, 0] };

    // --- WIDGET LAYOUT ---
    container.innerHTML = `
        <div class="comp-slack-widget">
            <div id="plot-container" style="width: 100%; height: 400px;"></div>
            <div class="widget-controls" style="padding: 15px;">
                <h4>Dual Variables (Lagrange Multipliers)</h4>
                <div id="dual-sliders"></div>
                <button id="reset-points-btn">Reset to Optimal</button>
                <div id="cs-output" class="widget-output"></div>
            </div>
        </div>
    `;

    const plotContainer = container.querySelector("#plot-container");
    const outputDiv = container.querySelector("#cs-output");
    const resetBtn = container.querySelector("#reset-points-btn");
    const dualSlidersDiv = container.querySelector("#dual-sliders");

    let primal_sol = [...optimal.x];
    let dual_sol = [...optimal.lambda];

    let svg, x, y;

    function setupChart() {
        plotContainer.innerHTML = '';
        const margin = { top: 20, right: 20, bottom: 40, left: 40 };
        const width = plotContainer.clientWidth - margin.left - margin.right;
        const height = plotContainer.clientHeight - margin.top - margin.bottom;

        svg = d3.select(plotContainer).append("svg")
            .attr("width", "100%").attr("height", "100%")
            .attr("viewBox", `0 0 ${plotContainer.clientWidth} ${plotContainer.clientHeight}`)
            .append("g").attr("transform", `translate(${margin.left},${margin.top})`);

        x = d3.scaleLinear().domain([-1, 4]).range([0, width]);
        y = d3.scaleLinear().domain([-1, 4]).range([height, 0]);

        svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));
        svg.append("g").call(d3.axisLeft(y));

        // Feasible Region
        const feasibleRegion = [[0,0], [2,0], [2,1], [1,2], [0,1]];
        svg.append("path").attr("d", d3.line().x(d=>x(d[0])).y(d=>y(d[1]))(feasibleRegion)+"Z").attr("fill", "var(--color-primary-light)");

        svg.append("g").attr("class", "constraints-group");

        const drag = d3.drag().on("drag", (event) => {
            primal_sol = [x.invert(event.x), y.invert(event.y)];
            update();
        });
        svg.append("circle").attr("class", "primal-solution").attr("r", 6).attr("fill", "var(--color-danger)").style("cursor", "move").call(drag);
    }

    function update() {
        // --- Calculations ---
        const primal_slack = b.map((bi, i) => bi - (A[i][0] * primal_sol[0] + A[i][1] * primal_sol[1]));
        const dual_slack = [
            dual_sol[0] - dual_sol[1] + dual_sol[2] + c[0],
            dual_sol[0] + dual_sol[1] + dual_sol[3] + c[1]
        ];

        // --- Visualization ---
        svg.select(".primal-solution").attr("cx", x(primal_sol[0])).attr("cy", y(primal_sol[1]));

        const constraints_lines = [
            { p1: [2, 1], p2: [3, 0] }, { p1: [-1, 0], p2: [1, 2] },
            { p1: [2, -1], p2: [2, 4] }, { p1: [-1, 2], p2: [4, 2] }
        ];

        svg.select(".constraints-group").selectAll("line").data(constraints_lines)
            .join("line")
            .attr("x1", d => x(d.p1[0])).attr("y1", d => y(d.p1[1]))
            .attr("x2", d => x(d.p2[0])).attr("y2", d => y(d.p2[1]))
            .attr("stroke", (d, i) => Math.abs(primal_slack[i]) < 1e-4 ? "var(--color-danger)" : "var(--color-text-secondary)")
            .attr("stroke-width", (d, i) => Math.abs(primal_slack[i]) < 1e-4 ? 2.5 : 1.5);

        // --- Output ---
        let outputHTML = `
            <h5>Primal Point x: [${primal_sol.map(v => v.toFixed(2)).join(', ')}]</h5>
            <h5>Dual Variables λ: [${dual_sol.map(v => v.toFixed(2)).join(', ')}]</h5>
            <h5>Dual Problem:</h5>
            <p>Minimize 3λ₁ + λ₂ + 2λ₃ + 2λ₄</p>
            <p>s.t. λ₁ - λ₂ + λ₃ ≥ -1</p>
            <p>λ₁ + λ₂ + λ₄ ≥ -2</p>
            <p>λᵢ ≥ 0</p>
            <h5>Complementary Slackness Conditions (λᵢ(bᵢ - aᵢᵀx)=0):</h5>
            <ul>`;

        for (let i = 0; i < A.length; i++) {
            const slack = primal_slack[i];
            const lambda = dual_sol[i];
            const conditionMet = Math.abs(lambda * slack) < 1e-4;
            outputHTML += `<li>Constraint ${i + 1}:
                λᵢ = ${lambda.toFixed(2)}, Slack = ${slack.toFixed(2)}.
                Product = ${(lambda * slack).toFixed(2)}.
                <strong style="color: ${conditionMet ? 'var(--color-success)' : 'var(--color-danger)'};">
                ${conditionMet ? 'Holds' : 'Fails'}</strong>
            </li>`;
        }
        outputHTML += "</ul>";
        outputDiv.innerHTML = outputHTML;
    }

    dual_sol.forEach((val, i) => {
        const sliderDiv = document.createElement('div');
        sliderDiv.innerHTML = `<label>λ${i+1}: <span id="dual-val-${i}"></span></label>
                             <input type="range" id="dual-slider-${i}" min="0" max="3" step="0.1" value="${val}">`;
        dualSlidersDiv.appendChild(sliderDiv);
        const slider = sliderDiv.querySelector(`#dual-slider-${i}`);
        const valSpan = sliderDiv.querySelector(`#dual-val-${i}`);
        valSpan.textContent = val.toFixed(2);
        slider.addEventListener('input', () => {
            dual_sol[i] = +slider.value;
            valSpan.textContent = (+slider.value).toFixed(2);
            update();
        });
    });

    resetBtn.onclick = () => {
        primal_sol = [...optimal.x];
        dual_sol = [...optimal.lambda];
        dual_sol.forEach((val, i) => {
            const slider = dualSlidersDiv.querySelector(`#dual-slider-${i}`);
            const valSpan = dualSlidersDiv.querySelector(`#dual-val-${i}`);
            slider.value = val;
            valSpan.textContent = val.toFixed(2);
        });
        update();
    };

    new ResizeObserver(setupChart).observe(plotContainer);
    setupChart();
    update();
}
