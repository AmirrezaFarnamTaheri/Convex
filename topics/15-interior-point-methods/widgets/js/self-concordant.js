
import * as d3 from "https://cdn.skypack.dev/d3@7";

function initSelfConcordant(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const vizContainer = container.querySelector('#self-concordant-visualization');
    const svg = d3.select(vizContainer).append("svg")
        .attr("width", "100%")
        .attr("height", "100%");

    const width = 600;
    const height = 400;

    const x = d3.scaleLinear().range([0, width]).domain([0.1, 5]);
    const y = d3.scaleLinear().range([height, 0]).domain([-5, 5]);

    svg.append("g").attr("transform", `translate(0,${height/2})`).call(d3.axisBottom(x));
    svg.append("g").call(d3.axisLeft(y));

    const data = d3.range(0.1, 5.1, 0.1).map(d => ({x: d, y: -Math.log(d)}));

    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "var(--color-primary)")
        .attr("stroke-width", 2)
        .attr("d", d3.line().x(d => x(d.x)).y(d => y(d.y)));

    svg.append("text").attr("x", 50).attr("y", 30).text("f(x) = -log(x)").style("fill", "var(--color-primary)");

}

initSelfConcordant('self-concordant-container');
