/**
 * Widget: Ellipsoid Explorer
 *
 * Description: Interactively explore the geometry of an ellipsoid defined by
 *              the quadratic form (x - xc)ᵀ P (x - xc) ≤ 1.
 * Version: 2.0.0
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function initEllipsoidExplorer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // --- WIDGET LAYOUT ---
    container.innerHTML = `
        <div class="ellipsoid-explorer-widget">
            <div id="plot-container" style="width: 100%; height: 400px; cursor: grab;"></div>
            <div class="widget-controls" style="padding: 15px;">
                <p>Drag the center handle to move the ellipsoid. Drag axis handles to reshape it.</p>
                <div id="matrix-output" class="widget-output"></div>
            </div>
        </div>
    `;

    const plotContainer = container.querySelector("#plot-container");
    const matrixOutput = container.querySelector("#matrix-output");
    let svg, x, y;

    let center = { x: 0, y: 0 };
    let axes = [{ x: 2, y: 0 }, { x: 0, y: 1 }]; // Major and minor axes vectors

    function setupChart() {
        plotContainer.innerHTML = '';
        const margin = { top: 20, right: 20, bottom: 30, left: 40 };
        const width = plotContainer.clientWidth - margin.left - margin.right;
        const height = plotContainer.clientHeight - margin.top - margin.bottom;

        svg = d3.select(plotContainer).append("svg")
            .attr("width", "100%").attr("height", "100%")
            .attr("viewBox", `0 0 ${plotContainer.clientWidth} ${plotContainer.clientHeight}`)
            .append("g").attr("transform", `translate(${margin.left},${margin.top})`);

        x = d3.scaleLinear().domain([-5, 5]).range([0, width]);
        y = d3.scaleLinear().domain([-5, 5]).range([height, 0]);

        svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));
        svg.append("g").call(d3.axisLeft(y));

        svg.append("path").attr("class", "ellipsoid-path")
            .attr("fill", "var(--color-primary-light)").attr("stroke", "var(--color-primary)");

        svg.append("g").attr("class", "handles");
    }

    function update() {
        const line = d3.line().x(d => x(d.x)).y(d => y(d.y));
        const angle = Math.atan2(axes[0].y, axes[0].x);
        const len1 = Math.sqrt(axes[0].x**2 + axes[0].y**2);
        const len2 = Math.sqrt(axes[1].x**2 + axes[1].y**2);

        const ellipsePoints = d3.range(0, 2 * Math.PI + 0.1, 0.1).map(a => {
            const ex = len1 * Math.cos(a);
            const ey = len2 * Math.sin(a);
            const rx = ex * Math.cos(angle) - ey * Math.sin(angle);
            const ry = ex * Math.sin(angle) + ey * Math.cos(angle);
            return { x: center.x + rx, y: center.y + ry };
        });
        svg.select(".ellipsoid-path").datum(ellipsePoints).attr("d", line);

        // --- Draw Handles ---
        const handleData = [
            { ...center, type: 'center' },
            { x: center.x + axes[0].x, y: center.y + axes[0].y, type: 'axis', id: 0 },
            { x: center.x + axes[1].x, y: center.y + axes[1].y, type: 'axis', id: 1 },
        ];
        svg.select(".handles").selectAll("circle").data(handleData)
            .join("circle")
            .attr("cx", d => x(d.x)).attr("cy", d => y(d.y))
            .attr("r", d => d.type === 'center' ? 8 : 6)
            .attr("fill", d => d.type === 'center' ? 'var(--color-accent)' : 'white')
            .style("cursor", "pointer")
            .call(d3.drag().on("drag", (event, d) => {
                const [mx, my] = [x.invert(event.x), y.invert(event.y)];
                if (d.type === 'center') {
                    center.x = mx; center.y = my;
                } else {
                    axes[d.id] = { x: mx - center.x, y: my - center.y };
                }
                update();
            }));

        // --- Update Matrix Output ---
        const A = { x: axes[0].x / len1, y: axes[0].y / len1 }; // Normalized axis 1
        const a = 1 / len1**2, b = 1 / len2**2;
        const P = [
            [a*A.x*A.x + b*A.y*A.y, (a-b)*A.x*A.y],
            [(a-b)*A.x*A.y, a*A.y*A.y + b*A.x*A.x]
        ];
        matrixOutput.innerHTML = `
            <strong>Center x<sub>c</sub>:</strong> [${center.x.toFixed(2)}, ${center.y.toFixed(2)}]<br>
            <strong>Matrix P:</strong>
            [[${P[0][0].toFixed(2)}, ${P[0][1].toFixed(2)}],
             [${P[1][0].toFixed(2)}, ${P[1][1].toFixed(2)}]]
        `;
    }

    new ResizeObserver(setupChart).observe(plotContainer);
    setupChart();
    update();
}
