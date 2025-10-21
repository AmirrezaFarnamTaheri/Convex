import { getPyodide } from "../../../../static/js/pyodide-manager.js";

async function initFeatureSelection(containerId) {
    const pyodide = await getPyodide();
    const container = document.querySelector(containerId);
    const cSlider = container.querySelector("#c-slider");

    const margin = {top: 20, right: 20, bottom: 30, left: 40};
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select("#sparsity-plot-container").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const pythonCode = `
        import numpy as np
        from sklearn.datasets import make_classification
        from sklearn.linear_model import LogisticRegression

        X, y = make_classification(n_samples=100, n_features=20, n_informative=5,
                                   n_redundant=5, n_classes=2, random_state=42)

        def get_coefs(C):
            clf = LogisticRegression(penalty='l1', C=C, solver='liblinear', random_state=42)
            clf.fit(X, y)
            return clf.coef_.flatten().tolist()

        initial_coefs = get_coefs(1.0)
        {"n_features": 20, "initial_coefs": initial_coefs}
    `;

    const data = await pyodide.runPythonAsync(pythonCode);
    const { n_features, initial_coefs } = data.toJs();

    const xScale = d3.scaleBand().domain(d3.range(n_features)).range([0, width]).padding(0.1);
    const yScale = d3.scaleLinear().domain(d3.extent(initial_coefs)).range([height, 0]);

    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale).tickFormat(i => `Feature ${i}`));

    svg.append("g")
        .call(d3.axisLeft(yScale));

    const bars = svg.selectAll(".bar")
        .data(initial_coefs)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", (d, i) => xScale(i))
        .attr("y", d => yScale(Math.max(0, d)))
        .attr("width", xScale.bandwidth())
        .attr("height", d => Math.abs(yScale(d) - yScale(0)))
        .attr("fill", "var(--color-primary)");

    async function update(C) {
        const coefs = await pyodide.runPythonAsync(`get_coefs(${C})`);
        const coefs_js = coefs.toJs();
        yScale.domain(d3.extent(coefs_js));

        bars.data(coefs_js)
            .transition()
            .duration(200)
            .attr("y", d => yScale(Math.max(0, d)))
            .attr("height", d => Math.abs(yScale(d) - yScale(0)));
    }

    cSlider.addEventListener("input", () => {
        const C = Math.pow(10, +cSlider.value);
        update(C);
    });

    update(1.0);
}

initFeatureSelection(".widget-container");
