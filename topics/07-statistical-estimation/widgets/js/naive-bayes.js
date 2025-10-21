import { getPyodide } from "../../../../static/js/pyodide-manager.js";

async function initNaiveBayes(containerId) {
    const pyodide = await getPyodide();
    const container = document.querySelector(containerId);

    const margin = {top: 20, right: 20, bottom: 30, left: 40};
    const width = 400 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const mainSvg = d3.select("#main-plot-container").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const probSvg = d3.select("#prob-plot-container").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const data = await pyodide.runPythonAsync(`
        import numpy as np
        from sklearn.datasets import make_blobs
        from sklearn.naive_bayes import GaussianNB

        X, y = make_blobs(n_samples=100, centers=2, n_features=2, random_state=42, cluster_std=1.5)

        clf = GaussianNB()
        clf.fit(X, y)

        # Create a mesh to plot in
        h = .02  # step size in the mesh
        x_min, x_max = X[:, 0].min() - 1, X[:, 0].max() + 1
        y_min, y_max = X[:, 1].min() - 1, X[:, 1].max() + 1
        xx, yy = np.meshgrid(np.arange(x_min, x_max, h),
                             np.arange(y_min, y_max, h))

        Z = clf.predict(np.c_[xx.ravel(), yy.ravel()])
        Z = Z.reshape(xx.shape)

        {
            "X": X.tolist(), "y": y.tolist(),
            "xx": xx.tolist(), "yy": yy.tolist(), "Z": Z.tolist(),
            "x_min": x_min, "x_max": x_max, "y_min": y_min, "y_max": y_max,
            "priors": clf.class_prior_.tolist(),
            "means": clf.theta_.tolist(),
            "variances": clf.var_.tolist()
        }
    `);

    const { X, y, xx, yy, Z, x_min, x_max, y_min, y_max, priors, means, variances } = data.toJs();
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const xScale = d3.scaleLinear().domain([x_min, x_max]).range([0, width]);
    const yScale = d3.scaleLinear().domain([y_min, y_max]).range([height, 0]);

    mainSvg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale));

    mainSvg.append("g")
        .call(d3.axisLeft(yScale));

    const contour = d3.contour()
        .x(d => xScale(d.x))
        .y(d => yScale(d.y))
        .size([xx[0].length, xx.length])
        .thresholds([0.5]);

    const contourData = d3.contours()
        .size([xx[0].length, xx.length])
        .thresholds(d3.range(0, 1, 1))
        (Z.flat());

    mainSvg.selectAll("path")
        .data(contourData)
        .enter().append("path")
        .attr("d", d3.geoPath())
        .attr("fill", (d) => color(d.value))
        .attr("opacity", 0.5);

    mainSvg.selectAll("circle")
        .data(X)
        .enter().append("circle")
        .attr("cx", d => xScale(d[0]))
        .attr("cy", d => yScale(d[1]))
        .attr("r", 4)
        .attr("fill", (d, i) => color(y[i]));

    function updateProbPlot(x, y_val) {
        probSvg.selectAll("*").remove();
        // Visualization of conditional probabilities would go here.
        // This is a complex visualization, so for now we'll just show the posterior.
        const posterior = pyodide.runPython(`
            import numpy as np
            point = np.array([[${x}, ${y_val}]])
            clf.predict_proba(point).flatten().tolist()
        `).toJs();

        probSvg.selectAll("rect")
            .data(posterior)
            .enter().append("rect")
            .attr("x", (d, i) => i * 100 + 50)
            .attr("y", d => height - d * height)
            .attr("width", 50)
            .attr("height", d => d * height)
            .attr("fill", (d,i) => color(i));

        probSvg.selectAll("text")
            .data(posterior)
            .enter().append("text")
            .attr("x", (d, i) => i * 100 + 75)
            .attr("y", height + 15)
            .text((d,i) => `Class ${i}`)
            .attr("fill", "var(--color-text-main)")
            .attr("text-anchor", "middle");
    }

    mainSvg.on("click", (event) => {
        const [x, y_val] = d3.pointer(event);
        const domainX = xScale.invert(x);
        const domainY = yScale.invert(y_val);
        updateProbPlot(domainX, domainY);
    });
}

initNaiveBayes(".widget-container");
