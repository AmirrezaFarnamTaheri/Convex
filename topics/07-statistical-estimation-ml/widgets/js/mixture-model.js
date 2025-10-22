
import * as d3 from "https://cdn.skypack.dev/d3@7";

async function initMixtureModel(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const vizContainer = container.querySelector('#mixture-model-visualization');
    const svg = d3.select(vizContainer).append("svg")
        .attr("width", "100%")
        .attr("height", "100%");

    const statusDiv = document.createElement('div');
    container.prepend(statusDiv);
    statusDiv.innerText = "Pyodide loading...";

    const pyodide = await loadPyodide();
    await pyodide.loadPackage(["numpy", "scikit-learn"]);
    statusDiv.innerText = "Ready.";

    const width = 600;
    const height = 400;

    // Generate some data
    const data = d3.range(100).map(() => ([Math.random() * width, Math.random() * height]));

    pyodide.globals.set("data", data);

    const gmm_code = `
import numpy as np
from sklearn.mixture import GaussianMixture

def run_gmm(data):
    gmm = GaussianMixture(n_components=2, random_state=0)
    gmm.fit(data)
    return gmm.predict(data), gmm.means_

labels, means = run_gmm(np.array(data))
`;

    await pyodide.runPythonAsync(gmm_code);
    const labels = pyodide.globals.get("labels").toJs();
    const means = pyodide.globals.get("means").toJs();

    svg.selectAll("circle.point")
        .data(data)
        .enter().append("circle")
        .attr("class", "point")
        .attr("cx", d => d[0])
        .attr("cy", d => d[1])
        .attr("r", 5)
        .style("fill", (d, i) => labels[i] === 0 ? "var(--color-primary)" : "var(--color-accent)");

    svg.selectAll("circle.mean")
        .data(means)
        .enter().append("circle")
        .attr("class", "mean")
        .attr("cx", d => d[0])
        .attr("cy", d => d[1])
        .attr("r", 10)
        .style("fill", (d, i) => i === 0 ? "var(--color-primary)" : "var(--color-accent)")
        .style("stroke", "white");
}

initMixtureModel('mixture-model-container');
