/**
 * Widget: Ellipsoid Explorer
 *
 * Description: Interactively explore the geometry of an ellipsoid defined by
 *              (x - xc)ᵀ P (x - xc) ≤ 1. Visualizes the relationship between
 *              matrix P, eigenvalues, and geometric axes.
 * Version: 3.0.0
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function initEllipsoidExplorer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // --- WIDGET LAYOUT ---
    container.innerHTML = `
        <div class="widget-container">
             <div class="widget-canvas-container" id="plot-container" style="height: 400px;"></div>
            <div class="widget-controls">
                <div class="widget-control-group">
                    <span class="widget-label">
                        <span style="color: var(--color-accent);">● Center</span>
                        <span style="color: white; margin-left: 12px;">○ Axes</span> (Drag to reshape)
                    </span>
                </div>
            </div>
            <div id="matrix-output" class="widget-output" style="min-height: 100px;"></div>
        </div>
    `;

    const plotContainer = container.querySelector("#plot-container");
    const matrixOutput = container.querySelector("#matrix-output");
    let svg, x, y;

    let center = { x: 0, y: 0 };
    // Define ellipsoid by rotation angle and semi-axis lengths
    let params = { angle: -0.5, a: 3, b: 1.5 }; // a=major, b=minor

    function setupChart() {
        plotContainer.innerHTML = '';
        const margin = { top: 20, right: 20, bottom: 20, left: 20 };
        const width = plotContainer.clientWidth - margin.left - margin.right;
        const height = plotContainer.clientHeight - margin.top - margin.bottom;

        svg = d3.select(plotContainer).append("svg")
            .attr("class", "widget-svg")
            .attr("width", "100%").attr("height", "100%")
            .attr("viewBox", `0 0 ${plotContainer.clientWidth} ${plotContainer.clientHeight}`)
            .append("g").attr("transform", `translate(${margin.left},${margin.top})`);

        x = d3.scaleLinear().domain([-6, 6]).range([0, width]);
        y = d3.scaleLinear().domain([-6, 6]).range([height, 0]);

        // Grid
        svg.append("g").attr("class", "grid-line").call(d3.axisBottom(x).ticks(10).tickSize(-height).tickFormat(""));
        svg.append("g").attr("class", "grid-line").call(d3.axisLeft(y).ticks(10).tickSize(-width).tickFormat(""));

        svg.append("g").attr("class", "axis").attr("transform", `translate(0,${height/2})`).call(d3.axisBottom(x).ticks(0));
        svg.append("g").attr("class", "axis").attr("transform", `translate(${width/2},0)`).call(d3.axisLeft(y).ticks(0));

        svg.append("path").attr("class", "ellipsoid-path")
            .attr("fill", "rgba(124, 197, 255, 0.2)")
            .attr("stroke", "var(--color-primary)")
            .attr("stroke-width", 2);

        // Axis lines
        const axisGroup = svg.append("g").attr("class", "axis-lines");
        axisGroup.append("line").attr("class", "major-axis").attr("stroke", "var(--color-text-muted)").attr("stroke-dasharray", "4 4");
        axisGroup.append("line").attr("class", "minor-axis").attr("stroke", "var(--color-text-muted)").attr("stroke-dasharray", "4 4");

        svg.append("g").attr("class", "handles");
    }

    function update() {
        // Reconstruct vectors
        const cos = Math.cos(params.angle);
        const sin = Math.sin(params.angle);

        // Major axis vector
        const v1 = { x: params.a * cos, y: params.a * sin };
        // Minor axis vector (orthogonal)
        const v2 = { x: params.b * (-sin), y: params.b * cos };

        // Draw Ellipse
        const line = d3.line().x(d => x(d.x)).y(d => y(d.y)).curve(d3.curveLinearClosed);
        const ellipsePoints = d3.range(0, 2 * Math.PI + 0.1, 0.1).map(theta => {
            // x(t) = xc + a cos(t) cos(phi) - b sin(t) sin(phi)
            // y(t) = yc + a cos(t) sin(phi) + b sin(t) cos(phi)
            const ct = Math.cos(theta);
            const st = Math.sin(theta);
            const px = center.x + params.a * ct * cos - params.b * st * sin;
            const py = center.y + params.a * ct * sin + params.b * st * cos;
            return { x: px, y: py };
        });
        svg.select(".ellipsoid-path").datum(ellipsePoints).attr("d", line);

        // Draw Axis Lines
        svg.select(".major-axis")
            .attr("x1", x(center.x)).attr("y1", y(center.y))
            .attr("x2", x(center.x + v1.x)).attr("y2", y(center.y + v1.y));
        svg.select(".minor-axis")
            .attr("x1", x(center.x)).attr("y1", y(center.y))
            .attr("x2", x(center.x + v2.x)).attr("y2", y(center.y + v2.y));

        // Update Handles
        const handleData = [
            { x: center.x, y: center.y, type: 'center' },
            { x: center.x + v1.x, y: center.y + v1.y, type: 'major' },
            { x: center.x + v2.x, y: center.y + v2.y, type: 'minor' }
        ];

        const drag = d3.drag()
            .on("drag", (event, d) => {
                const [mx, my] = d3.pointer(event, svg.node());
                const ex = x.invert(mx);
                const ey = y.invert(my);

                if (d.type === 'center') {
                    center.x = ex; center.y = ey;
                } else if (d.type === 'major') {
                    const dx = ex - center.x;
                    const dy = ey - center.y;
                    params.a = Math.sqrt(dx*dx + dy*dy);
                    params.angle = Math.atan2(dy, dx);
                } else if (d.type === 'minor') {
                    // Project mouse onto minor axis direction
                    const dx = ex - center.x;
                    const dy = ey - center.y;
                    // Minor axis is at angle + pi/2
                    const minAngle = params.angle + Math.PI/2;
                    // Project (dx,dy) onto unit vector at minAngle
                    const u = { x: Math.cos(minAngle), y: Math.sin(minAngle) };
                    const len = dx * u.x + dy * u.y;
                    params.b = Math.abs(len);
                }
                update();
            });

        const handles = svg.select(".handles").selectAll("circle").data(handleData);
        const handlesEnter = handles.enter().append("circle")
            .attr("r", 8)
            .attr("stroke", "var(--color-surface-1)")
            .attr("stroke-width", 2)
            .style("cursor", "pointer");

        handles.merge(handlesEnter)
            .attr("cx", d => x(d.x)).attr("cy", d => y(d.y))
            .attr("fill", d => d.type === 'center' ? 'var(--color-accent)' : 'white')
            .call(drag);

        // --- Matrix Calculation ---
        // P = V Lambda^-1 V^T
        // Lambda = diag(a^2, b^2)
        // Eigenvalues of P are 1/a^2 and 1/b^2

        const lam1 = 1 / (params.a * params.a);
        const lam2 = 1 / (params.b * params.b);

        // P = [c -s][l1 0][c s]
        //     [s  c][0 l2][-s c]
        const p00 = lam1*cos*cos + lam2*sin*sin;
        const p01 = (lam1 - lam2)*cos*sin;
        const p11 = lam1*sin*sin + lam2*cos*cos;

        matrixOutput.innerHTML = `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                <div>
                    <div style="font-size: 0.8rem; color: var(--color-text-muted); text-transform: uppercase;">Geometry</div>
                    <div>Center: <span style="font-family: monospace;">[${center.x.toFixed(1)}, ${center.y.toFixed(1)}]</span></div>
                    <div>Semi-axes: <span style="font-family: monospace;">${params.a.toFixed(2)}, ${params.b.toFixed(2)}</span></div>
                </div>
                <div>
                    <div style="font-size: 0.8rem; color: var(--color-text-muted); text-transform: uppercase;">Matrix P (Positive Definite)</div>
                    <div style="font-family: var(--font-mono); font-size: 0.9rem; background: rgba(0,0,0,0.3); padding: 8px; border-radius: 4px;">
                        [[${p00.toFixed(3)}, ${p01.toFixed(3)}],<br>
                         [${p01.toFixed(3)}, ${p11.toFixed(3)}]]
                    </div>
                </div>
            </div>
        `;
    }

    new ResizeObserver(() => {
        setupChart();
        update();
    }).observe(plotContainer);

    setupChart();
    update();
}
