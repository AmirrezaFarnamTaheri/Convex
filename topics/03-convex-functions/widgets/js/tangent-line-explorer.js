/**
 * Widget: Tangent Line Explorer
 *
 * Description: Allows users to slide a point along a convex function's graph and see that the tangent line is always a global underestimator.
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function initTangentLineExplorer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="tangent-explorer-widget">
            <div class="widget-controls">
                <label for="tangent-func-select">Function:</label>
                <select id="tangent-func-select"></select>
            </div>
            <div id="plot-container"></div>
            <div class="widget-output" id="inequality-text"></div>
        </div>
    `;

    const funcSelect = container.querySelector("#tangent-func-select");
    const plotContainer = container.querySelector("#plot-container");
    const inequalityText = container.querySelector("#inequality-text");

    const functions = {
        "x² (Convex)": { func: x => x**2, grad: x => 2*x, domain: [-5, 5] },
        "eˣ (Convex)": { func: x => Math.exp(x), grad: x => Math.exp(x), domain: [-3, 3] },
        "x³ (Non-Convex)": { func: x => x**3, grad: x => 3*x**2, domain: [-3, 3] },
        "cos(x) (Non-Convex)": { func: x => Math.cos(x), grad: x => -Math.sin(x), domain: [-6, 6]},
    };
    let selectedFunctionName = Object.keys(functions)[0];
    let tangentX = 1;

    Object.keys(functions).forEach(name => {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        funcSelect.appendChild(option);
    });

    const margin = {top: 20, right: 20, bottom: 40, left: 50};
    const width = plotContainer.clientWidth - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;

    const svg = d3.select(plotContainer).append("svg")
        .attr("width", "100%").attr("height", height + margin.top + margin.bottom)
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);

    svg.append("g").attr("class", "x-axis").attr("transform", `translate(0,${height})`);
    svg.append("g").attr("class", "y-axis");

    const path = svg.append("path").attr("fill", "none").attr("stroke", "var(--color-primary)").attr("stroke-width", 2.5);
    const tangentLine = svg.append("line").attr("stroke", "var(--color-accent)").attr("stroke-width", 2);
    const tangentPoint = svg.append("circle").attr("r", 6).attr("fill", "var(--color-accent)").style("cursor", "pointer");

    const drag = d3.drag().on("drag", function(event) {
        tangentX = x.invert(event.x);
        const { domain } = functions[selectedFunctionName];
        tangentX = Math.max(domain[0], Math.min(domain[1], tangentX)); // Clamp to domain
        update();
    });

    svg.append("rect").attr("width", width).attr("height", height).style("fill", "none").style("pointer-events", "all").call(drag);

    function update() {
        const { func, grad, domain } = functions[selectedFunctionName];
        x.domain(domain);
        const data = d3.range(domain[0], domain[1] + 0.1, 0.1);
        const yData = data.map(func);
        y.domain([d3.min(yData), d3.max(yData)]).nice();

        svg.select(".x-axis").call(d3.axisBottom(x));
        svg.select(".y-axis").call(d3.axisLeft(y));

        path.datum(data).attr("d", d3.line().x(d => x(d)).y(d => y(func(d))));

        const tangentY = func(tangentX);
        const slope = grad(tangentX);
        tangentPoint.attr("cx", x(tangentX)).attr("cy", y(tangentY));

        const intercept = tangentY - slope * tangentX;
        const y1 = slope * domain[0] + intercept;
        const y2 = slope * domain[1] + intercept;
        tangentLine.attr("x1", x(domain[0])).attr("y1", y(y1)).attr("x2", x(domain[1])).attr("y2", y(y2));

        // Check if f(y) >= f(x) + f'(x)(y-x) holds for all y
        let is_convex_locally = true;
        for (const d of data) {
            if (func(d) < tangentY + slope * (d - tangentX) - 1e-6) {
                is_convex_locally = false;
                break;
            }
        }

        inequalityText.innerHTML = `For a convex function, the tangent line is a global underestimator.
            <br>Status: <strong style="color:${is_convex_locally ? 'var(--color-success)' : 'var(--color-danger)'};">
            ${is_convex_locally ? 'Condition Holds' : 'Condition Violated'}
            </strong>`;
    }

    funcSelect.addEventListener("change", (e) => {
        selectedFunctionName = e.target.value;
        const { domain } = functions[selectedFunctionName];
        tangentX = (domain[0] + domain[1]) / 2;
        update();
    });

    update();
}
