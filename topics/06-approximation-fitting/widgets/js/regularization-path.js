import { getPyodide } from "../../../../static/js/pyodide-manager.js";

async function initRegularizationPath(containerId) {
    const pyodide = await getPyodide();
    const container = document.querySelector(containerId);
    const lambdaSlider = container.querySelector("#lambda-slider");

    const margin = {top: 20, right: 30, bottom: 40, left: 50};
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select("#path-container").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const pathData = await pyodide.runPythonAsync(`
        import numpy as np
        from sklearn.datasets import make_regression
        from sklearn.linear_model import lasso_path, enet_path

        X, y, true_coef = make_regression(n_samples=50, n_features=10, n_informative=5, noise=15, coef=True, random_state=42)

        # Lasso path
        alphas_lasso, coefs_lasso, _ = lasso_path(X, y, alphas=np.logspace(-3, 2, 100))

        # Ridge path (using elastic net with l1_ratio=0)
        alphas_ridge, coefs_ridge, _ = enet_path(X, y, l1_ratio=0, alphas=np.logspace(-3, 2, 100))

        {
            "lasso": {
                "alphas": alphas_lasso.tolist(),
                "coefs": coefs_lasso.T.tolist()
            },
            "ridge": {
                "alphas": alphas_ridge.tolist(),
                "coefs": coefs_ridge.T.tolist()
            }
        }
    `);

    const { lasso, ridge } = pathData.toJs();
    const n_features = lasso.coefs[0].length;
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const x = d3.scaleLog().domain(d3.extent(lasso.alphas)).range([0, width]);
    const y = d3.scaleLinear().domain([
        d3.min([d3.min(lasso.coefs, d => d3.min(d)), d3.min(ridge.coefs, d => d3.min(d))]),
        d3.max([d3.max(lasso.coefs, d => d3.max(d)), d3.max(ridge.coefs, d => d3.max(d))])
    ]).range([height, 0]);

    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).ticks(5, ".1e"))
        .append("text")
        .attr("x", width / 2)
        .attr("y", 35)
        .attr("fill", "var(--color-text-main)")
        .text("Lambda (α)");

    svg.append("g")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -40)
        .attr("x", -height/2)
        .attr("fill", "var(--color-text-main)")
        .attr("text-anchor", "middle")
        .text("Coefficient Value");

    function plotPaths(data, style) {
        for (let i = 0; i < n_features; i++) {
            const lineData = data.alphas.map((alpha, j) => ({alpha: alpha, value: data.coefs[j][i]}));
            svg.append("path")
                .datum(lineData)
                .attr("fill", "none")
                .attr("stroke", color(i))
                .attr("stroke-width", 2)
                .attr("stroke-dasharray", style === 'dashed' ? "5,5" : "none")
                .attr("d", d3.line()
                    .x(d => x(d.alpha))
                    .y(d => y(d.value))
                );
        }
    }

    plotPaths(lasso, 'solid');
    plotPaths(ridge, 'dashed');

    const legend = svg.append("g").attr("transform", `translate(${width - 100}, 0)`);
    legend.append("line").attr("x1", 0).attr("x2", 20).attr("y1", 10).attr("y2", 10).attr("stroke", "var(--color-text-main)").attr("stroke-width", 2);
    legend.append("text").attr("x", 25).attr("y", 10).attr("dy", "0.32em").text("Lasso").attr("fill", "var(--color-text-main)");
    legend.append("line").attr("x1", 0).attr("x2", 20).attr("y1", 30).attr("y2", 30).attr("stroke", "var(--color-text-main)").attr("stroke-width", 2).attr("stroke-dasharray", "5,5");
    legend.append("text").attr("x", 25).attr("y", 30).attr("dy", "0.32em").text("Ridge").attr("fill", "var(--color-text-main)");

}

initRegularizationPath(".widget-container");
