import { getPyodide } from "../../../../static/js/pyodide-manager.js";

async function initInfeasibilityDetection(containerId) {
    const pyodide = await getPyodide();
    const container = document.querySelector(containerId);
    const runBtn = container.querySelector("#run-phase1-btn");
    const statusDisplay = container.querySelector("#status-display");

    const margin = {top: 20, right: 20, bottom: 30, left: 40};
    const width = 500 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3.select("#infeasibility-plot-container").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleLinear().domain([0, 5]).range([0, width]);
    const yScale = d3.scaleLinear().domain([0, 5]).range([height, 0]);

    svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(xScale));
    svg.append("g").call(d3.axisLeft(yScale));

    // Constraints: x >= 2, y >= 3, x + y <= 4
    // Constraint 1: x >= 2
    svg.append("line").attr("x1", xScale(2)).attr("y1", yScale(0)).attr("x2", xScale(2)).attr("y2", yScale(5)).attr("stroke", "var(--color-primary)").attr("stroke-width", 2);
    // Constraint 2: y >= 3
    svg.append("line").attr("x1", xScale(0)).attr("y1", yScale(3)).attr("x2", xScale(5)).attr("y2", yScale(3)).attr("stroke", "var(--color-primary)").attr("stroke-width", 2);
    // Constraint 3: x + y <= 4
    svg.append("line").attr("x1", xScale(0)).attr("y1", yScale(4)).attr("x2", xScale(4)).attr("y2", yScale(0)).attr("stroke", "var(--color-primary)").attr("stroke-width", 2);

    const pythonCode = `
import cvxpy as cp

def solve_phase1():
    x = cp.Variable(2)
    s = cp.Variable() # slack variable

    # Original constraints:
    # x[0] >= 2
    # x[1] >= 3
    # x[0] + x[1] <= 4

    constraints = [
        x[0] >= 2 - s,
        x[1] >= 3 - s,
        x[0] + x[1] <= 4 + s,
        s >= 0
    ]

    objective = cp.Minimize(s)
    problem = cp.Problem(objective, constraints)
    problem.solve()

    return {
        "status": problem.status,
        "s_value": s.value,
        "x_value": x.value.tolist() if x.value is not None else "N/A"
    }
`;
    await pyodide.runPythonAsync(pythonCode);

    async function runPhaseI() {
        const resultPy = await pyodide.runPythonAsync('solve_phase1()');
        const result = resultPy.toJs();

        statusDisplay.innerHTML = \`
            <p>Phase I Solver Status: \${result.status}</p>
            <p>Optimal slack variable s: \${result.s_value.toFixed(4)}</p>
            <p>Resulting point x: \${JSON.stringify(result.x_value)}</p>
            <p><b>Conclusion:</b> Since the optimal value of s is greater than 0, the original problem is <b>infeasible</b>.</p>
        \`;

        if (result.x_value !== "N/A") {
            svg.selectAll("circle.sol").remove();
            svg.append("circle")
               .attr("class", "sol")
               .attr("cx", xScale(result.x_value[0]))
               .attr("cy", yScale(result.x_value[1]))
               .attr("r", 6)
               .attr("fill", "var(--color-accent)");
        }
    }

    runBtn.addEventListener("click", runPhaseI);
}

initInfeasibilityDetection(".widget-container");
