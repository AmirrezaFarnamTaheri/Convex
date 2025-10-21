import "https://d3js.org/d3.v7.min.js";

export async function initSimplexVsIPM(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container #${containerId} not found`);
        return;
    }
    container.innerHTML = `
    <div style="display: flex; flex-direction: column; height: 100%;">
      <div style="flex-grow: 1; position: relative;" id="vis-svi"></div>
      <div style="padding: 10px; font-family: sans-serif; font-size: 14px; text-align: center;">
         <button id="svi-animate-btn" style="padding: 5px 10px;">Animate</button>
      </div>
    </div>
  `;

    const width = container.querySelector('#vis-svi').clientWidth;
    const height = container.querySelector('#vis-svi').clientHeight;
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };

    const svg = d3.select(container.querySelector('#vis-svi')).append("svg")
        .attr("width", width)
        .attr("height", height);

    const xScale = d3.scaleLinear().domain([0, 6]).range([margin.left, width - margin.right]);
    const yScale = d3.scaleLinear().domain([0, 6]).range([height - margin.bottom, margin.top]);

    // LP: max c'x s.t. Ax <= b, x >= 0
    // c = [1, 1], A = [[1,2], [2,1]], b = [8, 7]
    const simplexPathData = [ {x: 0, y: 0}, {x: 3.5, y: 0}, {x: 2, y: 3} ];
    const interiorPathData = [ {x: 1, y: 1}, {x: 1.5, y: 1.8}, {x: 1.8, y: 2.5}, {x: 2, y: 3} ];

    function render(animated = false) {
        svg.selectAll("*").remove();

        // Grid and axes
        const grid = g => g.attr("stroke", "currentColor").attr("stroke-opacity", 0.1);
        svg.append("g").call(g => g.selectAll("line").data(xScale.ticks()).join("line")
            .attr("x1", d => 0.5 + xScale(d)).attr("x2", d => 0.5 + xScale(d))
            .attr("y1", margin.top).attr("y2", height - margin.bottom)).call(grid);
        svg.append("g").call(g => g.selectAll("line").data(yScale.ticks()).join("line")
            .attr("y1", d => 0.5 + yScale(d)).attr("y2", d => 0.5 + yScale(d))
            .attr("x1", margin.left).attr("x2", width - margin.right)).call(grid);
        svg.append("g").attr("transform", `translate(0,${yScale(0)})`).call(d3.axisBottom(xScale).ticks(5));
        svg.append("g").attr("transform", `translate(${xScale(0)},0)`).call(d3.axisLeft(yScale).ticks(5));

        // Feasible region for the LP
        const feasibleRegionData = [[0,0], [3.5,0], [2,3], [0,4]];
        svg.append("polygon")
            .attr("points", feasibleRegionData.map(p => [xScale(p[0]), yScale(p[1])].join(",")).join(" "))
            .attr("fill", "#7cc5ff").attr("fill-opacity", 0.3)
            .attr("stroke", "#7cc5ff").attr("stroke-width", 2);

        // Objective function contours (x + y = const)
        const contours = d3.range(1, 7).map(c => [[[c,0], [0,c]]]);
        svg.append("g").selectAll("path").data(contours).join("path")
            .attr("d", d3.line().x(p => xScale(p[0])).y(p => yScale(p[1])))
            .attr("stroke", "#80ffb0").attr("stroke-width", 1).attr("stroke-dasharray", "4 4");

        // Optimum
        const optimum = {x: 2, y: 3};
        svg.append("circle").attr("cx", xScale(optimum.x)).attr("cy", yScale(optimum.y)).attr("r", 6).attr("fill", "gold");
        svg.append("text").attr("x", xScale(optimum.x)+5).attr("y", yScale(optimum.y)-5).text("x*");

        // Paths
        const line = d3.line().x(d => xScale(d.x)).y(d => yScale(d.y));

        const simplexPath = svg.append("path")
            .datum(simplexPathData)
            .attr("fill", "none").attr("stroke", "red").attr("stroke-width", 2.5)
            .attr("d", line);

        const interiorPath = svg.append("path")
            .datum(interiorPathData)
            .attr("fill", "none").attr("stroke", "magenta").attr("stroke-width", 2.5)
            .attr("d", line);

        if (animated) {
            [simplexPath, interiorPath].forEach(path => {
                 const totalLength = path.node().getTotalLength();
                 path.attr("stroke-dasharray", totalLength + " " + totalLength)
                    .attr("stroke-dashoffset", totalLength)
                    .transition().duration(2000).ease(d3.easeLinear)
                    .attr("stroke-dashoffset", 0);
            });
        }

        // Legend
        svg.append("circle").attr("cx",xScale(0.5)).attr("cy",yScale(5.5)).attr("r", 6).style("fill", "red")
        svg.append("text").attr("x", xScale(0.7)).attr("y", yScale(5.5)).text("Simplex Path").style("font-size", "12px").attr("alignment-baseline","middle")
        svg.append("circle").attr("cx",xScale(0.5)).attr("cy",yScale(5.2)).attr("r", 6).style("fill", "magenta")
        svg.append("text").attr("x", xScale(0.7)).attr("y", yScale(5.2)).text("Interior-Point Path").style("font-size", "12px").attr("alignment-baseline","middle")
    }

    container.querySelector("#svi-animate-btn").addEventListener("click", () => render(true));
    render();
}
