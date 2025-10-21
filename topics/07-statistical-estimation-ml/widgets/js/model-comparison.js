import { getPyodide } from "../../../../static/js/pyodide-manager.js";

async function initModelComparison(containerId) {
    const pyodide = await getPyodide();
    const container = document.querySelector(containerId);
    const resultsTbody = container.querySelector("#results-tbody");

    const pythonCode = `
import numpy as np
from sklearn.datasets import make_moons
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC
from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import KNeighborsClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score

X, y = make_moons(n_samples=200, noise=0.3, random_state=42)
X = StandardScaler().fit_transform(X)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=.4, random_state=42)

h = .02
x_min, x_max = X[:, 0].min() - .5, X[:, 0].max() + .5
y_min, y_max = X[:, 1].min() - .5, X[:, 1].max() + .5
xx, yy = np.meshgrid(np.arange(x_min, x_max, h),
                     np.arange(y_min, y_max, h))

models = {
    "svm": SVC(gamma=2, C=1),
    "logistic": LogisticRegression(C=0.1),
    "knn": KNeighborsClassifier(3),
    "tree": DecisionTreeClassifier(max_depth=5)
}

results = {}

for name, clf in models.items():
    clf.fit(X_train, y_train)
    y_pred = clf.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)

    Z = clf.predict(np.c_[xx.ravel(), yy.ravel()])
    Z = Z.reshape(xx.shape)

    results[name] = {
        "accuracy": accuracy,
        "Z": Z.tolist()
    }

initial_data = {
    "X_train": X_train.tolist(), "y_train": y_train.tolist(),
    "X_test": X_test.tolist(), "y_test": y_test.tolist(),
    "xx": xx.tolist(), "yy": yy.tolist(),
    "x_min": x_min, "x_max": x_max, "y_min": y_min, "y_max": y_max,
    "results": results
}
initial_data
`;
    const data = await pyodide.runPythonAsync(pythonCode);
    const { X_train, y_train, X_test, y_test, xx, yy, x_min, x_max, y_min, y_max, results } = data.toJs();
    const color = d3.scaleOrdinal(d3.schemeCategory10).domain([0, 1]);

    const margin = {top: 20, right: 20, bottom: 30, left: 40};
    const width = 400 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const xScale = d3.scaleLinear().domain([x_min, x_max]).range([0, width]);
    const yScale = d3.scaleLinear().domain([y_min, y_max]).range([height, 0]);

    function plotDecisionBoundary(plotId, Z_data, title) {
        const svg = d3.select(plotId).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(xScale));

        svg.append("g")
            .call(d3.axisLeft(yScale));

        const contour = d3.contour()
            .x((d, i) => xScale(xx[0][i % xx[0].length]))
            .y((d, i) => yScale(yy[Math.floor(i / xx[0].length)][0]))
            .size([xx[0].length, xx.length])
            .thresholds([0.5]);

        svg.append("g")
            .selectAll("path")
            .data(d3.contours().size([xx[0].length, xx.length]).thresholds([0.5])(Z_data.flat()))
            .enter().append("path")
            .attr("d", d3.geoPath())
            .attr("fill", color(1))
            .attr("opacity", 0.5);

        svg.selectAll("circle.train")
            .data(X_train)
            .enter().append("circle")
            .attr("class", "train")
            .attr("cx", d => xScale(d[0]))
            .attr("cy", d => yScale(d[1]))
            .attr("r", 4)
            .attr("fill", (d, i) => color(y_train[i]));

        svg.selectAll("circle.test")
            .data(X_test)
            .enter().append("circle")
            .attr("class", "test")
            .attr("cx", d => xScale(d[0]))
            .attr("cy", d => yScale(d[1]))
            .attr("r", 4)
            .attr("stroke", (d, i) => color(y_test[i]))
            .attr("fill", "none");

        svg.append("text")
            .attr("x", width / 2)
            .attr("y", 0 - (margin.top / 2) + 10)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .attr("fill", "var(--color-text-main)")
            .text(title);
    }

    plotDecisionBoundary("#svm-plot", results.svm.Z, "SVM");
    plotDecisionBoundary("#logistic-plot", results.logistic.Z, "Logistic Regression");
    plotDecisionBoundary("#knn-plot", results.knn.Z, "K-Nearest Neighbors");
    plotDecisionBoundary("#tree-plot", results.tree.Z, "Decision Tree");

    for (const model in results) {
        const row = resultsTbody.insertRow();
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        cell1.textContent = model.toUpperCase();
        cell2.textContent = results[model].accuracy.toFixed(3);
    }
}

initModelComparison(".widget-container");
