/**
 * Widget: Rank Nullspace Visualizer
 *
 * Description: Visualizes the four fundamental subspaces of a user-defined 2x3 or 3x2 matrix.
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { getPyodide } from "../../../../static/js/pyodide-manager.js";


export async function initRankNullspace(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container #${containerId} not found.`);
        return;
    }

    container.innerHTML = `<div class="widget-loading-indicator">Initializing Pyodide and SciPy...</div>`;

    const pyodide = await getPyodide();
    await pyodide.loadPackage("scipy");

    container.innerHTML = `
        <div class="rank-nullspace-widget">
            <div class="controls">
                <p>Enter a 2x3 matrix A:</p>
                <div id="matrix-input">
                    <input type="number" step="0.1" value="1"> <input type="number" step="0.1" value="2"> <input type="number" step="0.1" value="0">
                    <br>
                    <input type="number" step="0.1" value="0"> <input type="number" step="0.1" value="1"> <input type="number" step="0.1" value="1">
                </div>
            </div>
            <div id="visualization-container">
                <div id="domain-space"></div>
                <div id="codomain-space"></div>
            </div>
            <div id="output-bases" class="widget-output"></div>
        </div>
    `;

    const inputs = container.querySelectorAll("#matrix-input input");
    inputs.forEach(input => input.addEventListener("input", updateVisualization));

    const margin = {top: 30, right: 20, bottom: 30, left: 20};
    const width = 250 - margin.left - margin.right;
    const height = 250 - margin.top - margin.bottom;

    const domainSvg = d3.select("#domain-space").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", `translate(${width/2 + margin.left}, ${height/2 + margin.top})`);

    domainSvg.append("text").text("Domain (ℝ³)").attr("x", 0).attr("y", -height/2 - 10).attr("text-anchor", "middle");

    const codomainSvg = d3.select("#codomain-space").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", `translate(${width/2 + margin.left}, ${height/2 + margin.top})`);

    codomainSvg.append("text").text("Codomain (ℝ²)")
        .attr("x", 0).attr("y", -height/2 - 10).attr("text-anchor", "middle");


    async function updateVisualization() {
        const matrix_data = Array.from(inputs).map(i => parseFloat(i.value) || 0);

        await pyodide.globals.set("matrix_A", matrix_data);
        const result_json = await pyodide.runPythonAsync(`
            import numpy as np
            from scipy.linalg import null_space, orth
            import json

            A = np.array(matrix_A).reshape(2, 3)

            # Use scipy for more robust basis calculations
            col_space = orth(A)
            row_space = orth(A.T)
            null_sp = null_space(A)
            left_null_space = null_space(A.T)

            def to_list(basis):
                return basis.T.tolist() if basis.shape[1] > 0 else []

            json.dumps({
                "rank": np.linalg.matrix_rank(A),
                "col_space": to_list(col_space),
                "row_space": to_list(row_space),
                "null_space": to_list(null_sp),
                "left_null_space": to_list(left_null_space)
            })
        `);
        const results = JSON.parse(result_json);

        // Update textual output
        const outputEl = container.querySelector("#output-bases");
        outputEl.innerHTML = \`
            <p><strong>Rank:</strong> \${results.rank}</p>
            <p><strong>Row Space Basis (in ℝ³):</strong> \${results.row_space.map(v => `[${v.map(n => n.toFixed(2))}]`)}</p>
            <p><strong>Null Space Basis (in ℝ³):</strong> \${results.null_space.map(v => `[${v.map(n => n.toFixed(2))}]`)}</p>
            <p><strong>Column Space Basis (in ℝ²):</strong> \${results.col_space.map(v => `[${v.map(n => n.toFixed(2))}]`)}</p>
        \`;

        // Visualize bases
        visualizeBasis(domainSvg, results.row_space, "var(--color-primary)", [-2, 2]);
        visualizeBasis(domainSvg, results.null_space, "var(--color-danger)", [-2, 2]);
        visualizeBasis(codomainSvg, results.col_space, "var(--color-accent)", [-2, 2]);
    }

    function visualizeBasis(svg, basisVectors, color, domain) {
        svg.selectAll(".basis-vector").remove(); // Clear previous

        const scale = d3.scaleLinear().domain(domain).range([-width/2, width/2]);

        if (basisVectors.length > 0) {
            svg.selectAll(".basis-vector")
                .data(basisVectors)
                .enter().append("line")
                .attr("class", "basis-vector")
                .attr("x1", scale(0)).attr("y1", scale(0))
                .attr("x2", d => scale(d[0]))
                .attr("y2", d => scale(d[1])) // Note: Ignores 3rd dimension for 2D plot
                .attr("stroke", color)
                .attr("stroke-width", 2);
        }
    }


    updateVisualization();
}
