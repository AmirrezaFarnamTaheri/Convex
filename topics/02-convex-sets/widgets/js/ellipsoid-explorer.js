/**
 * Widget: Ellipsoid Explorer
 *
 * Description: Interactively explore the geometry of an ellipsoid defined by
 *              the quadratic form (x - xc)ᵀ P (x - xc) ≤ 1.
 * Version: 2.1.0
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
                    <span class="widget-label">Drag the center handle to move. Drag axis handles to shape.</span>
                </div>
            </div>
            <div id="matrix-output" class="widget-output"></div>
        </div>
    `;

    const plotContainer = container.querySelector("#plot-container");
    const matrixOutput = container.querySelector("#matrix-output");
    let svg, x, y;

    let center = { x: 0, y: 0 };
    let axes = [{ x: 2, y: 0 }, { x: 0, y: 1 }]; // Major and minor axes vectors

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

        x = d3.scaleLinear().domain([-5, 5]).range([0, width]);
        y = d3.scaleLinear().domain([-5, 5]).range([height, 0]);

        // Grid
        svg.append("g").attr("class", "grid-line").call(d3.axisBottom(x).ticks(10).tickSize(height).tickFormat(""));
        svg.append("g").attr("class", "grid-line").call(d3.axisLeft(y).ticks(10).tickSize(-width).tickFormat(""));

        svg.append("g").attr("class", "axis").attr("transform", `translate(0,${height/2})`).call(d3.axisBottom(x).ticks(5));
        svg.append("g").attr("class", "axis").attr("transform", `translate(${width/2},0)`).call(d3.axisLeft(y).ticks(5));

        svg.append("path").attr("class", "ellipsoid-path")
            .attr("fill", "rgba(124, 197, 255, 0.2)")
            .attr("stroke", "var(--color-primary)")
            .attr("stroke-width", 2);

        // Axis lines
        svg.append("line").attr("class", "axis-line-0").attr("stroke", "var(--color-text-muted)").attr("stroke-dasharray", "4 4");
        svg.append("line").attr("class", "axis-line-1").attr("stroke", "var(--color-text-muted)").attr("stroke-dasharray", "4 4");

        svg.append("g").attr("class", "handles");
    }

    function update() {
        const angle = Math.atan2(axes[0].y, axes[0].x);
        const len1 = Math.sqrt(axes[0].x**2 + axes[0].y**2);
        const len2 = Math.sqrt(axes[1].x**2 + axes[1].y**2);

        // Enforce orthogonality of second axis relative to first?
        // Actually, for an ellipsoid defined by eigenvectors, axes are orthogonal.
        // Let's force orthogonality for typical P matrix representation.
        // Axis 1 is free. Axis 2 is constrained to be perpendicular.
        // But user might want to shear? If P is symmetric PD, principal axes are orthogonal.
        // Let's enforce orthogonality based on Axis 0.
        const orthAngle = angle + Math.PI / 2;
        // Project current axis 1 onto perpendicular direction
        const currentLen2 = Math.sqrt(axes[1].x**2 + axes[1].y**2);
        // Reconstruct orthogonal axis 1
        axes[1].x = -Math.sin(angle) * currentLen2; // Or dot product logic
        axes[1].y = Math.cos(angle) * currentLen2;

        const line = d3.line().x(d => x(d.x)).y(d => y(d.y));
        const ellipsePoints = d3.range(0, 2 * Math.PI + 0.1, 0.1).map(a => {
            // Parametric equation using rotated axes
            const ex = len1 * Math.cos(a);
            const ey = currentLen2 * Math.sin(a); // Use currentLen2
            const rx = ex * Math.cos(angle) - ey * Math.sin(angle);
            const ry = ex * Math.sin(angle) + ey * Math.cos(angle);
            return { x: center.x + rx, y: center.y + ry };
        });
        svg.select(".ellipsoid-path").datum(ellipsePoints).attr("d", line);

        // Update Axis Lines
        svg.select(".axis-line-0")
            .attr("x1", x(center.x)).attr("y1", y(center.y))
            .attr("x2", x(center.x + axes[0].x)).attr("y2", y(center.y + axes[0].y));
        svg.select(".axis-line-1")
            .attr("x1", x(center.x)).attr("y1", y(center.y))
            .attr("x2", x(center.x + axes[1].x)).attr("y2", y(center.y + axes[1].y));

        // --- Draw Handles ---
        const handleData = [
            { ...center, type: 'center' },
            { x: center.x + axes[0].x, y: center.y + axes[0].y, type: 'axis', id: 0 },
            { x: center.x + axes[1].x, y: center.y + axes[1].y, type: 'axis', id: 1 },
        ];

        const dragBehavior = d3.drag().on("drag", (event, d) => {
            const [mx, my] = [x.invert(event.x), y.invert(event.y)];
            if (d.type === 'center') {
                center.x = mx; center.y = my;
            } else {
                const dx = mx - center.x;
                const dy = my - center.y;
                if (d.id === 0) {
                    axes[0] = { x: dx, y: dy };
                    // Axis 1 will be updated in next render loop to be ortho
                } else {
                    // Only change length of axis 1, keep direction
                    // Project (dx, dy) onto the known perpendicular direction
                    const perpX = -Math.sin(angle);
                    const perpY = Math.cos(angle);
                    const len = dx * perpX + dy * perpY;
                    // Update axis 1 vector length (direction fixed by axis 0)
                    // This logic is getting complex inside drag.
                    // Simpler: just update vector, update() cleans it up?
                     axes[1] = { x: dx, y: dy };
                }
            }
            update();
        });

        const handles = svg.select(".handles").selectAll("circle").data(handleData);

        handles.enter().append("circle")
            .merge(handles)
            .attr("cx", d => x(d.x)).attr("cy", d => y(d.y))
            .attr("r", d => d.type === 'center' ? 8 : 6)
            .attr("fill", d => d.type === 'center' ? 'var(--color-accent)' : 'white')
            .attr("stroke", "var(--color-text-main)")
            .style("cursor", "pointer")
            .call(dragBehavior);

        // --- Update Matrix Output ---
        // P = R * D^-2 * R' where D is diag(len1, len2)
        // Eigenvalues of P are 1/len1^2, 1/len2^2
        // Eigenvectors are axes directions

        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const lam1 = 1 / (len1 * len1);
        const lam2 = 1 / (currentLen2 * currentLen2);

        // P = [cos -sin; sin cos] [lam1 0; 0 lam2] [cos sin; -sin cos]
        //   = [cos*lam1 -sin*lam2; sin*lam1 cos*lam2] [cos sin; -sin cos]
        //   = [c*l1*c + s*l2*s   c*l1*s - s*l2*c]
        //     [s*l1*c - c*l2*s   s*l1*s + c*l2*c]

        const p00 = lam1 * cos * cos + lam2 * sin * sin;
        const p01 = (lam1 - lam2) * cos * sin;
        const p11 = lam1 * sin * sin + lam2 * cos * cos;

        matrixOutput.innerHTML = `
            <div style="display: flex; justify-content: space-between; gap: 20px;">
                <div>
                    <p><strong>Center x<sub>c</sub>:</strong> [${center.x.toFixed(2)}, ${center.y.toFixed(2)}]</p>
                    <p><strong>Axes Lengths:</strong> ${len1.toFixed(2)}, ${currentLen2.toFixed(2)}</p>
                </div>
                <div>
                    <p><strong>Shape Matrix P (Positive Definite):</strong></p>
                    <div style="font-family: var(--widget-font-mono); background: rgba(0,0,0,0.2); padding: 8px; border-radius: 4px;">
                        [[${p00.toFixed(2)}, ${p01.toFixed(2)}],<br>
                         [${p01.toFixed(2)}, ${p11.toFixed(2)}]]
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
