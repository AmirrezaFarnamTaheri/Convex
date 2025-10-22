
import * as d3 from "https://cdn.skypack.dev/d3@7";

function initFacilityLocation(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const vizContainer = container.querySelector('#facility-location-visualization');
    const svg = d3.select(vizContainer).append("svg")
        .attr("width", "100%")
        .attr("height", "100%");

    const width = 600;
    const height = 400;

    const clients = d3.range(10).map(() => ({
        x: Math.random() * width,
        y: Math.random() * height
    }));

    const facility = { x: width / 2, y: height / 2 };

    svg.selectAll("circle.client")
        .data(clients)
        .enter().append("circle")
        .attr("class", "client")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("r", 5)
        .style("fill", "var(--color-primary)");

    svg.append("circle")
        .attr("class", "facility")
        .attr("cx", facility.x)
        .attr("cy", facility.y)
        .attr("r", 10)
        .style("fill", "var(--color-accent)");
}

initFacilityLocation('facility-location-container');
