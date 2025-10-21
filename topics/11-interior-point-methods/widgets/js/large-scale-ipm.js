import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

function initLargeScaleIpm(containerId) {
    const container = document.querySelector(containerId);

    // This data is illustrative, based on typical IPM performance.
    // A real run would require a proper solver and more time.
    const data = [
        { size: 10, iterations: 12 },
        { size: 50, iterations: 15 },
        { size: 100, iterations: 16 },
        { size: 200, iterations: 18 },
        { size: 500, iterations: 20 },
        { size: 1000, iterations: 22 },
        { size: 2000, iterations: 23 }
    ];

    const margin = {top: 20, right: 30, bottom: 40, left: 50};
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select("#ipm-behavior-plot-container").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLog()
        .domain(d3.extent(data, d => d.size))
        .range([0, width]);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.iterations) * 1.1])
        .range([height, 0]);

    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).ticks(5, ".0s"))
        .append("text")
        .attr("x", width / 2)
        .attr("y", 35)
        .attr("fill", "var(--color-text-main)")
        .text("Problem Size (n)");

    svg.append("g")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -40)
        .attr("x", -height / 2)
        .attr("fill", "var(--color-text-main)")
        .attr("text-anchor", "middle")
        .text("IPM Iterations");

    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "var(--color-accent)")
        .attr("stroke-width", 2)
        .attr("d", d3.line()
            .x(d => x(d.size))
            .y(d => y(d.iterations))
        );

    svg.selectAll("circle")
        .data(data)
        .enter().append("circle")
        .attr("cx", d => x(d.size))
        .attr("cy", d => y(d.iterations))
        .attr("r", 5)
        .attr("fill", "var(--color-primary)");
}

initLargeScaleIpm(".widget-container");
