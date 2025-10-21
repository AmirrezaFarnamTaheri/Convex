import { getPyodide } from "../../../../static/js/pyodide-manager.js";

async function initFirstOrderGallery(containerId) {
    const pyodide = await getPyodide();
    const container = document.querySelector(containerId);
    const legendContainer = container.querySelector("#gallery-legend");

    const margin = {top: 20, right: 20, bottom: 30, left: 40};
    const width = 600 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    const svg = d3.select("#gallery-plot-container").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleLinear().domain([-2, 2]).range([0, width]);
    const yScale = d3.scaleLinear().domain([-1, 3]).range([height, 0]);

    svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(xScale));
    svg.append("g").call(d3.axisLeft(yScale));

    const pythonCode = `
import numpy as np

# Using Rosenbrock function, a classic hard test case
def rosenbrock(x, y):
    return (1 - x)**2 + 100 * (y - x**2)**2

def rosenbrock_grad(x, y):
    dx = -2 * (1 - x) - 400 * x * (y - x**2)
    dy = 200 * (y - x**2)
    return np.array([dx, dy])

start_pos = np.array([-1.5, 2.5])
iters = 200

# Simple Gradient Descent
def gd():
    path = [start_pos]
    pos = start_pos.copy()
    for _ in range(iters):
        pos -= 0.001 * rosenbrock_grad(pos[0], pos[1])
        path.append(pos.copy())
    return path

# Momentum
def momentum():
    path = [start_pos]
    pos = start_pos.copy()
    velocity = np.zeros(2)
    gamma = 0.9
    alpha = 0.001
    for _ in range(iters):
        velocity = gamma * velocity + alpha * rosenbrock_grad(pos[0], pos[1])
        pos -= velocity
        path.append(pos.copy())
    return path

# Adam
def adam():
    path = [start_pos]
    pos = start_pos.copy()
    m = np.zeros(2)
    v = np.zeros(2)
    beta1 = 0.9
    beta2 = 0.999
    epsilon = 1e-8
    alpha = 0.01
    for t in range(1, iters + 1):
        grad = rosenbrock_grad(pos[0], pos[1])
        m = beta1 * m + (1 - beta1) * grad
        v = beta2 * v + (1 - beta2) * (grad**2)
        m_hat = m / (1 - beta1**t)
        v_hat = v / (1 - beta2**t)
        pos -= alpha * m_hat / (np.sqrt(v_hat) + epsilon)
        path.append(pos.copy())
    return path

paths = {
    "GD": [p.tolist() for p in gd()],
    "Momentum": [p.tolist() for p in momentum()],
    "Adam": [p.tolist() for p in adam()]
}

# Contours
xx, yy = np.meshgrid(np.linspace(-2, 2, 100), np.linspace(-1, 3, 100))
zz = rosenbrock(xx, yy)
contours = {"x": xx[0].tolist(), "y": yy[:,0].tolist(), "z": zz.flatten().tolist()}

{"paths": paths, "contours": contours}
`;
    const dataPy = await pyodide.runPythonAsync(pythonCode);
    const { paths, contours } = dataPy.toJs();

    const contourData = d3.contours()
        .size([contours.x.length, contours.y.length])
        .thresholds([2, 5, 10, 25, 50, 100, 200, 400])
        (contours.z);

    svg.append("g")
        .selectAll("path")
        .data(contourData)
        .enter().append("path")
        .attr("d", d3.geoPath(d3.geoIdentity().scale(width / contours.x.length)))
        .attr("fill", "none")
        .attr("stroke", "var(--color-surface-1)");

    const color = d3.scaleOrdinal(d3.schemeCategory10);
    const line = d3.line().x(d => xScale(d[0])).y(d => yScale(d[1]));

    for (const [name, path] of Object.entries(paths)) {
        svg.append("path")
            .datum(path)
            .attr("fill", "none")
            .attr("stroke", color(name))
            .attr("stroke-width", 2)
            .attr("d", line);

        const legendItem = d3.select(legendContainer).append("div").attr("class", "legend-item");
        legendItem.append("div")
            .attr("class", "legend-color")
            .style("background-color", color(name));
        legendItem.append("span").text(name);
    }
}

initFirstOrderGallery(".widget-container");
