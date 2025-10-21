import { getPyodide } from "../../../../static/js/pyodide-manager.js";

async function initMultiClass(containerId) {
    const pyodide = await getPyodide();
    const container = document.querySelector(containerId);
    const modelSelect = container.querySelector("#model-select");

    const margin = {top: 20, right: 20, bottom: 30, left: 40};
    const width = 500 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3.select("#classification-plot-container").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const pythonCode = `
        import numpy as np
        from sklearn.datasets import make_blobs
        from sklearn.linear_model import LogisticRegression
        from sklearn.multiclass import OneVsRestClassifier

        X, y = make_blobs(n_samples=150, centers=4, n_features=2, random_state=42, cluster_std=1.2)

        h = .02
        x_min, x_max = X[:, 0].min() - 1, X[:, 0].max() + 1
        y_min, y_max = X[:, 1].min() - 1, X[:, 1].max() + 1
        xx, yy = np.meshgrid(np.arange(x_min, x_max, h),
                             np.arange(y_min, y_max, h))

        def get_decision_boundary(model_type):
            if model_type == 'ovr':
                clf = OneVsRestClassifier(LogisticRegression(random_state=42))
            else: # softmax
                clf = LogisticRegression(multi_class='multinomial', solver='lbfgs', random_state=42)

            clf.fit(X, y)
            Z = clf.predict(np.c_[xx.ravel(), yy.ravel()])
            return Z.reshape(xx.shape).tolist()

        initial_Z = get_decision_boundary('ovr')

        {
            "X": X.tolist(), "y": y.tolist(),
            "xx": xx.tolist(), "yy": yy.tolist(), "Z": initial_Z,
            "x_min": x_min, "x_max": x_max, "y_min": y_min, "y_max": y_max
        }
    `;

    const data = await pyodide.runPythonAsync(pythonCode);
    const { X, y, xx, yy, Z, x_min, x_max, y_min, y_max } = data.toJs();
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const xScale = d3.scaleLinear().domain([x_min, x_max]).range([0, width]);
    const yScale = d3.scaleLinear().domain([y_min, y_max]).range([height, 0]);

    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale));

    svg.append("g")
        .call(d3.axisLeft(yScale));

    const contourGroup = svg.append("g").attr("class", "contours");
    const pointsGroup = svg.append("g").attr("class", "points");

    function draw(Z_data) {
        contourGroup.selectAll("*").remove();

        contourGroup.selectAll("path")
            .data(d3.contours()
                .size([xx[0].length, xx.length])
                .thresholds(d3.range(0, 4, 1))
                (Z_data.flat())
            )
            .enter().append("path")
            .attr("d", d3.geoPath())
            .attr("fill", d => color(d.value))
            .attr("opacity", 0.5);
    }

    pointsGroup.selectAll("circle")
        .data(X)
        .enter().append("circle")
        .attr("cx", d => xScale(d[0]))
        .attr("cy", d => yScale(d[1]))
        .attr("r", 4)
        .attr("fill", (d, i) => color(y[i]));

    modelSelect.addEventListener("change", async () => {
        const model = modelSelect.value;
        const new_Z = await pyodide.runPythonAsync(`get_decision_boundary('${model}')`);
        draw(new_Z.toJs());
    });

    draw(Z);
}

initMultiClass(".widget-container");
