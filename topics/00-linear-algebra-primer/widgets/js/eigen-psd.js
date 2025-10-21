import { getPyodide } from "../../../../static/js/pyodide-manager.js";

async function initEigenPsd(containerId) {
    const pyodide = await getPyodide();
    const container = document.querySelector(containerId);

    const svg = d3.select("#visualization-container").append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox", "-10 -10 20 20");

    const matrixDisplay = container.querySelector("#matrix-display");
    const eigenDisplay = container.querySelector("#eigen-display");
    const psdDisplay = container.querySelector("#psd-display");

    const aSlider = container.querySelector("#a");
    const bSlider = container.querySelector("#b");
    const cSlider = container.querySelector("#c");

    async function draw() {
        const a = +aSlider.value;
        const b = +bSlider.value;
        const c = +cSlider.value;

        matrixDisplay.textContent = `Matrix: [[${a}, ${b}], [${b}, ${c}]]`;

        const result = await pyodide.runPythonAsync(`
            import numpy as np
            A = np.array([[${a}, ${b}], [${b}, ${c}]])
            eigvals, eigvecs = np.linalg.eigh(A)
            is_psd = np.all(eigvals >= -1e-8)

            # Sort eigenvalues and eigenvectors
            sort_indices = np.argsort(eigvals)[::-1]
            eigvals = eigvals[sort_indices]
            eigvecs = eigvecs[:, sort_indices]

            [list(eigvals), eigvecs.tolist(), is_psd]
        `);

        const [eigvals, eigvecs, is_psd] = result.toJs();

        eigenDisplay.innerHTML = `
            Eigenvalues: &lambda;<sub>1</sub> = ${eigvals[0].toFixed(2)},
                         &lambda;<sub>2</sub> = ${eigvals[1].toFixed(2)}
        `;
        psdDisplay.textContent = `Positive Semidefinite: ${is_psd ? 'Yes' : 'No'}`;

        svg.selectAll("*").remove();

        const grid = svg.append("g").attr("class", "grid");
        for (let i = -10; i <= 10; i++) {
            grid.append("line")
                .attr("x1", i).attr("y1", -10)
                .attr("x2", i).attr("y2", 10)
                .attr("stroke", "var(--color-surface-1)").attr("stroke-width", 0.1);
            grid.append("line")
                .attr("x1", -10).attr("y1", i)
                .attr("x2", 10).attr("y2", i)
                .attr("stroke", "var(--color-surface-1)").attr("stroke-width", 0.1);
        }

        const transformedPoints = [];
        for (let i = -10; i <= 10; i += 0.5) {
            for (let j = -10; j <= 10; j += 0.5) {
                transformedPoints.push([
                    a * i + b * j,
                    b * i + c * j
                ]);
            }
        }

        svg.selectAll(".transformed-point")
            .data(transformedPoints)
            .enter().append("circle")
            .attr("cx", d => d[0])
            .attr("cy", d => d[1])
            .attr("r", 0.1)
            .attr("fill", "var(--color-primary)");

        // Draw eigenvectors
        svg.selectAll(".eigenvector")
            .data(eigvecs)
            .enter().append("line")
            .attr("class", "eigenvector")
            .attr("x1", 0).attr("y1", 0)
            .attr("x2", (d, i) => d[0] * eigvals[i])
            .attr("y2", (d, i) => d[1] * eigvals[i])
            .attr("stroke", "var(--color-accent)")
            .attr("stroke-width", 0.3);
    }

    [aSlider, bSlider, cSlider].forEach(slider => {
        slider.addEventListener("input", draw);
    });

    draw();
}

initEigenPsd(".widget-container");
