import "https://d3js.org/d3.v7.min.js";
import {
    loadPyodide
} from "https://cdn.jsdelivr.net/pyodide/v0.26.1/full/pyodide.mjs";

async function getPyodide() {
    if (!window.pyodide) {
        window.pyodide = await loadPyodide({
            indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.1/full/"
        });
        await window.pyodide.loadPackage(["numpy", "scipy"]);
        await window.pyodide.runPythonAsync(`
        import numpy as np
        from scipy.linalg import null_space
    `);
    }
    return window.pyodide;
}

export async function initNullSpaceVisualizer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container #${containerId} not found`);
        return;
    }
    container.innerHTML = `
    <div style="display: flex; flex-direction: column; height: 100%;">
      <div style="flex-grow: 1; position: relative;" id="vis-main"></div>
      <div style="padding: 10px; font-family: sans-serif; font-size: 14px;">
         <p><strong>Objective:</strong> minimize f(x) = x₁² + x₂²</p>
         <p><strong>Constraint:</strong> x₁ + 2x₂ = 2</p>
      </div>
    </div>
  `;

    const pyodide = await getPyodide();

    const state = {
        P: [[2, 0], [0, 2]],
        q: [0, 0],
        A: [[1, 2]],
        b: [2],
    };

    const width = container.querySelector('#vis-main').clientWidth;
    const height = container.querySelector('#vis-main').clientHeight;
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };

    const svg = d3.select(container.querySelector('#vis-main')).append("svg")
        .attr("width", width)
        .attr("height", height);

    const xScale = d3.scaleLinear().domain([-4, 4]).range([margin.left, width - margin.right]);
    const yScale = d3.scaleLinear().domain([-4, 4]).range([height - margin.bottom, margin.top]);

    // Python function to solve the QP
    const solveQP = await pyodide.runPythonAsync(`
    def solve(P_js, q_js, A_js, b_js):
        P = np.array(P_js)
        q = np.array(q_js)
        A = np.array(A_js)
        b = np.array(b_js)

        # Unconstrained minimum
        x_unc = -np.linalg.inv(P) @ q

        # Find a particular solution to Ax = b
        x_p = np.linalg.pinv(A) @ b

        # Find a basis for the nullspace of A
        F = null_space(A)

        if F.shape[1] == 0: # No nullspace
            return {
                "x_unc": x_unc.tolist(),
                "x_p": x_p.tolist(),
                "F": [],
                "x_star": x_p.tolist(),
                "z_star": []
            }

        # Reduced problem objective
        P_hat = F.T @ P @ F
        q_hat = (F.T @ P @ x_p + F.T @ q)

        # Solve for z
        z_star = -np.linalg.inv(P_hat) @ q_hat

        # Optimal solution
        x_star = x_p + F @ z_star

        return {
            "x_unc": x_unc.flatten().tolist(),
            "x_p": x_p.flatten().tolist(),
            "F": F.flatten().tolist(),
            "x_star": x_star.flatten().tolist(),
            "z_star": z_star.flatten().tolist()
        }
    solve
  `);

    const solution = solveQP(state.P, state.q, state.A, state.b);

    function render() {
        svg.selectAll("*").remove();

        // Add definitions for arrowheads
        svg.append('defs').append('marker')
            .attr('id', 'arrow')
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', 8)
            .attr('refY', 0)
            .attr('markerWidth', 6)
            .attr('markerHeight', 6)
            .attr('orient', 'auto')
            .append('path')
            .attr('d', 'M0,-5L10,0L0,5')
            .attr('class','arrowHead');

        // Draw grid
        const grid = g => g
            .attr("stroke", "currentColor")
            .attr("stroke-opacity", 0.1);

        g => g.call(g => g.selectAll("line").data(xScale.ticks()).join("line")
                .attr("x1", d => 0.5 + xScale(d)).attr("x2", d => 0.5 + xScale(d))
                .attr("y1", margin.top).attr("y2", height - margin.bottom))
            .call(grid);

        svg.append("g").call(g => g.selectAll("line").data(yScale.ticks()).join("line")
            .attr("y1", d => 0.5 + yScale(d)).attr("y2", d => 0.5 + yScale(d))
            .attr("x1", margin.left).attr("x2", width - margin.right))
            .call(grid);

        // Draw axes
        svg.append("g")
           .attr("transform", `translate(0,${yScale(0)})`)
           .call(d3.axisBottom(xScale).ticks(5));
        svg.append("g")
            .attr("transform", `translate(${xScale(0)},0)`)
            .call(d3.axisLeft(yScale).ticks(5));

        // Draw objective contours
        const contours = d3.range(1, 10).map(d => d * d * 0.5);
        const contourData = [];
        for (let r of contours) {
            const points = [];
            for (let i = 0; i < 2 * Math.PI; i += 0.1) {
                points.push([Math.sqrt(2*r) * Math.cos(i), Math.sqrt(2*r) * Math.sin(i)]);
            }
            contourData.push(points);
        }

        svg.append("g")
            .selectAll("path")
            .data(contourData)
            .join("path")
            .attr("d", d3.line().x(p => xScale(p[0])).y(p => yScale(p[1])))
            .attr("stroke", "#80ffb0")
            .attr("stroke-width", 1)
            .attr("fill", "none");

        // Draw constraint line Ax = b
        const x1 = xScale.domain()[0], x2 = xScale.domain()[1];
        const y1 = (state.b[0] - state.A[0][0] * x1) / state.A[0][1];
        const y2 = (state.b[0] - state.A[0][0] * x2) / state.A[0][1];
        svg.append("line")
            .attr("x1", xScale(x1)).attr("y1", yScale(y1))
            .attr("x2", xScale(x2)).attr("y2", yScale(y2))
            .attr("stroke", "#7cc5ff")
            .attr("stroke-width", 2);

        // Draw points and vectors
        const { x_p, F, x_star, z_star } = solution;

        // Draw x_p (particular solution)
        svg.append("circle").attr("cx", xScale(x_p[0])).attr("cy", yScale(x_p[1])).attr("r", 5).attr("fill", "orange");
        svg.append("text").attr("x", xScale(x_p[0])+5).attr("y", yScale(x_p[1])-5).text("x_p").attr("fill", "orange").style("font-size", "14px");

        // Draw null space vector F from x_p
        svg.append("line")
            .attr("x1", xScale(x_p[0])).attr("y1", yScale(x_p[1]))
            .attr("x2", xScale(x_p[0] + F[0])).attr("y2", yScale(x_p[1] + F[1]))
            .attr("stroke", "red").attr("stroke-width", 2).attr("marker-end", "url(#arrow)");
        svg.append("text").attr("x", xScale(x_p[0] + F[0] * 0.5)+5).attr("y", yScale(x_p[1] + F[1] * 0.5)).text("F").attr("fill", "red").style("font-size", "14px");

        // Draw the z*F vector from x_p
        svg.append("line")
            .attr("x1", xScale(x_p[0])).attr("y1", yScale(x_p[1]))
            .attr("x2", xScale(x_p[0] + F[0] * z_star[0])).attr("y2", yScale(x_p[1] + F[1] * z_star[0]))
            .attr("stroke", "magenta").attr("stroke-width", 2).attr("marker-end", "url(#arrow)");
        svg.append("text").attr("x", xScale(x_p[0] + F[0] * z_star[0] * 0.5)+5).attr("y", yScale(x_p[1] + F[1] * z_star[0] * 0.5)).text("z*F").attr("fill", "magenta").style("font-size", "14px");

        // Draw x_star (optimal solution)
        svg.append("circle").attr("cx", xScale(x_star[0])).attr("cy", yScale(x_star[1])).attr("r", 6).attr("fill", "gold");
        svg.append("text").attr("x", xScale(x_star[0])+8).attr("y", yScale(x_star[1])-8).text("x*").attr("fill", "gold").style("font-size", "16px");
    }

    render();
    solveQP.destroy();
}
