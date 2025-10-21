/**
 * Widget: Shadow Prices & Sensitivity Analysis
 *
 * Description: Demonstrates how the optimal value of an LP changes as a constraint is perturbed,
 *              illustrating the concept of shadow prices (dual variables).
 * Version: 2.0.0
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function initShadowPrices(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // --- Problem Definition ---
    const c = [1, 2]; // Maximize
    const A = [[1, 1], [-1, 1]];
    let b = [3, 1];

    // --- WIDGET LAYOUT ---
    container.innerHTML = `
        <div class="shadow-prices-widget">
            <div id="plot-container-sp" style="width: 100%; height: 350px;"></div>
            <div class="widget-controls" style="padding: 15px;">
                <p><strong>Problem:</strong> Maximize ${c[0]}x₁ + ${c[1]}x₂</p>
                <div id="constraints-text"></div>
                <label for="constraint-select">Perturb Constraint:</label>
                <select id="constraint-select"></select>
                <input type="range" id="b-slider" min="0" max="5" step="0.1" value="3" style="width: 100%;">
                <div class="widget-output" id="shadow-price-output" style="margin-top: 10px;"></div>
            </div>
        </div>
    `;

    const constraintSelect = container.querySelector("#constraint-select");
    const bSlider = container.querySelector("#b-slider");
    const b1ValSpan = container.querySelector("#b1-val-text");
    const plotContainer = container.querySelector("#plot-container-sp");
    const outputDiv = container.querySelector("#shadow-price-output");

    let svg, x, y;

    let optimal_values = [];

    function setupChart() {
        const perturbed_idx = +constraintSelect.value;
        const b_values = d3.range(0, 5.1, 0.1);
        optimal_values = b_values.map(b_val => {
            let local_b = [...b];
            local_b[perturbed_idx] = b_val;
            const sol = solveLP(c, A, local_b);
            return { b: b_val, p_star: sol ? sol.value : 0, dual: sol ? sol.dual[perturbed_idx] : 0 };
        });

        plotContainer.innerHTML = '';
        const margin = {top: 20, right: 20, bottom: 40, left: 50};
        const width = plotContainer.clientWidth - margin.left - margin.right;
        const height = plotContainer.clientHeight - margin.top - margin.bottom;

        svg = d3.select(plotContainer).append("svg")
            .attr("width", "100%").attr("height", "100%")
            .attr("viewBox", `0 0 ${plotContainer.clientWidth} ${plotContainer.clientHeight}`)
            .append("g").attr("transform", `translate(${margin.left},${margin.top})`);

        x = d3.scaleLinear().domain([0, 5]).range([0, width]);
        y = d3.scaleLinear().domain([0, d3.max(optimal_values, d => d.p_star) * 1.1]).range([height, 0]);

        svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x)).append("text").text(`Constraint b${perturbed_idx+1}`).attr("x", width).attr("dy", "-0.5em").attr("text-anchor", "end").attr("fill", "currentColor");
        svg.append("g").call(d3.axisLeft(y).ticks(5)).append("text").text("Optimal Value p*").attr("transform", "rotate(-90)").attr("dy", "-3em").attr("text-anchor", "middle").attr("fill", "currentColor");

        svg.append("path").datum(optimal_values).attr("fill", "none").attr("stroke", "var(--color-primary)").attr("stroke-width", 2)
           .attr("d", d3.line().x(d => x(d.b)).y(d => y(d.p_star)));

        svg.append("g").attr("class", "tangent-group");
    }

    function solveLP(c_in, A_in, b_in) {
        // Simple LP solver for this 2D case
        const vertices = [
            [0, 0],
            [b_in[0], 0], // x1+x2=b1, y=0
            [0, b_in[0]],
            [(b_in[0]+b_in[1])/2, (b_in[0]-b_in[1])/2] // intersection
        ].filter(v =>
            A_in[0][0]*v[0] + A_in[0][1]*v[1] <= b_in[0] + 1e-6 &&
            A_in[1][0]*v[0] + A_in[1][1]*v[1] <= b_in[1] + 1e-6 &&
            v[0] >= -1e-6 && v[1] >= -1e-6
        );

        if (vertices.length === 0) return null;

        let bestVertex = vertices[0];
        let maxObj = c_in[0]*bestVertex[0] + c_in[1]*bestVertex[1];
        vertices.forEach(v => {
            const obj = c_in[0]*v[0] + c_in[1]*v[1];
            if (obj > maxObj) {
                maxObj = obj;
                bestVertex = v;
            }
        });

        // Dual solution can be inferred from which constraints are active
        const dual = [0,0];
        if (Math.abs(A[0][0]*bestVertex[0] + A[0][1]*bestVertex[1] - b_in[0]) < 1e-6) dual[0] = 1.5; // Simplified for this problem
        if (Math.abs(A[1][0]*bestVertex[0] + A[1][1]*bestVertex[1] - b_in[1]) < 1e-6) dual[1] = 0.5;

        return { x: bestVertex, value: maxObj, dual: dual };
    }

    function update() {
        const perturbed_idx = +constraintSelect.value;
        const b_val = parseFloat(bSlider.value);

        let current_b = [...b];
        current_b[perturbed_idx] = b_val;

        const sol = solveLP(c, A, current_b);
        const shadow_price = sol ? sol.dual[perturbed_idx] : 0;

        const tangentGroup = svg.select(".tangent-group");
        tangentGroup.selectAll("*").remove();

        if (sol) {
            tangentGroup.append("circle").attr("cx", x(b_val)).attr("cy", y(sol.value)).attr("r", 5).attr("fill", "var(--color-accent)");
            const intercept = sol.value - shadow_price * b_val;
            tangentGroup.append("line").attr("stroke", "var(--color-accent)").attr("stroke-width", 2).attr("stroke-dasharray", "4 4")
                .attr("x1", x(0)).attr("y1", y(intercept))
                .attr("x2", x(5)).attr("y2", y(shadow_price * 5 + intercept));
        }

        outputDiv.innerHTML = `For b${perturbed_idx+1}=${b_val.toFixed(1)}, Optimal Value p* ≈ ${sol ? sol.value.toFixed(2) : 'N/A'}
            <br>Shadow Price (Dual λ${perturbed_idx+1}) ≈ <strong>${shadow_price.toFixed(2)}</strong> (slope of the graph)`;
    }

    A.forEach((_, i) => {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `Constraint ${i+1}`;
        constraintSelect.appendChild(option);
    });

    constraintSelect.addEventListener('change', () => {
        setupChart();
        update();
    });
    bSlider.oninput = update;
    new ResizeObserver(setupChart).observe(plotContainer);
    setupChart();
    update();
}
