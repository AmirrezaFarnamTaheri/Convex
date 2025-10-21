/**
 * Widget: SVM Margin Explorer
 *
 * Description: Allows users to drag support vectors and see how the SVM margin and decision boundary change.
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function initSVMMargin(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="svm-margin-widget">
            <div id="plot-container"></div>
            <p class="widget-instructions">Drag the outlined points (support vectors) to see how the decision boundary and margin change.</p>
            <div class="widget-output" id="margin-output"></div>
        </div>
    `;

    const plotContainer = container.querySelector("#plot-container");
    const outputDiv = container.querySelector("#margin-output");

    const margin = {top: 20, right: 20, bottom: 40, left: 40};
    const width = plotContainer.clientWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(plotContainer).append("svg")
        .attr("width", "100%").attr("height", height + margin.top + margin.bottom)
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().domain([-5, 5]).range([0, width]);
    const y = d3.scaleLinear().domain([-5, 5]).range([height, 0]);
    svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));
    svg.append("g").call(d3.axisLeft(y));

    let points = [
        {x: -3, y: -2, class: -1}, {x: -2, y: 1, class: -1, is_sv: true},
        {x: 3, y: 2, class: 1}, {x: 2, y: -1, class: 1, is_sv: true}
    ];

    const drag = d3.drag().on("drag", function(event, d) {
        if (!d.is_sv) return;
        const [mx, my] = d3.pointer(event, svg.node());
        d.x = x.invert(mx);
        d.y = y.invert(my);
        update();
    });

    const boundary = svg.append("line").attr("stroke", "var(--color-text-main)").attr("stroke-width", 2.5);
    const margin_p = svg.append("line").attr("stroke", "var(--color-accent)").attr("stroke-width", 1.5).attr("stroke-dasharray", "4 4");
    const margin_n = svg.append("line").attr("stroke", "var(--color-primary)").attr("stroke-width", 1.5).attr("stroke-dasharray", "4 4");

    function update() {
        svg.selectAll(".datapoint").data(points).join("circle").attr("class", "datapoint")
            .attr("cx", d=>x(d.x)).attr("cy", d=>y(d.y)).attr("r", 5)
            .attr("fill", d=>d.class===-1 ? "var(--color-primary)" : "var(--color-accent)")
            .style("cursor", d=>d.is_sv ? "move" : "default")
            .call(drag);

        svg.selectAll(".sv-highlight").data(points.filter(p=>p.is_sv)).join("circle").attr("class", "sv-highlight")
            .attr("cx", d=>x(d.x)).attr("cy", d=>y(d.y)).attr("r", 10)
            .attr("fill", "none").attr("stroke", d=>d.class===-1 ? "var(--color-primary)" : "var(--color-accent)");

        const sv_p = points.find(p => p.is_sv && p.class === 1);
        const sv_n = points.find(p => p.is_sv && p.class === -1);

        // w is orthogonal to the vector connecting the support vectors
        const w = {x: sv_p.x - sv_n.x, y: sv_p.y - sv_n.y};
        const w_norm_sq = w.x*w.x + w.y*w.y;

        // b = - (w.p_p + w.p_n)/2
        const b = - (w.x * (sv_p.x + sv_n.x) + w.y * (sv_p.y + sv_n.y)) / 2;

        const margin_val = 2 / Math.sqrt(w_norm_sq);
        outputDiv.innerHTML = `Margin: <strong>${margin_val.toFixed(2)}</strong>`;

        const drawHyperplane = (line_el, offset) => {
            let p1, p2;
            if (Math.abs(w.y) > 1e-6) { // Not a vertical line
                p1 = {x: -5, y: (-b - offset - w.x*(-5)) / w.y};
                p2 = {x: 5, y: (-b - offset - w.x*5) / w.y};
            } else { // Vertical line
                p1 = {y: -5, x: (-b - offset) / w.x};
                p2 = {y: 5, x: (-b - offset) / w.x};
            }
            line_el.attr("x1", x(p1.x)).attr("y1", y(p1.y)).attr("x2", x(p2.x)).attr("y2", y(p2.y));
        };

        drawHyperplane(boundary, 0);
        drawHyperplane(margin_p, 1);
        drawHyperplane(margin_n, -1);
    }

    update();
}
