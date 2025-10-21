import "https://d3js.org/d3.v7.min.js";

export async function initFeasibleVsInterior(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container #${containerId} not found`);
        return;
    }
     container.innerHTML = `
    <div style="display: flex; flex-direction: column; height: 100%;">
      <div style="flex-grow: 1; position: relative;" id="vis-fvi"></div>
      <div style="padding: 10px; font-family: sans-serif; font-size: 14px; text-align: center;">
         <button id="fvi-animate-btn" style="padding: 5px 10px;">Animate</button>
      </div>
    </div>
  `;

    const width = container.querySelector('#vis-fvi').clientWidth;
    const height = container.querySelector('#vis-fvi').clientHeight;
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };

    const svg = d3.select(container.querySelector('#vis-fvi')).append("svg")
        .attr("width", width)
        .attr("height", height);

    const xScale = d3.scaleLinear().domain([-1, 5]).range([margin.left, width - margin.right]);
    const yScale = d3.scaleLinear().domain([-1, 5]).range([height - margin.bottom, margin.top]);

    const feasiblePathData = [
        {x: 0.5, y: 0.5}, {x: 1, y: 1}, {x: 1.5, y: 1.5}, {x: 2, y: 2}, {x: 2.5, y: 2.5}, {x: 3, y: 3}, {x: 3.5, y: 3.5}, {x: 4, y: 4}
    ];

    const interiorPathData = [
        {x: 1, y: 2}, {x: 1.5, y: 2.2}, {x: 2, y: 2.5}, {x: 2.5, y: 2.8}, {x: 3, y: 3.2}, {x: 3.5, y: 3.6}, {x: 3.8, y: 3.8}, {x: 4, y: 4}
    ];


    function render(animated = false) {
        svg.selectAll("*").remove();

        // Draw grid and axes
        const grid = g => g.attr("stroke", "currentColor").attr("stroke-opacity", 0.1);
        svg.append("g").call(g => g.selectAll("line").data(xScale.ticks()).join("line")
            .attr("x1", d => 0.5 + xScale(d)).attr("x2", d => 0.5 + xScale(d))
            .attr("y1", margin.top).attr("y2", height - margin.bottom)).call(grid);
        svg.append("g").call(g => g.selectAll("line").data(yScale.ticks()).join("line")
            .attr("y1", d => 0.5 + yScale(d)).attr("y2", d => 0.5 + yScale(d))
            .attr("x1", margin.left).attr("x2", width - margin.right)).call(grid);
        svg.append("g").attr("transform", `translate(0,${yScale(0)})`).call(d3.axisBottom(xScale).ticks(5));
        svg.append("g").attr("transform", `translate(${xScale(0)},0)`).call(d3.axisLeft(yScale).ticks(5));

        // Draw a conceptual feasible region (a polygon)
        const feasibleRegionData = [[0,0], [4,0], [4,4], [0,4]];
        svg.append("polygon")
            .attr("points", feasibleRegionData.map(p => [xScale(p[0]), yScale(p[1])].join(",")).join(" "))
            .attr("fill", "#7cc5ff")
            .attr("fill-opacity", 0.3)
            .attr("stroke", "#7cc5ff")
            .attr("stroke-width", 2);

        // Draw optimum point
        const optimum = {x: 4, y: 4};
        svg.append("circle").attr("cx", xScale(optimum.x)).attr("cy", yScale(optimum.y)).attr("r", 6).attr("fill", "gold");
        svg.append("text").attr("x", xScale(optimum.x)+5).attr("y", yScale(optimum.y)-5).text("x*").attr("fill", "gold");

        // Paths
        const line = d3.line().x(d => xScale(d.x)).y(d => yScale(d.y));

        const feasiblePath = svg.append("path")
            .datum(feasiblePathData)
            .attr("fill", "none")
            .attr("stroke", "red")
            .attr("stroke-width", 2.5)
            .attr("d", line);

        const interiorPath = svg.append("path")
            .datum(interiorPathData)
            .attr("fill", "none")
            .attr("stroke", "magenta")
            .attr("stroke-width", 2.5)
            .attr("d", line);

        if (animated) {
            const feasibleTotalLength = feasiblePath.node().getTotalLength();
            feasiblePath
                .attr("stroke-dasharray", feasibleTotalLength + " " + feasibleTotalLength)
                .attr("stroke-dashoffset", feasibleTotalLength)
                .transition()
                .duration(2000)
                .ease(d3.easeLinear)
                .attr("stroke-dashoffset", 0);

            const interiorTotalLength = interiorPath.node().getTotalLength();
            interiorPath
                .attr("stroke-dasharray", interiorTotalLength + " " + interiorTotalLength)
                .attr("stroke-dashoffset", interiorTotalLength)
                .transition()
                .duration(2000)
                .ease(d3.easeLinear)
                .attr("stroke-dashoffset", 0);
        }

        // Legend
        svg.append("circle").attr("cx",xScale(0)).attr("cy",yScale(4.5)).attr("r", 6).style("fill", "red")
        svg.append("text").attr("x", xScale(0.2)).attr("y", yScale(4.5)).text("Feasible Method Path").style("font-size", "12px").attr("alignment-baseline","middle")
        svg.append("circle").attr("cx",xScale(0)).attr("cy",yScale(4.2)).attr("r", 6).style("fill", "magenta")
        svg.append("text").attr("x", xScale(0.2)).attr("y", yScale(4.2)).text("Interior-Point Method Path").style("font-size", "12px").attr("alignment-baseline","middle")
    }

    container.querySelector("#fvi-animate-btn").addEventListener("click", () => render(true));
    render();
}
