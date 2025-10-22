
import * as d3 from "https://cdn.skypack.dev/d3@7";

function initPackingProblem(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const vizContainer = container.querySelector('#packing-problem-visualization');
    const svg = d3.select(vizContainer).append("svg")
        .attr("width", "100%")
        .attr("height", "100%");

    const width = 600;
    const height = 400;

    const circles = d3.range(20).map(() => ({
        r: Math.random() * 30 + 10
    }));

    const pack = d3.pack().size([width, height]).padding(5);
    const root = pack(d3.hierarchy({children: circles}).sum(d => d.r * 2));

    svg.selectAll("circle")
        .data(root.leaves())
        .enter().append("circle")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("r", d => d.r)
        .style("fill", "var(--color-primary)");
}

initPackingProblem('packing-problem-container');
