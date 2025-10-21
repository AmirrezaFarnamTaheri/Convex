import "https://d3js.org/d3.v7.min.js";
import {
    loadPyodide
} from "https://cdn.jsdelivr.net/pyodide/v0.26.1/full/pyodide.mjs";

async function getPyodide() {
    if (!window.pyodide) {
        window.pyodide = await loadPyodide({
            indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.1/full/"
        });
        await window.pyodide.loadPackage("numpy");
    }
    return window.pyodide;
}

export async function initNewtonStepIPM(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container #${containerId} not found`);
        return;
    }

    container.innerHTML = `<div class="widget-loading-indicator">Initializing Pyodide...</div>`;

    const pyodide = await getPyodide();

    container.innerHTML = `
    <div style="display: flex; flex-direction: column; height: 100%;">
      <div style="flex-grow: 1; position: relative;" id="vis-newton-ipm"></div>
      <div style="padding: 10px; font-family: sans-serif; font-size: 14px; text-align: center;">
         <p>A single Newton step for an LP, showing the affine and centering directions.</p>
      </div>
    </div>
  `;

    // This is a conceptual visualization, so we'll use pre-calculated vectors
    // that represent a typical Newton step for an IPM.
    const state = {
        x_k: [2, 1.5],
        dx_aff: [1.5, 1.5], // Affine step, points towards the optimum
        dx_cent: [-0.5, 1], // Centering step, points towards the central path
        alpha: 0.8 // Step size
    };
    state.dx_nt = [state.dx_aff[0] + state.dx_cent[0], state.dx_aff[1] + state.dx_cent[1]];
    state.x_next = [state.x_k[0] + state.alpha * state.dx_nt[0], state.x_k[1] + state.alpha * state.dx_nt[1]];


    const width = container.querySelector('#vis-newton-ipm').clientWidth;
    const height = container.querySelector('#vis-newton-ipm').clientHeight;
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };

    const svg = d3.select(container.querySelector('#vis-newton-ipm')).append("svg")
        .attr("width", width)
        .attr("height", height);

    const xScale = d3.scaleLinear().domain([0, 5]).range([margin.left, width - margin.right]);
    const yScale = d3.scaleLinear().domain([0, 5]).range([height - margin.bottom, margin.top]);

    function render() {
        svg.selectAll("*").remove();

        svg.append('defs').append('marker')
            .attr('id', 'arrow-ipm')
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', 8).attr('refY', 0)
            .attr('markerWidth', 6).attr('markerHeight', 6)
            .attr('orient', 'auto')
            .append('path').attr('d', 'M0,-5L10,0L0,5');

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

        // Draw feasible region
        const feasibleRegionData = [[1,1], [4,1], [4,4], [1,4]];
        svg.append("polygon")
            .attr("points", feasibleRegionData.map(p => [xScale(p[0]), yScale(p[1])].join(",")).join(" "))
            .attr("fill", "#7cc5ff").attr("fill-opacity", 0.3)
            .attr("stroke", "#7cc5ff").attr("stroke-width", 2);

        // Draw central path (conceptual)
        const centralPathData = d3.range(1, 4, 0.1).map(d => [d, d]);
        svg.append("path")
            .datum(centralPathData)
            .attr("fill", "none").attr("stroke", "gold").attr("stroke-width", 2).attr("stroke-dasharray", "4 4")
            .attr("d", d3.line().x(d => xScale(d[0])).y(d => yScale(d[1])));

        // Draw optimum
        const optimum = {x: 4, y: 4};
        svg.append("circle").attr("cx", xScale(optimum.x)).attr("cy", yScale(optimum.y)).attr("r", 5).attr("fill", "gold");
        svg.append("text").attr("x", xScale(optimum.x)+5).attr("y", yScale(optimum.y)-5).text("x*");

        const { x_k, dx_aff, dx_cent, dx_nt, x_next, alpha } = state;

        // Draw current point
        svg.append("circle").attr("cx", xScale(x_k[0])).attr("cy", yScale(x_k[1])).attr("r", 5).attr("fill", "red");
        svg.append("text").attr("x", xScale(x_k[0])+5).attr("y", yScale(x_k[1])-5).text("x_k").attr("fill", "red");

        // Draw vectors from x_k
        // Affine step
        svg.append("line")
            .attr("x1", xScale(x_k[0])).attr("y1", yScale(x_k[1]))
            .attr("x2", xScale(x_k[0] + dx_aff[0])).attr("y2", yScale(x_k[1] + dx_aff[1]))
            .attr("stroke", "orange").attr("stroke-width", 2).attr("marker-end", "url(#arrow-ipm)");
        svg.append("text").attr("x", xScale(x_k[0] + dx_aff[0] * 0.5)+5).attr("y", yScale(x_k[1] + dx_aff[1] * 0.5)).text("dx_aff").attr("fill", "orange");

        // Centering step
        svg.append("line")
            .attr("x1", xScale(x_k[0])).attr("y1", yScale(x_k[1]))
            .attr("x2", xScale(x_k[0] + dx_cent[0])).attr("y2", yScale(x_k[1] + dx_cent[1]))
            .attr("stroke", "cyan").attr("stroke-width", 2).attr("marker-end", "url(#arrow-ipm)");
        svg.append("text").attr("x", xScale(x_k[0] + dx_cent[0] * 0.5)-25).attr("y", yScale(x_k[1] + dx_cent[1] * 0.5)).text("dx_cent").attr("fill", "cyan");

        // Full Newton step (dx_nt)
         svg.append("line")
            .attr("x1", xScale(x_k[0])).attr("y1", yScale(x_k[1]))
            .attr("x2", xScale(x_k[0] + dx_nt[0])).attr("y2", yScale(x_k[1] + dx_nt[1]))
            .attr("stroke", "magenta").attr("stroke-width", 2).attr("stroke-dasharray", "5 5");

        // The actual step taken (alpha * dx_nt)
         svg.append("line")
            .attr("x1", xScale(x_k[0])).attr("y1", yScale(x_k[1]))
            .attr("x2", xScale(x_next[0])).attr("y2", yScale(x_next[1]))
            .attr("stroke", "magenta").attr("stroke-width", 2).attr("marker-end", "url(#arrow-ipm)");
        svg.append("text").attr("x", xScale(x_k[0] + alpha*dx_nt[0]*0.5)+5).attr("y", yScale(x_k[1] + alpha*dx_nt[1]*0.5)).text("α·dx_nt").attr("fill", "magenta");

        // Draw next point
        svg.append("circle").attr("cx", xScale(x_next[0])).attr("cy", yScale(x_next[1])).attr("r", 5).attr("fill", "red").attr("fill-opacity", 0.5);
        svg.append("text").attr("x", xScale(x_next[0])+5).attr("y", yScale(x_next[1])-5).text("x_k+1").attr("fill", "red").attr("fill-opacity", 0.7);

    }

    render();
}
