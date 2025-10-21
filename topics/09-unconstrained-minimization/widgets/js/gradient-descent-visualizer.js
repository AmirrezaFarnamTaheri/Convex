/**
 * Widget: Gradient Descent Visualizer
 *
 * Description: Animates the steps of gradient descent on a 2D contour plot of a selectable function.
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { getPyodide } from "../../../../static/js/pyodide-manager.js";

export async function initGradientDescentVisualizer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="gd-visualizer-widget">
            <div class="widget-controls">
                <label>Function:</label> <select id="gd-func-select"></select>
                <label>Step Size (α): <span id="lr-val">0.10</span></label> <input type="range" id="lr-slider" min="0.01" max="0.6" step="0.01" value="0.1">
                <button id="gd-start-btn">Run Gradient Descent</button>
            </div>
            <div id="plot-container"></div>
            <p class="widget-instructions">Click on the plot to set the starting point, then click "Run".</p>
        </div>
    `;

    const funcSelect = container.querySelector("#gd-func-select");
    const lrSlider = container.querySelector("#lr-slider");
    const lrVal = container.querySelector("#lr-val");
    const startBtn = container.querySelector("#gd-start-btn");
    const plotContainer = container.querySelector("#plot-container");

    const functions = {
        "f(x,y) = x² + y²": { py_func: "x**2 + y**2", py_grad: "np.array([2*x, 2*y])", domain: [-4, 4] },
        "f(x,y) = (x-1)² + 5(y-1)²": { py_func: "(x-1)**2 + 5*(y-1)**2", py_grad: "np.array([2*(x-1), 10*(y-1)])", domain: [-4, 4]},
        "Rosenbrock": { py_func: "(1-x)**2 + 100*(y-x**2)**2", py_grad: "np.array([-2*(1-x)-400*x*(y-x**2), 200*(y-x**2)])", domain: [-2, 2] },
    };
    Object.keys(functions).forEach(name => funcSelect.add(new Option(name, name)));

    let startPoint = null;
    let isRunning = false;

    const margin = {top: 20, right: 20, bottom: 40, left: 40};
    const width = plotContainer.clientWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(plotContainer).append("svg")
        .attr("width", "100%").attr("height", height + margin.top + margin.bottom)
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);
    const xAxis = svg.append("g").attr("transform", `translate(0,${height})`);
    const yAxis = svg.append("g");

    const pyodide = await getPyodide();

    async function drawContours() {
        const funcInfo = functions[funcSelect.value];
        x.domain([funcInfo.domain[0], funcInfo.domain[1]]);
        y.domain([funcInfo.domain[0], funcInfo.domain[1]]);
        xAxis.call(d3.axisBottom(x));
        yAxis.call(d3.axisLeft(y));

        const grid_json = await pyodide.runPythonAsync(`
            import numpy as np
            import json
            domain = np.linspace(${funcInfo.domain[0]}, ${funcInfo.domain[1]}, 100)
            xx, yy = np.meshgrid(domain, domain)
            x, y = xx, yy
            zz = ${funcInfo.py_func}
            json.dumps(zz.tolist())
        `);
        const grid = JSON.parse(grid_json);

        svg.selectAll(".contour").remove();
        const contours = d3.contours().size([100, 100]).thresholds(d3.range(0, 100, 2))(grid.flat());
        svg.append("g").attr("class", "contour")
            .selectAll("path").data(contours).join("path")
            .attr("d", d3.geoPath(d3.geoIdentity().scale(width / 99)))
            .attr("fill", "none").attr("stroke", "var(--color-surface-1)");
    }

    async function run() {
        if (!startPoint || isRunning) return;
        isRunning = true;
        startBtn.disabled = true;

        svg.selectAll(".gd-path").remove();

        await pyodide.globals.set("start_point", [startPoint.x, startPoint.y]);
        await pyodide.globals.set("learning_rate", +lrSlider.value);
        await pyodide.globals.set("py_grad_str", functions[funcSelect.value].py_grad);

        const path = await pyodide.runPythonAsync(`
            import numpy as np
            path = [start_point]
            p = np.array(start_point)
            for _ in range(100):
                x, y = p
                grad = eval(py_grad_str)
                p_next = p - learning_rate * grad
                path.append(p_next.tolist())
                if np.linalg.norm(p_next - p) < 1e-3: break
                p = p_next
            path
        `).then(p => p.toJs());

        svg.append("path").attr("class", "gd-path")
            .datum(path).attr("d", d3.line().x(d=>x(d[0])).y(d=>y(d[1])))
            .attr("fill", "none").attr("stroke", "var(--color-danger)").attr("stroke-width", 2.5)
            .call(path => {
                const totalLength = path.node().getTotalLength();
                path.attr("stroke-dasharray", `${totalLength} ${totalLength}`)
                    .attr("stroke-dashoffset", totalLength)
                    .transition().duration(2000).ease(d3.easeLinear)
                    .attr("stroke-dashoffset", 0);
            });

        setTimeout(() => { isRunning = false; startBtn.disabled = false; }, 2000);
    }

    svg.append("rect").attr("width", width).attr("height", height).style("fill", "none").style("pointer-events", "all")
        .on("click", (event) => {
            if (isRunning) return;
            const [mx, my] = d3.pointer(event, svg.node());
            startPoint = {x: x.invert(mx), y: y.invert(my)};
            svg.selectAll(".start-point").remove();
            svg.append("circle").attr("class", "start-point").attr("cx", mx).attr("cy", my).attr("r", 5).attr("fill", "var(--color-danger)");
        });

    funcSelect.addEventListener("change", () => { svg.selectAll(".gd-path, .start-point").remove(); startPoint=null; drawContours(); });
    lrSlider.addEventListener("input", () => lrVal.textContent = (+lrSlider.value).toFixed(2));
    startBtn.addEventListener("click", run);

    drawContours();
}
