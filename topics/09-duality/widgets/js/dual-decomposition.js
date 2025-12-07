
import * as d3 from "https://cdn.skypack.dev/d3@7";

function initDualDecomposition(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = ''; // Clear existing content

    const svg = d3.select(container)
        .append("svg")
        .attr("width", "100%")
        .attr("height", "400px")
        .style("font-family", "sans-serif")
        .style("font-size", "14px");

    const width = container.clientWidth;
    const height = 400;

    // Positions for boxes
    const masterPos = { x: width / 2, y: 50 };
    const sub1Pos = { x: width / 4, y: 250 };
    const sub2Pos = { x: 3 * width / 4, y: 250 };

    // Draw boxes
    const nodes = [
        { ...masterPos, text: "Master Problem" },
        { ...sub1Pos, text: "Subproblem 1" },
        { ...sub2Pos, text: "Subproblem 2" }
    ];

    svg.selectAll("rect")
        .data(nodes)
        .enter()
        .append("rect")
        .attr("x", d => d.x - 75)
        .attr("y", d => d.y - 25)
        .attr("width", 150)
        .attr("height", 50)
        .attr("rx", 5)
        .attr("ry", 5)
        .style("fill", "var(--color-surface-1)")
        .style("stroke", "var(--color-primary)");

    svg.selectAll("text.label")
        .data(nodes)
        .enter()
        .append("text")
        .attr("class", "label")
        .attr("x", d => d.x)
        .attr("y", d => d.y + 5)
        .attr("text-anchor", "middle")
        .style("fill", "var(--color-text-main)")
        .text(d => d.text);

    // Draw arrows
    const markerBoxWidth = 6;
    const markerBoxHeight = 6;
    const refX = markerBoxWidth / 2;
    const refY = markerBoxHeight / 2;
    const arrowPoints = [[0, 0], [0, 6], [6, 3]];

    svg.append('defs').append('marker')
        .attr('id', 'arrow')
        .attr('viewBox', [0, 0, markerBoxWidth, markerBoxHeight])
        .attr('refX', refX)
        .attr('refY', refY)
        .attr('markerWidth', markerBoxWidth)
        .attr('markerHeight', markerBoxHeight)
        .attr('orient', 'auto-start-reverse')
        .append('path')
        .attr('d', d3.line()(arrowPoints))
        .attr('stroke', 'var(--color-accent)');

    // Master to Subproblems (prices)
    svg.append('path')
        .attr('d', `M${masterPos.x},${masterPos.y + 25} L${sub1Pos.x},${sub1Pos.y - 25}`)
        .attr('stroke', 'var(--color-accent)')
        .attr('marker-end', 'url(#arrow)');
    svg.append('path')
        .attr('d', `M${masterPos.x},${masterPos.y + 25} L${sub2Pos.x},${sub2Pos.y - 25}`)
        .attr('stroke', 'var(--color-accent)')
        .attr('marker-end', 'url(#arrow)');

    // Subproblems to Master (proposals)
    svg.append('path')
        .attr('d', `M${sub1Pos.x},${sub1Pos.y - 25} L${masterPos.x},${masterPos.y + 25}`)
        .attr('stroke', 'var(--color-accent)')
        .attr('stroke-dasharray', '5,5')
        .attr('marker-end', 'url(#arrow)');
    svg.append('path')
        .attr('d', `M${sub2Pos.x},${sub2Pos.y - 25} L${masterPos.x},${masterPos.y + 25}`)
        .attr('stroke', 'var(--color-accent)')
        .attr('stroke-dasharray', '5,5')
        .attr('marker-end', 'url(#arrow)');
}

initDualDecomposition('dual-decomposition-container');
