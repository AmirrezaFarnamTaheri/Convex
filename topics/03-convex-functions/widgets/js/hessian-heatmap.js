/**
 * Widget: Hessian Minimum Eigenvalue Heatmap with Interactive Probe
 *
 * Description: Visualizes the minimum eigenvalue of the Hessian as a heatmap.
 *              Includes an interactive probe that shows the local quadratic approximation.
 * Version: 3.0.0
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function initHessianHeatmap(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // --- WIDGET LAYOUT ---
    container.innerHTML = `
        <div class="widget-container">
            <div class="widget-controls">
                <div class="widget-control-group" style="flex: 1;">
                    <label class="widget-label">Function</label>
                    <select id="heatmap-function-select" class="widget-select"></select>
                </div>
            </div>

            <div style="display: flex; flex-direction: row; border-bottom: 1px solid var(--color-border);">
                 <div style="flex: 2; min-width: 300px; position: relative;">
                    <div class="widget-canvas-container" id="heatmap-container" style="height: 350px; cursor: crosshair;"></div>
                    <div style="position: absolute; top: 10px; left: 10px; pointer-events: none; background: rgba(0,0,0,0.6); padding: 4px 8px; border-radius: 4px; color: var(--color-text-muted); font-size: 0.8rem;">
                        Heatmap: Min Eigenvalue of Hessian (Curvature)
                    </div>
                 </div>

                 <div style="flex: 1; min-width: 200px; border-left: 1px solid var(--color-border); background: var(--surface-1); padding: 16px; display: flex; flex-direction: column;">
                    <label class="widget-label" style="margin-bottom: 8px;">Local Approximation</label>
                    <div style="flex: 1; border: 1px solid var(--color-border); background: var(--color-background); position: relative;">
                         <canvas id="probe-canvas" style="width: 100%; height: 100%; display: block;"></canvas>
                    </div>
                    <div id="probe-info" style="margin-top: 12px; font-size: 0.85rem; color: var(--color-text-muted);">
                        Hover over the heatmap to inspect local curvature.
                    </div>
                 </div>
            </div>

            <div id="legend" class="widget-output" style="padding: 12px;"></div>
        </div>
    `;

    const select = container.querySelector("#heatmap-function-select");
    const heatmapContainer = container.querySelector("#heatmap-container");
    const legendContainer = container.querySelector("#legend");
    const probeCanvas = container.querySelector("#probe-canvas");
    const probeInfo = container.querySelector("#probe-info");

    const functions = {
        "x² + y² (Convex Bowl)": {
            func: (x, y) => x**2 + y**2,
            hessian: (x, y) => [[2, 0], [0, 2]],
            range: [-2.5, 2.5]
        },
        "x⁴ + y⁴ (Flat Bottom)": {
            func: (x, y) => x**4 + y**4,
            hessian: (x, y) => [[12*x**2, 0], [0, 12*y**2]],
            range: [-2, 2]
        },
        "Saddle x² - y² (Indefinite)": {
            func: (x, y) => x**2 - y**2,
            hessian: (x, y) => [[2, 0], [0, -2]],
            range: [-2.5, 2.5]
        },
        "Gaussian Bump (Non-Convex)": {
            func: (x, y) => -2 * Math.exp(-(x**2 + y**2)),
            hessian: (x, y) => {
                const e = Math.exp(-(x**2 + y**2));
                // f = -2e^-r2
                // fx = 4x e^-r2
                // fxx = 4 e^-r2 + 4x(-2x) e^-r2 = e^-r2 (4 - 8x^2) * -2?? Wait.
                // Let's use simple numerical diff or correct formula.
                // f = -e^-(x^2+y^2) -> fxx = e^-r^2 (2 - 4x^2) roughly.
                // Let's just implement the formula: f(x) = -exp(-(x^2+y^2))
                // fx = 2x exp(...)
                // fxx = 2 exp(...) + 2x(-2x)exp(...) = (2 - 4x^2)exp(...)
                const val = -2 * e;
                // D2 (-2 exp(-u)) where u = x^2+y^2
                // d/dx = -2 exp(-u) * (-2x) = 4x exp(-u)
                // d2/dx2 = 4 exp(-u) + 4x exp(-u) * (-2x) = (4 - 8x^2) exp(-u)
                // d2/dxdy = 4x exp(-u) * (-2y) = -8xy exp(-u)
                const fac = Math.exp(-(x**2 + y**2));
                const a = (4 - 8*x**2) * fac;
                const c = (4 - 8*y**2) * fac;
                const b = -8*x*y * fac;
                return [[a, b], [b, c]];
            },
            range: [-2, 2]
        },
        "Rosenbrock (Banana Valley)": {
            func: (x, y) => (1-x)**2 + 10*(y - x**2)**2,
            hessian: (x, y) => {
                // f = (1-x)^2 + 10(y-x^2)^2
                // fx = -2(1-x) + 20(y-x^2)(-2x) = -2 + 2x - 40xy + 40x^3
                // fy = 20(y-x^2)
                // fxx = 2 - 40y + 120x^2
                // fxy = -40x
                // fyy = 20
                const a = 2 - 40*y + 120*x**2;
                const b = -40*x;
                const c = 20;
                return [[a, b], [b, c]];
            },
            range: [-1.5, 2]
        }
    };

    let selectedFunc = functions[Object.keys(functions)[0]];
    Object.keys(functions).forEach(name => {
        const opt = document.createElement("option");
        opt.value = name;
        opt.textContent = name;
        select.appendChild(opt);
    });

    let svg, xS, yS;

    function getMinEigenvalue(H) {
        const a = H[0][0];
        const b = H[0][1];
        const d = H[1][1];
        const tr = a + d;
        const det = a*d - b*b;
        // eig = (tr +/- sqrt(tr^2 - 4det))/2
        // Min is with minus sign
        return (tr - Math.sqrt(Math.max(0, tr**2 - 4*det))) / 2;
    }

    function setupChart() {
        heatmapContainer.innerHTML = '';
        const margin = { top: 10, right: 10, bottom: 20, left: 30 };
        const width = heatmapContainer.clientWidth - margin.left - margin.right;
        const height = heatmapContainer.clientHeight - margin.top - margin.bottom;

        svg = d3.select(heatmapContainer).append("svg")
            .attr("class", "widget-svg")
            .attr("width", "100%").attr("height", "100%")
            .attr("viewBox", `0 0 ${heatmapContainer.clientWidth} ${heatmapContainer.clientHeight}`)
            .append("g").attr("transform", `translate(${margin.left},${margin.top})`);

        drawHeatmap(width, height);
    }

    function drawHeatmap(width, height) {
        const { range, hessian, func } = selectedFunc;

        xS = d3.scaleLinear().domain([range[0], range[1]]).range([0, width]);
        yS = d3.scaleLinear().domain([range[0], range[1]]).range([height, 0]);

        const lowResGrid = 50;
        const step = (range[1] - range[0]) / lowResGrid;

        const heatmapData = [];
        for(let j=0; j<lowResGrid; j++) {
            for(let i=0; i<lowResGrid; i++) {
                const xv = range[0] + i * step + step/2;
                const yv = range[0] + j * step + step/2;
                const H = hessian(xv, yv);
                heatmapData.push({
                    x: xv,
                    y: yv,
                    val: getMinEigenvalue(H)
                });
            }
        }

        // Clamp domain visually for better contrast
        const colorScale = d3.scaleDiverging(d3.interpolateRdBu).domain([-2, 0, 2]);

        svg.selectAll("rect").remove();
        svg.append("g").selectAll("rect")
            .data(heatmapData)
            .enter().append("rect")
            .attr("x", d => xS(d.x - step/2))
            .attr("y", d => yS(d.y + step/2))
            .attr("width", xS(range[0]+step) - xS(range[0]) + 0.8) // Slight overlap to avoid cracks
            .attr("height", yS(range[0]) - yS(range[0]+step) + 0.8)
            .attr("fill", d => colorScale(d.val));

        // Contours overlay
        const gridSize = 80;
        const values = [];
        for (let j = 0; j < gridSize; j++) {
            for (let i = 0; i < gridSize; i++) {
                const xv = range[0] + i * (range[1]-range[0])/gridSize;
                const yv = range[0] + j * (range[1]-range[0])/gridSize;
                values.push(func(xv, yv));
            }
        }
        const contours = d3.contours().size([gridSize, gridSize]).thresholds(15)(values);
        const transform = d3.geoTransform({
            point: function(px, py) {
                this.stream.point(xS(range[0] + px/gridSize*(range[1]-range[0])), yS(range[0] + py/gridSize*(range[1]-range[0])));
            }
        });

        svg.append("g").selectAll("path")
            .data(contours)
            .enter().append("path")
            .attr("d", d3.geoPath().projection(transform))
            .attr("fill", "none")
            .attr("stroke", "rgba(0,0,0,0.2)")
            .attr("stroke-width", 1);

        // Probe indicator
        const probe = svg.append("circle")
            .attr("r", 6).attr("fill", "none").attr("stroke", "var(--color-text-main)").attr("stroke-width", 2)
            .style("display", "none");
        const probeCenter = svg.append("circle")
            .attr("r", 2).attr("fill", "var(--color-text-main)")
            .style("display", "none");

        svg.append("rect").attr("width", width).attr("height", height).attr("fill", "transparent")
            .on("mousemove", (e) => {
                const [mx, my] = d3.pointer(e);
                const vx = xS.invert(mx);
                const vy = yS.invert(my);
                probe.attr("cx", mx).attr("cy", my).style("display", null);
                probeCenter.attr("cx", mx).attr("cy", my).style("display", null);
                updateProbe(vx, vy);
            })
            .on("mouseleave", () => {
                 // Optional hide
            });

        svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(xS).ticks(5));
        svg.append("g").call(d3.axisLeft(yS).ticks(5));

        legendContainer.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; gap: 16px;">
                <div style="font-size: 0.9rem; font-weight: bold;">Map: Min Eigenvalue λ_min(∇²f)</div>
                <div style="display: flex; align-items: center; font-size: 0.8rem;">
                    <span style="color: ${colorScale(-2)};">Neg (Concave)</span>
                    <div style="width: 120px; height: 12px; background: linear-gradient(to right, ${colorScale(-2)}, ${colorScale(0)}, ${colorScale(2)}); margin: 0 8px; border-radius: 2px; border: 1px solid var(--color-border);"></div>
                    <span style="color: ${colorScale(2)};">Pos (Convex)</span>
                </div>
            </div>
        `;
    }

    function updateProbe(x, y) {
        const H = selectedFunc.hessian(x, y);
        const minEig = getMinEigenvalue(H);
        const trace = H[0][0] + H[1][1];
        const maxEig = trace - minEig;

        // Determine local shape
        let shape = "Indefinite (Saddle)";
        if (minEig > 1e-3) shape = "Positive Definite (Bowl)";
        else if (maxEig < -1e-3) shape = "Negative Definite (Hill)";
        else if (minEig >= -1e-3 && maxEig >= -1e-3) shape = "Pos. Semidefinite (Valley)";
        else if (minEig <= 1e-3 && maxEig <= 1e-3 && minEig < 0) shape = "Neg. Semidefinite (Ridge)";

        probeInfo.innerHTML = `
            <div style="display: grid; grid-template-columns: auto 1fr; gap: 4px 12px;">
                <div>Pos:</div> <div style="font-family: var(--widget-font-mono);">[${x.toFixed(2)}, ${y.toFixed(2)}]</div>
                <div>λ_min:</div> <div style="font-family: var(--widget-font-mono); font-weight: bold; color: ${minEig < 0 ? 'var(--color-error)' : 'var(--color-success)'}">${minEig.toFixed(2)}</div>
                <div>Shape:</div> <div>${shape}</div>
            </div>
        `;

        renderWireframe(H);
    }

    function renderWireframe(H) {
        const ctx = probeCanvas.getContext('2d');
        const w = probeCanvas.width = probeCanvas.clientWidth;
        const h = probeCanvas.height = probeCanvas.clientHeight;

        ctx.clearRect(0, 0, w, h);
        ctx.lineWidth = 1.5;

        // Local quadratic approximation: Q(u,v) = 0.5 * [u v] H [u v]^T
        // Plot over [-1, 1] range
        const range = 1.0;
        const steps = 10;

        const project = (u, v, z) => {
            // Simple isometric
            const scale = 30;
            const isoX = (u - v) * Math.cos(Math.PI/6);
            const isoY = (u + v) * Math.sin(Math.PI/6) - z * 0.5; // Flatten z slightly
            return [w/2 + isoX * scale, h/2 + isoY * scale];
        };

        ctx.strokeStyle = "rgba(124, 197, 255, 0.5)";
        ctx.beginPath();

        for (let i = -steps; i <= steps; i++) {
            const u = i / steps * range;
            // Line varying v
            for (let j = -steps; j < steps; j++) {
                const v1 = j / steps * range;
                const v2 = (j+1) / steps * range;

                const z1 = 0.5 * (H[0][0]*u*u + 2*H[0][1]*u*v1 + H[1][1]*v1*v1);
                const z2 = 0.5 * (H[0][0]*u*u + 2*H[0][1]*u*v2 + H[1][1]*v2*v2);

                const p1 = project(u, v1, z1);
                const p2 = project(u, v2, z2);
                ctx.moveTo(p1[0], p1[1]); ctx.lineTo(p2[0], p2[1]);
            }
        }
        // Cross lines
        for (let j = -steps; j <= steps; j++) {
            const v = j / steps * range;
            for (let i = -steps; i < steps; i++) {
                const u1 = i / steps * range;
                const u2 = (i+1) / steps * range;

                const z1 = 0.5 * (H[0][0]*u1*u1 + 2*H[0][1]*u1*v + H[1][1]*v*v);
                const z2 = 0.5 * (H[0][0]*u2*u2 + 2*H[0][1]*u2*v + H[1][1]*v*v);

                const p1 = project(u1, v, z1);
                const p2 = project(u2, v, z2);
                ctx.moveTo(p1[0], p1[1]); ctx.lineTo(p2[0], p2[1]);
            }
        }
        ctx.stroke();

        // Draw Axes
        ctx.beginPath();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        const o = project(0,0,0);
        const xa = project(1.2,0,0);
        const ya = project(0,1.2,0);
        const za = project(0,0,1.5); // Z axis
        ctx.moveTo(o[0], o[1]); ctx.lineTo(xa[0], xa[1]);
        ctx.moveTo(o[0], o[1]); ctx.lineTo(ya[0], ya[1]);
        ctx.moveTo(o[0], o[1]); ctx.lineTo(za[0], za[1]);
        ctx.stroke();
    }

    select.addEventListener("change", (e) => {
        selectedFunc = functions[e.target.value];
        setupChart();
    });

    new ResizeObserver(setupChart).observe(heatmapContainer);
    setupChart();
}
