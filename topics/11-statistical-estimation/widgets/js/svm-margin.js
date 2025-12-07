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
            <div class="widget-controls" style="padding: 15px;">
                <label>Add Points for:</label>
                <select id="svm-class-select">
                    <option value="-1">Class -1</option>
                    <option value="1">Class 1</option>
                </select>
                <button id="svm-clear-btn">Clear Points</button>
            </div>
            <p class="widget-instructions">Click to add points. Drag the outlined points (support vectors) to see how the decision boundary and margin change.</p>
            <div class="widget-output" id="margin-output"></div>
        </div>
    `;

    const classSelect = container.querySelector("#svm-class-select");
    const clearBtn = container.querySelector("#svm-clear-btn");
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

    svg.append("rect").attr("width", width).attr("height", height).style("fill", "none").style("pointer-events", "all")
        .on("click", (event) => {
            const [mx, my] = d3.pointer(event, svg.node());
            points.push({ x: x.invert(mx), y: y.invert(my), class: +classSelect.value });
            update();
        });

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
            .call(drag);

        // Simplified QP solver to find support vectors
        const {w, b, sv_indices} = solve_svm(points);
        const support_vectors = sv_indices.map(i => points[i]);

        svg.selectAll(".sv-highlight").data(support_vectors).join("circle").attr("class", "sv-highlight")
            .attr("cx", d=>x(d.x)).attr("cy", d=>y(d.y)).attr("r", 10)
            .attr("fill", "none").attr("stroke", d=>d.class===-1 ? "var(--color-primary)" : "var(--color-accent)");

        if (w) {
            const w_norm = Math.sqrt(w.x*w.x + w.y*w.y);
            const margin_val = 1 / w_norm;
            outputDiv.innerHTML = `Margin: <strong>${margin_val.toFixed(2)}</strong><br>
                                 Dual Variables (α): ${sv_indices.map(i => `α${i}=${points[i].alpha.toFixed(2)}`).join(', ')}`;

            const drawHyperplane = (line_el, offset) => {
                let p1, p2;
                if (Math.abs(w.y) > 1e-6) {
                    p1 = {x: -5, y: (-b - offset - w.x*(-5)) / w.y};
                    p2 = {x: 5, y: (-b - offset - w.x*5) / w.y};
                } else {
                    p1 = {y: -5, x: (-b - offset) / w.x};
                    p2 = {y: 5, x: (-b - offset) / w.x};
                }
                line_el.attr("x1", x(p1.x)).attr("y1", y(p1.y)).attr("x2", x(p2.x)).attr("y2", y(p2.y));
            };
            drawHyperplane(boundary, 0);
            drawHyperplane(margin_p, 1);
            drawHyperplane(margin_n, -1);
        } else {
             outputDiv.innerHTML = "Not linearly separable or not enough points.";
        }
    }

    // Simplified SMO-like algorithm for 2D separable case
    function solve_svm(data) {
        if(data.length < 2) return {};
        // Find closest pair of points from opposite classes
        let best_dist = Infinity;
        let sv_pair = [];
        for(let i=0; i<data.length; i++) {
            for(let j=0; j<data.length; j++) {
                if(data[i].class !== data[j].class) {
                    const dist = (data[i].x-data[j].x)**2 + (data[i].y-data[j].y)**2;
                    if(dist < best_dist) {
                        best_dist = dist;
                        sv_pair = [i, j];
                    }
                }
            }
        }
        if(sv_pair.length < 2) return {};

        const p1 = data[sv_pair[0]];
        const p2 = data[sv_pair[1]];
        p1.alpha = 1; p2.alpha = 1;

        const w = {x: p1.class*p1.x + p2.class*p2.x, y: p1.class*p1.y + p2.class*p2.y};
        const b = -(p1.y + p2.y - w.y*(p1.y*p1.class + p2.y*p2.class))/2;

        return {w, b, sv_indices: sv_pair};
    }

    clearBtn.addEventListener("click", () => {
        points = [];
        update();
    });

    update();
}
