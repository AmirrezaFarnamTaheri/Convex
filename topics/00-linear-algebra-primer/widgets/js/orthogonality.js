/**
 * Widget: Orthogonality Explorer
 *
 * Description: Allows users to drag two vectors and see their dot product, angle, and orthogonal projection update in real-time.
 * Version: 2.1.0 (Refined)
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function initOrthogonality(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container #${containerId} not found.`);
        return;
    }

    container.innerHTML = `
        <div class="orthogonality-widget">
            <div class="plot-area" id="plot-container"></div>
            <div class="output-area" id="output-container"></div>
        </div>
    `;

    const plotContainer = container.querySelector("#plot-container");
    const outputContainer = container.querySelector("#output-container");

    let width, height;
    let x, y;
    let svg;

    let vecA = {x: 5, y: 5, id: 'a'};
    let vecB = {x: -5, y: 5, id: 'b'};

    function setupChart() {
        plotContainer.innerHTML = '';
        const margin = {top: 20, right: 20, bottom: 20, left: 20};

        width = plotContainer.clientWidth - margin.left - margin.right;
        height = plotContainer.clientHeight - margin.top - margin.bottom;

        svg = d3.select(plotContainer).append("svg")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("viewBox", `0 0 ${plotContainer.clientWidth} ${plotContainer.clientHeight}`)
            .append("g")
            .attr("transform", `translate(${margin.left + width / 2}, ${margin.top + height / 2})`);

        const domain = 10;
        x = d3.scaleLinear().domain([-domain, domain]).range([-width/2, width/2]);
        y = d3.scaleLinear().domain([-domain, domain]).range([height/2, -height/2]);

        const grid = svg.append("g").attr("class", "grid");
        grid.selectAll("line.x-grid").data(x.ticks(10)).enter().append("line").attr("class", "x-grid").attr("x1", d => x(d)).attr("x2", d => x(d)).attr("y1", -height/2).attr("y2", height/2);
        grid.selectAll("line.y-grid").data(y.ticks(10)).enter().append("line").attr("class", "y-grid").attr("x1", -width/2).attr("x2", width/2).attr("y1", d => y(d)).attr("y2", d => y(d));

        svg.append("g").attr("class", "axis x-axis").attr("transform", `translate(0, ${y(0)})`).call(d3.axisBottom(x).ticks(5));
        svg.append("g").attr("class", "axis y-axis").attr("transform", `translate(${x(0)}, 0)`).call(d3.axisLeft(y).ticks(5));

        const defs = svg.append("defs");
        const markers = [
            { id: "arrow-a", color: "var(--color-primary)" },
            { id: "arrow-b", color: "var(--color-accent)" },
            { id: "arrow-proj", color: "var(--color-accent-secondary)" }
        ];
        markers.forEach(m => {
            defs.append("marker")
                .attr("id", m.id)
                .attr("viewBox", "0 -5 10 10")
                .attr("refX", 5).attr("refY", 0)
                .attr("markerWidth", 6).attr("markerHeight", 6)
                .attr("orient", "auto")
                .append("path").attr("d", "M0,-5L10,0L0,5").attr("fill", m.color);
        });

        svg.append("g").attr("class", "projection-elements");
        svg.append("g").attr("class", "vector-elements");
    }

    const drag = d3.drag()
        .on("start", (event) => d3.select(event.sourceEvent.target).raise().classed("active", true))
        .on("drag", function(event, d) {
            const [mx, my] = d3.pointer(event, svg.node());
            d.x = x.invert(mx);
            d.y = y.invert(my);
            update();
        })
        .on("end", (event) => d3.select(event.sourceEvent.target).classed("active", false));

    function update() {
        const dotProduct = vecA.x * vecB.x + vecA.y * vecB.y;
        const magA = Math.sqrt(vecA.x**2 + vecA.y**2);
        const magB = Math.sqrt(vecB.x**2 + vecB.y**2);

        let angle = NaN;
        if (magA > 1e-9 && magB > 1e-9) {
            const cosTheta = Math.max(-1, Math.min(1, dotProduct / (magA * magB)));
            angle = Math.acos(cosTheta) * (180 / Math.PI);
        }

        let projVec = { x: 0, y: 0 };
        if (magB > 1e-9) {
            const projScalar = dotProduct / (magB**2);
            projVec = { x: projScalar * vecB.x, y: projScalar * vecB.y };
        }

        const residualVec = { x: vecA.x - projVec.x, y: vecA.y - projVec.y };

        outputContainer.innerHTML = `
            <div><strong>Vector A:</strong> <code>[${vecA.x.toFixed(2)}, ${vecA.y.toFixed(2)}]</code>, <strong>||A||:</strong> <code>${magA.toFixed(2)}</code></div>
            <div><strong>Vector B:</strong> <code>[${vecB.x.toFixed(2)}, ${vecB.y.toFixed(2)}]</code>, <strong>||B||:</strong> <code>${magB.toFixed(2)}</code></div>
            <div><strong>Dot Product (A ⋅ B):</strong> <code>${dotProduct.toFixed(2)}</code></div>
            <div><strong>Angle (θ):</strong> <code>${isNaN(angle) ? "N/A" : angle.toFixed(1) + "°"}</code></div>
        `;

        drawVector(vecA, "a", "A");
        drawVector(vecB, "b", "B");
        drawProjection(projVec, vecA, residualVec);

        const isOrthogonal = !isNaN(angle) && Math.abs(angle - 90) < 2.0;
        if(isOrthogonal) {
          drawOrthogonalIndicator(projVec, residualVec);
        }
    }

    function drawVector(vec, id, label) {
        const vectorElements = svg.select(".vector-elements");
        vectorElements.selectAll(`.vector-group-${id}`).remove();

        const group = vectorElements.append("g").attr("class", `vector-group-${id}`);

        group.append("line")
            .attr("class", `vector vector-${id}`)
            .attr("x1", x(0)).attr("y1", y(0))
            .attr("x2", x(vec.x)).attr("y2", y(vec.y))
            .attr("marker-end", `url(#arrow-${id})`);

        group.append("text")
            .attr("class", "vector-label")
            .attr("x", x(vec.x) + (vec.x > 0 ? 10 : -20))
            .attr("y", y(vec.y))
            .text(label);

        group.append("circle")
            .data([vec])
            .attr("class", `handle handle-${id}`)
            .attr("cx", x(vec.x)).attr("cy", y(vec.y))
            .attr("r", 10)
            .call(drag);
    }

    function drawProjection(proj, fromVec, residualVec) {
        const projElements = svg.select(".projection-elements");
        projElements.selectAll("*").remove();

        // Projection vector
        projElements.append("line")
            .attr("class", "projection-vector")
            .attr("x1", x(0)).attr("y1", y(0))
            .attr("x2", x(proj.x)).attr("y2", y(proj.y))
            .attr("marker-end", "url(#arrow-proj)");

        // Residual vector
        projElements.append("line")
            .attr("class", "residual-vector")
            .attr("x1", x(proj.x)).attr("y1", y(proj.y))
            .attr("x2", x(fromVec.x)).attr("y2", y(fromVec.y));

        projElements.append("text")
            .attr("class", "projection-label")
            .attr("x", x(proj.x * 0.5) + 5)
            .attr("y", y(proj.y * 0.5) + 5)
            .text("proj_B(A)");
    }

    function drawOrthogonalIndicator(projVec, residualVec) {
        const size = 15;
        const corner = { x: x(projVec.x), y: y(projVec.y) };
        const p1 = { x: x(projVec.x + residualVec.x / 10), y: y(projVec.y + residualVec.y/10)};
        const p2 = { x: x(projVec.x + (vecB.x)/10), y: y(projVec.y + (vecB.y)/10)};

        const path = d3.path();
        path.moveTo(p1.x, p1.y);
        path.lineTo(corner.x, corner.y);
        path.lineTo(p2.x, p2.y);

        svg.select(".projection-elements").append('path')
            .attr('class', 'orthogonal-indicator')
            .attr('d', path);
    }

    const resizeObserver = new ResizeObserver(entries => {
        if (entries[0].target === plotContainer) {
            setupChart();
            update();
        }
    });

    resizeObserver.observe(plotContainer);
    setupChart();
    update();
}

const style = document.createElement('style');
style.textContent = `
.orthogonality-widget { display: flex; flex-direction: column; height: 100%; background: var(--color-background); border-radius: var(--border-radius-lg); overflow: hidden; }
.plot-area { flex-grow: 1; position: relative; }
.output-area { padding: 1rem 1.5rem; border-top: 1px solid var(--color-border); background: var(--color-surface-1); font-size: 0.9rem; }
.output-area div { margin-bottom: 0.5rem; }
.output-area code { background-color: var(--color-background); padding: 0.2em 0.4em; border-radius: 4px; }
/* D3 styles */
.axis path, .axis line { stroke: var(--color-border); }
.axis text { fill: var(--color-text-muted); }
.grid line { stroke: var(--color-surface-2); stroke-opacity: 0.7; }
.vector-a { stroke: var(--color-primary); stroke-width: 3; }
.handle-a { fill: var(--color-primary); }
.vector-b { stroke: var(--color-accent); stroke-width: 3; }
.handle-b { fill: var(--color-accent); }
.handle { cursor: grab; }
.handle:active { cursor: grabbing; }
.vector-label { font-size: 14px; font-weight: bold; fill: var(--color-text-main); }
.projection-vector { stroke: var(--color-accent-secondary); stroke-width: 2.5; }
.residual-vector { stroke: var(--color-text-muted); stroke-width: 1.5; stroke-dasharray: 3 3; }
.projection-label { fill: var(--color-accent-secondary); font-size: 12px; }
.orthogonal-indicator { fill: none; stroke: var(--color-text-muted); stroke-width: 2; }
`;
document.head.appendChild(style);
