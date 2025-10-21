import "https://d3js.org/d3.v7.min.js";
import {
    loadPyodide
} from "https://cdn.jsdelivr.net/pyodide/v0.26.1/full/pyodide.mjs";

async function getPyodide() {
    if (!window.pyodide) {
        window.pyodide = await loadPyodide({
            indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.1/full/"
        });
        await window.pyodide.loadPackage("numpy");
    }
    return window.pyodide;
}

export async function initProjectedGradientDescent(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container #${containerId} not found`);
        return;
    }
    container.innerHTML = `
    <div style="display: flex; flex-direction: column; height: 100%;">
      <div style="flex-grow: 1; position: relative;" id="vis-pgd"></div>
      <div style="padding: 10px; font-family: sans-serif; font-size: 14px; display: flex; justify-content: space-around; align-items: center;">
         <span><strong>Objective:</strong> minimize f(x) = (x₁-3)² + (x₂-2)²</span>
         <span><strong>Constraint:</strong> x₁ + x₂ ≤ 1</span>
         <button id="pgd-step-btn" style="padding: 5px 10px;">Step</button>
         <button id="pgd-reset-btn" style="padding: 5px 10px;">Reset</button>
      </div>
    </div>
  `;

    const pyodide = await getPyodide();

    const solve_pgd_step = await pyodide.runPythonAsync(`
    import numpy as np

    def project(x):
        # Project x onto the set {y | y1 + y2 <= 1}
        if np.sum(x) <= 1:
            return x
        # Solves a simple QP to find the projection
        # min ||y-x||^2 s.t. sum(y) = 1
        # Lagrangian: ||y-x||^2 + v*(sum(y)-1)
        # 2(y-x) + v*1 = 0 => y = x - v/2
        # sum(x) - n*v/2 = 1 => v = 2/n * (sum(x)-1)
        v = (np.sum(x) - 1)
        return x - v / 2

    def solve_step(x_k_js, alpha):
        x_k = np.array(x_k_js)

        # Gradient of f(x) = (x1-3)^2 + (x2-2)^2
        # is [2*(x1-3), 2*(x2-2)]
        grad = np.array([2 * (x_k[0] - 3), 2 * (x_k[1] - 2)])

        # Unconstrained step
        x_unconstrained = x_k - alpha * grad

        # Projection step
        x_next = project(x_unconstrained)

        return {
            "x_k": x_k.tolist(),
            "grad": grad.tolist(),
            "x_unconstrained": x_unconstrained.tolist(),
            "x_next": x_next.tolist()
        }
    solve_step
  `);

    let state = {
        x_k: [-1.5, 1.5],
        alpha: 0.1,
        path: []
    };

    const width = container.querySelector('#vis-pgd').clientWidth;
    const height = container.querySelector('#vis-pgd').clientHeight;
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };

    const svg = d3.select(container.querySelector('#vis-pgd')).append("svg")
        .attr("width", width)
        .attr("height", height);

    const xScale = d3.scaleLinear().domain([-2, 4]).range([margin.left, width - margin.right]);
    const yScale = d3.scaleLinear().domain([-2, 4]).range([height - margin.bottom, margin.top]);

    function render() {
        svg.selectAll("*").remove();

        // Draw grid, axes (similar to other widget)
        const grid = g => g.attr("stroke", "currentColor").attr("stroke-opacity", 0.1);
        svg.append("g").call(g => g.selectAll("line").data(xScale.ticks()).join("line")
                .attr("x1", d => 0.5 + xScale(d)).attr("x2", d => 0.5 + xScale(d))
                .attr("y1", margin.top).attr("y2", height - margin.bottom)).call(grid);
        svg.append("g").call(g => g.selectAll("line").data(yScale.ticks()).join("line")
            .attr("y1", d => 0.5 + yScale(d)).attr("y2", d => 0.5 + yScale(d))
            .attr("x1", margin.left).attr("x2", width - margin.right)).call(grid);
        svg.append("g").attr("transform", `translate(0,${yScale(0)})`).call(d3.axisBottom(xScale).ticks(5));
        svg.append("g").attr("transform", `translate(${xScale(0)},0)`).call(d3.axisLeft(yScale).ticks(5));

        // Draw objective contours
        const center = [3, 2];
        const contours = d3.range(1, 10).map(d => d * 0.5);
        const contourData = contours.map(r =>
            d3.range(0, 2 * Math.PI, 0.1).map(a =>
                [center[0] + r * Math.cos(a), center[1] + r * Math.sin(a)]
            )
        );
        svg.append("g").selectAll("path").data(contourData).join("path")
            .attr("d", d3.line().x(p => xScale(p[0])).y(p => yScale(p[1])))
            .attr("stroke", "#80ffb0").attr("stroke-width", 1).attr("fill", "none");

        // Draw optimum
        svg.append("circle").attr("cx", xScale(center[0])).attr("cy", yScale(center[1])).attr("r", 4).attr("fill", "gold");
        svg.append("text").attr("x", xScale(center[0])+5).attr("y", yScale(center[1])-5).text("x_unc*").attr("fill", "gold");


        // Draw feasible set: x1 + x2 <= 1
        const feasibleRegion = svg.append("polygon")
            .attr("points", [
                [xScale(-2), yScale(3)],
                [xScale(3), yScale(-2)],
                [xScale(-2), yScale(-2)]
            ].join(" "))
            .attr("fill", "#7cc5ff")
            .attr("fill-opacity", 0.3);
        svg.append("line")
            .attr("x1", xScale(-2)).attr("y1", yScale(3))
            .attr("x2", xScale(3)).attr("y2", yScale(-2))
            .attr("stroke", "#7cc5ff").attr("stroke-width", 2);

        // Draw path
        if (state.path.length > 0) {
            svg.append("path")
                .attr("d", d3.line().x(d => xScale(d.x_k[0])).y(d => yScale(d.x_k[1]))(state.path))
                .attr("stroke", "red").attr("stroke-width", 1.5).attr("fill", "none");

             svg.append("path")
                .attr("d", d3.line().x(d => xScale(d.x_unconstrained[0])).y(d => yScale(d.x_unconstrained[1]))(state.path))
                .attr("stroke", "gray").attr("stroke-width", 1).attr("stroke-dasharray", "2 2").attr("fill", "none");

            const lastPoint = state.path[state.path.length - 1];
            svg.append("line") // Projection line
               .attr("x1", xScale(lastPoint.x_unconstrained[0]))
               .attr("y1", yScale(lastPoint.x_unconstrained[1]))
               .attr("x2", xScale(lastPoint.x_next[0]))
               .attr("y2", yScale(lastPoint.x_next[1]))
               .attr("stroke", "orange").attr("stroke-width", 2).attr("stroke-dasharray", "4 4");
        }

        // Draw current point
        svg.append("circle").attr("cx", xScale(state.x_k[0])).attr("cy", yScale(state.x_k[1])).attr("r", 5).attr("fill", "red");
        svg.append("text").attr("x", xScale(state.x_k[0])+5).attr("y", yScale(state.x_k[1])-5).text("x_k").attr("fill", "red");
    }

    function step() {
        if(state.path.length > 20) return; // Stop after 20 steps
        const result = solve_pgd_step(state.x_k, state.alpha);
        state.path.push(result);
        state.x_k = result.x_next;
        render();
    }

    function reset() {
        state.x_k = [-1.5, 1.5];
        state.path = [];
        render();
    }

    container.querySelector("#pgd-step-btn").addEventListener("click", step);
    container.querySelector("#pgd-reset-btn").addEventListener("click", reset);

    render();
}
