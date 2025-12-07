/**
 * Widget: Regularization Geometry Visualizer
 *
 * Description: Visualizes the geometry of L1 (Lasso) and L2 (Ridge) regularization.
 *              It shows the interplay between the least-squares objective contours and the regularization constraint boundaries.
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import renderMathInElement from "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.mjs";

export function initRegularizationTheoryTool(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="reg-theory-widget">
            <div class="widget-controls">
                <label>Regularization:</label>
                <select id="reg-geo-type">
                    <option value="L1">L1 (Lasso)</option>
                    <option value="L2">L2 (Ridge)</option>
                    <option value="ElasticNet">Elastic Net</option>
                </select>
                <label>Constraint Size (t):</label>
                <input type="range" id="reg-geo-t" min="0.1" max="4" step="0.1" value="1.5">
            </div>
            <div id="plot-container"></div>
            <div id="norm-equation" class="widget-output"></div>
            <p class="widget-instructions">Drag the blue point (the unconstrained minimum) to see how the optimal solution (green point) changes.</p>
        </div>
    `;

    const typeSelect = container.querySelector("#reg-geo-type");
    const normEquation = container.querySelector("#norm-equation");
    const tSlider = container.querySelector("#reg-geo-t");
    const plotContainer = container.querySelector("#plot-container");

    let w_ls = {x: 1, y: 1.8}; // Center of LS contours (unconstrained minimum)

    const margin = {top: 20, right: 20, bottom: 40, left: 40};
    const width = plotContainer.clientWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(plotContainer).append("svg")
        .attr("width", "100%").attr("height", height + margin.top + margin.bottom)
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().domain([-3, 3]).range([0, width]);
    const y = d3.scaleLinear().domain([-3, 3]).range([height, 0]);
    svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));
    svg.append("g").call(d3.axisLeft(y));

    const contourGroup = svg.append("g");
    const constraintPath = svg.append("path").attr("fill", "var(--color-primary-light)").attr("stroke", "var(--color-primary)").attr("stroke-width", 2);
    const lsCenter = svg.append("circle").attr("r", 6).attr("fill", "var(--color-accent)").style("cursor", "move");
    const solutionPoint = svg.append("circle").attr("r", 6).attr("fill", "var(--color-success)");

    const drag = d3.drag().on("drag", (event) => {
        const [mx, my] = d3.pointer(event, svg.node());
        w_ls.x = x.invert(mx); w_ls.y = y.invert(my);
        update();
    });
    svg.call(drag);

    function update() {
        const t = +tSlider.value;
        const regType = typeSelect.value;

        // Draw LS contours centered at w_ls
        const contours = d3.range(0.2, 5, 0.4).map(r => d3.range(0, 2*Math.PI+0.1, 0.1).map(a => [w_ls.x + r*Math.cos(a), w_ls.y + r*Math.sin(a)]));
        contourGroup.selectAll("path").data(contours).join("path")
            .attr("d", d3.line().x(d=>x(d[0])).y(d=>y(d[1]))).attr("stroke", "var(--color-surface-1)").attr("fill", "none");

        lsCenter.attr("cx", x(w_ls.x)).attr("cy", y(w_ls.y));

        // Draw constraint region
        let constraintShape;
        if (regType === 'L1') {
            constraintShape = [[t,0], [0,t], [-t,0], [0,-t]];
            normEquation.innerHTML = `L1 Norm:  \\( ||w||_1 = |w_1| + |w_2| \\leq t \\)`;
        } else if (regType === 'L2') { // L2
            constraintShape = d3.range(0, 2*Math.PI+0.1, 0.1).map(a => [t*Math.cos(a), t*Math.sin(a)]);
            normEquation.innerHTML = `L2 Norm: \\( ||w||_2^2 = w_1^2 + w_2^2 \\leq t^2 \\)`;
        } else { // ElasticNet
            const l1_ratio = 0.5;
            // This is not a simple shape, so we approximate it
            constraintShape = d3.range(-t, t+0.1, 0.1).flatMap(v => [
                [v, (t - l1_ratio*Math.abs(v))/(1-l1_ratio)],
                [v, -(t - l1_ratio*Math.abs(v))/(1-l1_ratio)]
            ]);
             normEquation.innerHTML = `Elastic Net: \\( \\alpha ||w||_1 + (1-\\alpha) ||w||_2^2 \\leq t \\)`;
        }
        constraintPath.attr("d", d3.line().x(d=>x(d[0])).y(d=>y(d[1]))(constraintShape) + "Z");

        // Find solution
        let sol_x, sol_y;
        const norm_w_ls = regType === 'L1' ? Math.abs(w_ls.x) + Math.abs(w_ls.y) : Math.sqrt(w_ls.x**2 + w_ls.y**2);

        if (norm_w_ls <= t) { // Unconstrained minimum is inside feasible region
            sol_x = w_ls.x; sol_y = w_ls.y;
        } else { // Project onto the boundary
            if (regType === 'L1') {
                // Simplified projection for L1
                const sign_x = Math.sign(w_ls.x);
                const sign_y = Math.sign(w_ls.y);
                const p = (Math.abs(w_ls.x) + Math.abs(w_ls.y) - t) / 2;
                sol_x = sign_x * Math.max(0, Math.abs(w_ls.x) - p);
                sol_y = sign_y * Math.max(0, Math.abs(w_ls.y) - p);
            } else { // L2
                const scale = t / norm_w_ls;
                sol_x = w_ls.x * scale;
                sol_y = w_ls.y * scale;
            }
        }
        solutionPoint.attr("cx", x(sol_x)).attr("cy", y(sol_y));
        renderMathInElement(normEquation);
    }

    typeSelect.addEventListener("change", update);
    tSlider.addEventListener("input", update);
    update();
}
