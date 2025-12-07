
import * as d3 from "https://cdn.skypack.dev/d3@7";

function initWarmStart(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const chartContainer = container.querySelector('#warm-start-chart');

    const margin = {top: 20, right: 20, bottom: 30, left: 50};
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(chartContainer)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const coldData = d3.range(10).map(i => ({iteration: i, gap: 1 / (i + 1)}));
    const warmData = d3.range(5).map(i => ({iteration: i, gap: 1 / (i*2 + 1)}));

    const x = d3.scaleLinear().range([0, width]).domain([0, 9]);
    const y = d3.scaleLinear().range([height, 0]).domain([0, 1]);

    svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));
    svg.append("g").call(d3.axisLeft(y));

    const line = d3.line().x(d => x(d.iteration)).y(d => y(d.gap));

    svg.append("path").datum(coldData).attr("fill", "none").attr("stroke", "var(--color-primary)").attr("stroke-width", 2).attr("d", line);
    svg.append("path").datum(warmData).attr("fill", "none").attr("stroke", "var(--color-accent)").attr("stroke-width", 2).attr("d", line);

    svg.append("text").attr("x", 50).attr("y", 30).text("Cold Start").style("fill", "var(--color-primary)");
    svg.append("text").attr("x", 50).attr("y", 50).text("Warm Start").style("fill", "var(--color-accent)");
}

initWarmStart('warm-start-container');
