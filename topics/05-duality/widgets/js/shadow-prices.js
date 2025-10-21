/**
 * Widget: Shadow Prices & Sensitivity Analysis
 *
 * Description: Demonstrates how the optimal value of an LP changes as a constraint is perturbed,
 *              illustrating the concept of shadow prices (dual variables).
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { getPyodide } from "../../../../static/js/pyodide-manager.js";

export async function initShadowPrices(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="shadow-prices-widget">
            <div class="widget-controls">
                <p><strong>Problem:</strong> Maximize x₁ + 2x₂</p>
                <p>s.t. x₁ + x₂ ≤ b₁, x₁ - x₂ ≥ 0, x₁, x₂ ≥ 0</p>
                <label for="b1-slider">Perturb constraint b₁:</label>
                <input type="range" id="b1-slider" min="0" max="5" step="0.1" value="3">
                <span id="b1-val">3.0</span>
            </div>
            <div id="plot-container-sp"></div>
            <div class="widget-output" id="shadow-price-output"></div>
        </div>
    `;

    const b1Slider = container.querySelector("#b1-slider");
    const b1ValSpan = container.querySelector("#b1-val");
    const plotContainer = container.querySelector("#plot-container-sp");
    const outputDiv = container.querySelector("#shadow-price-output");

    const margin = {top: 20, right: 20, bottom: 40, left: 50};
    const width = plotContainer.clientWidth - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = d3.select(plotContainer).append("svg")
        .attr("width", "100%").attr("height", height + margin.top + margin.bottom)
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().domain([0, 5]).range([0, width]);
    const y = d3.scaleLinear().domain([0, 8]).range([height, 0]);
    svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x).ticks(5)).append("text").text("Constraint b₁").attr("x", width).attr("dy", "-0.5em").attr("text-anchor", "end").attr("fill", "currentColor");
    svg.append("g").call(d3.axisLeft(y).ticks(5)).append("text").text("Optimal Value p*(b₁)").attr("transform", "rotate(-90)").attr("dy", "1.5em").attr("text-anchor", "end").attr("fill", "currentColor");

    const path = svg.append("path").attr("fill", "none").attr("stroke", "var(--color-primary)").attr("stroke-width", 2);
    const tangentLine = svg.append("line").attr("stroke", "var(--color-accent)").attr("stroke-width", 2).attr("stroke-dasharray", "4 4");
    const currentPoint = svg.append("circle").attr("r", 5).attr("fill", "var(--color-accent)");

    const pyodide = await getPyodide();
    await pyodide.loadPackage("scipy");
    const pythonCode = `
import numpy as np
from scipy.optimize import linprog
import json

def solve_lp_for_b1(b1_val):
    c = [-1, -2] # Maximize, so negate
    A_ub = [[1, 1], [-1, 1]]
    b_ub = [b1_val, 0]

    # Primal
    primal_res = linprog(c, A_ub=A_ub, b_ub=b_ub, bounds=(0, None))

    # Dual
    # min bᵀy s.t. Aᵀy >= -c, y >= 0
    dual_res = linprog(b_ub, A_ub=-np.array(A_ub).T, b_ub=-np.array(c), bounds=(0, None))

    return json.dumps({
        "optimal_value": -primal_res.fun if primal_res.success else 0,
        "shadow_price": dual_res.x[0] if dual_res.success else 0 # Shadow price for first constraint
    })
`;
    await pyodide.runPythonAsync(pythonCode);
    const solve_lp_for_b1 = pyodide.globals.get('solve_lp_for_b1');

    const b1_values = d3.range(0, 5.1, 0.1);
    const optimal_values = [];

    for (const b1 of b1_values) {
        const result = await solve_lp_for_b1(b1).then(r => JSON.parse(r));
        optimal_values.push({b1: b1, p_star: result.optimal_value});
    }

    path.datum(optimal_values).attr("d", d3.line().x(d => x(d.b1)).y(d => y(d.p_star)));

    async function update(b1) {
        b1ValSpan.textContent = b1.toFixed(1);
        const result = await solve_lp_for_b1(b1).then(r => JSON.parse(r));

        currentPoint.attr("cx", x(b1)).attr("cy", y(result.optimal_value));

        // Tangent line slope = shadow price
        const slope = result.shadow_price;
        const intercept = result.optimal_value - slope * b1;
        tangentLine.attr("x1", x(0)).attr("y1", y(intercept))
                   .attr("x2", x(5)).attr("y2", y(slope * 5 + intercept));

        outputDiv.innerHTML = `For b₁=${b1.toFixed(1)}, Optimal Value p* ≈ ${result.optimal_value.toFixed(2)}
            <br>Shadow Price (Dual Variable λ₁) ≈ <strong>${slope.toFixed(2)}</strong> (This is the slope of the graph at this point)`;
    }

    b1Slider.addEventListener("input", (e) => update(+e.target.value));
    update(+b1Slider.value);
}
