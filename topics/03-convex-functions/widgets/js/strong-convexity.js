import * as d3 from "https://cdn.skypack.dev/d3@7";

function initStrongConvexity(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const vizContainer = container.querySelector('#strong-convexity-visualization');

    const margin = {top: 20, right: 20, bottom: 30, left: 40};
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(vizContainer)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().range([0, width]).domain([-2, 2]);
    const y = d3.scaleLinear().range([height, 0]).domain([0, 4]);

    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .call(d3.axisLeft(y));

    const convexFunc = (x) => x**2;
    const stronglyConvexFunc = (x) => x**2 + 0.5 * x**2;
    const lowerBoundFunc = (x) => x**2 - 0.5 * x**2;

    const line = d3.line()
        .x(d => x(d.x))
        .y(d => y(d.y));

    const data = d3.range(-2, 2.1, 0.1).map(d => ({x: d, y: convexFunc(d)}));
    const strongData = d3.range(-2, 2.1, 0.1).map(d => ({x: d, y: stronglyConvexFunc(d)}));
    const lowerBoundData = d3.range(-2, 2.1, 0.1).map(d => ({x: d, y: lowerBoundFunc(d)}));

    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "var(--color-primary)")
        .attr("stroke-width", 2)
        .attr("d", line);

    svg.append("path")
        .datum(strongData)
        .attr("fill", "none")
        .attr("stroke", "var(--color-accent)")
        .attr("stroke-width", 2)
        .attr("d", line);

    svg.append("path")
        .datum(lowerBoundData)
        .attr("fill", "none")
        .attr("stroke", "var(--color-surface-1)")
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "4")
        .attr("d", line);

    svg.append("text").attr("x", 10).attr("y", 30).text("f(x) = x^2").style("fill", "var(--color-primary)");
    svg.append("text").attr("x", 10).attr("y", 50).text("g(x) = 1.5x^2").style("fill", "var(--color-accent)");
    svg.append("text").attr("x", 10).attr("y", 70).text("Lower Bound").style("fill", "var(--color-surface-1)");

}

initStrongConvexity('strong-convexity-container');
