/**
 * Widget: Model Comparison Dashboard
 *
 * Description: A dashboard to compare the performance of different classifiers on a given dataset.
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { getPyodide } from "../../../../static/js/pyodide-manager.js";

export async function initModelComparison(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="model-comparison-widget">
            <div class="widget-controls">
                <label>Dataset:</label>
                <select id="dataset-select">
                    <option value="moons">Moons</option>
                    <option value="circles">Circles</option>
                    <option value="blobs">Blobs</option>
                </select>
                <button id="regenerate-data-btn">Regenerate Data</button>
            </div>
            <div class="comparison-grid">
                <div class="plot-cell"><h5>Logistic Regression</h5><div id="logistic-plot"></div><p id="logistic-acc"></p><div id="logistic-cm"></div></div>
                <div class="plot-cell"><h5>SVM (RBF)</h5><div id="svm-plot"></div><p id="svm-acc"></p><div id="svm-cm"></div></div>
                <div class="plot-cell"><h5>Decision Tree</h5><div id="tree-plot"></div><p id="tree-acc"></p><div id="tree-cm"></div></div>
                <div class="plot-cell"><h5>KNN (k=3)</h5><div id="knn-plot"></div><p id="knn-acc"></p><div id="knn-cm"></div></div>
                <div class="plot-cell"><h5>Random Forest</h5><div id="forest-plot"></div><p id="forest-acc"></p><div id="forest-cm"></div></div>
            </div>
        </div>
    `;

    const datasetSelect = container.querySelector("#dataset-select");
    const regenBtn = container.querySelector("#regenerate-data-btn");

    const margin = {top: 10, right: 10, bottom: 30, left: 40};
    const width = 250 - margin.left - margin.right;
    const height = 250 - margin.top - margin.bottom;

    const pyodide = await getPyodide();
    await pyodide.loadPackage("scikit-learn");
    const pythonCode = `
import numpy as np
from sklearn.datasets import make_moons, make_circles, make_blobs
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC
from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import KNeighborsClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, confusion_matrix
import json

datasets = {
    "moons": make_moons(n_samples=200, noise=0.3, random_state=np.random.randint(1000)),
    "circles": make_circles(n_samples=200, noise=0.2, factor=0.5, random_state=np.random.randint(1000)),
    "blobs": make_blobs(n_samples=200, centers=2, cluster_std=1.5, random_state=np.random.randint(1000))
}

models = {
    "logistic": LogisticRegression(solver='lbfgs'),
    "svm": SVC(gamma=2, C=1),
    "tree": DecisionTreeClassifier(max_depth=5),
    "knn": KNeighborsClassifier(3),
    "forest": RandomForestClassifier(max_depth=5, n_estimators=10, max_features=1)
}

def process_dataset(dataset_name):
    X, y = datasets[dataset_name]
    X = StandardScaler().fit_transform(X)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.4)

    x_min, x_max = X[:, 0].min() - .5, X[:, 0].max() + .5
    y_min, y_max = X[:, 1].min() - .5, X[:, 1].max() + .5
    xx, yy = np.meshgrid(np.arange(x_min, x_max, 0.1), np.arange(y_min, y_max, 0.1))

    results = {}
    for name, clf in models.items():
        clf.fit(X_train, y_train)
        y_pred = clf.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        cm = confusion_matrix(y_test, y_pred).tolist()
        Z = clf.predict(np.c_[xx.ravel(), yy.ravel()]).reshape(xx.shape)
        results[name] = {"accuracy": accuracy, "Z": Z.tolist(), "cm": cm}

    return json.dumps({
        "X": X.tolist(), "y": y.tolist(), "xx": xx[0].tolist(), "yy": yy[:,0].tolist(),
        "domain": [x_min, x_max, y_min, y_max], "results": results
    })
`;
    await pyodide.runPythonAsync(pythonCode);
    const process_dataset = pyodide.globals.get('process_dataset');

    async function update() {
        regenBtn.disabled = true;
        const dataset = datasetSelect.value;
        const data = await process_dataset(dataset).then(r => JSON.parse(r));

        const x = d3.scaleLinear().domain(data.domain.slice(0,2)).range([0, width]);
        const y = d3.scaleLinear().domain(data.domain.slice(2,4)).range([height, 0]);

        for (const model_name in data.results) {
            const plotDiv = container.querySelector(`#${model_name}-plot`);
            plotDiv.innerHTML = '';
            const accP = container.querySelector(`#${model_name}-acc`);
            const cmDiv = container.querySelector(`#${model_name}-cm`);
            accP.textContent = `Accuracy: ${data.results[model_name].accuracy.toFixed(2)}`;

            const svg = d3.select(plotDiv).append("svg")
                .attr("width", width+margin.left+margin.right).attr("height", height+margin.top+margin.bottom)
              .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

            // Confusion Matrix
            const cm = data.results[model_name].cm;
            cmDiv.innerHTML = `<table>
                <tr><td>${cm[0][0]}</td><td>${cm[0][1]}</td></tr>
                <tr><td>${cm[1][0]}</td><td>${cm[1][1]}</td></tr>
            </table>`;

            // Boundary
            const Z = data.results[model_name].Z;
            const colors = ["var(--color-primary-light)", "var(--color-accent-light)"];
            svg.append("image")
                .attr("width", width).attr("height", height)
                .attr("preserveAspectRatio", "none")
                .attr("xlink:href", () => {
                    const canvas = document.createElement("canvas");
                    canvas.width = data.xx.length; canvas.height = data.yy.length;
                    const context = canvas.getContext("2d");
                    const imageData = context.createImageData(canvas.width, canvas.height);
                    for(let j=0, k=0; j<canvas.height; j++){
                        for(let i=0; i<canvas.width; i++, k++){
                            const c = d3.rgb(colors[Z[j][i]]);
                            imageData.data.set([c.r, c.g, c.b, 128], k*4);
                        }
                    }
                    context.putImageData(imageData, 0, 0);
                    return canvas.toDataURL();
                });

            // Points
            svg.selectAll("circle").data(data.X).join("circle")
                .attr("cx", d=>x(d[0])).attr("cy", d=>y(d[1])).attr("r", 3)
                .attr("fill", (d,i)=> data.y[i]===0 ? "var(--color-primary)" : "var(--color-accent)");
        }
        regenBtn.disabled = false;
    }

    datasetSelect.addEventListener("change", update);
    regenBtn.addEventListener("click", update);
    update();
}
