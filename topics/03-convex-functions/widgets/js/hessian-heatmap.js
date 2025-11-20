/**
 * Widget: Hessian Minimum Eigenvalue Heatmap with Interactive Probe
 *
 * Description: Visualizes the minimum eigenvalue of the Hessian as a heatmap.
 *              Includes an interactive probe that shows the local quadratic approximation
 *              (paraboloid bowl/saddle/ridge) at the cursor position.
 * Version: 2.2.0
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function initHessianHeatmap(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // --- WIDGET LAYOUT ---
    container.innerHTML = `
        <div class="widget-container">
            <div style="display: flex; gap: 20px; flex-wrap: wrap;">
                 <div style="flex: 1; min-width: 300px;">
                    <div class="widget-canvas-container" id="heatmap-container" style="height: 350px; cursor: crosshair; position: relative;"></div>
                 </div>
                 <div style="flex: 0 0 250px; display: flex; flex-direction: column;">
                    <div class="widget-canvas-container" id="probe-view" style="height: 200px; border: 1px solid var(--color-border); background: var(--color-surface-1); position: relative;">
                         <div style="position: absolute; top: 5px; left: 5px; font-size: 0.75rem; color: var(--color-text-muted);">Local Approx (Wireframe)</div>
                         <canvas id="probe-canvas" style="width: 100%; height: 100%;"></canvas>
                    </div>
                    <div id="probe-info" style="margin-top: 10px; font-size: 0.9rem;">
                        Hover over the heatmap...
                    </div>
                 </div>
            </div>

            <div class="widget-controls">
                <div class="widget-control-group" style="flex: 1;">
                    <label class="widget-label">Function</label>
                    <select id="heatmap-function-select" class="widget-select"></select>
                </div>
            </div>
            <div id="legend" class="widget-output"></div>
        </div>
    `;

    const select = container.querySelector("#heatmap-function-select");
    const heatmapContainer = container.querySelector("#heatmap-container");
    const legendContainer = container.querySelector("#legend");
    const probeCanvas = container.querySelector("#probe-canvas");
    const probeInfo = container.querySelector("#probe-info");

    const functions = {
        "x² + y² (Convex)": {
            func: (x, y) => x**2 + y**2,
            hessian: (x, y) => [[2, 0], [0, 2]],
            range: [-2, 2]
        },
        "x⁴ + y⁴ (Convex)": {
            func: (x, y) => x**4 + y**4,
            hessian: (x, y) => [[12*x**2, 0], [0, 12*y**2]],
            range: [-2, 2]
        },
        "x³ + y³ (Non-Convex)": {
            func: (x, y) => x**3 + y**3,
            hessian: (x, y) => [[6*x, 0], [0, 6*y]],
            range: [-2, 2]
        },
        "Gaussian Bump (Non-Convex)": {
            func: (x, y) => -Math.exp(-(x**2 + y**2)),
            hessian: (x, y) => {
                const e = Math.exp(-(x**2 + y**2));
                const a = e * (4*x**2 - 2);
                const c = e * (4*y**2 - 2);
                const b = e * (4*x*y);
                return [[a, b], [b, c]];
            },
            range: [-2, 2]
        },
        "Saddle x² - y² (Non-Convex)": {
            func: (x, y) => x**2 - y**2,
            hessian: (x, y) => [[2, 0], [0, -2]],
            range: [-2, 2]
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
        const b = H[0][1]; // Assume symmetric
        const d = H[1][1];
        const tr = a + d;
        const det = a*d - b*b;
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

        const lowResGrid = 40;
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

        const colorScale = d3.scaleDiverging(d3.interpolateRdBu).domain([-2, 0, 2]);

        svg.selectAll("rect").remove();
        svg.append("g").selectAll("rect")
            .data(heatmapData)
            .enter().append("rect")
            .attr("x", d => xS(d.x - step/2))
            .attr("y", d => yS(d.y + step/2))
            .attr("width", xS(range[0]+step) - xS(range[0]) + 0.5)
            .attr("height", yS(range[0]) - yS(range[0]+step) + 0.5)
            .attr("fill", d => colorScale(d.val));

        // Draw contours
        const gridSize = 60;
        const values = [];
        for (let j = 0; j < gridSize; j++) {
            for (let i = 0; i < gridSize; i++) {
                const xv = range[0] + i * (range[1]-range[0])/gridSize;
                const yv = range[0] + j * (range[1]-range[0])/gridSize;
                values.push(func(xv, yv));
            }
        }
        const contours = d3.contours().size([gridSize, gridSize]).thresholds(10)(values);
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
            .attr("stroke", "rgba(0,0,0,0.3)")
            .attr("stroke-width", 1);

        // Probe circle
        const probe = svg.append("circle")
            .attr("r", 5).attr("fill", "none").attr("stroke", "var(--color-text-main)").attr("stroke-width", 2)
            .style("display", "none");

        // Overlay for events
        svg.append("rect").attr("width", width).attr("height", height).attr("fill", "transparent")
            .on("mousemove", (e) => {
                const [mx, my] = d3.pointer(e);
                const vx = xS.invert(mx);
                const vy = yS.invert(my);

                probe.attr("cx", mx).attr("cy", my).style("display", null);
                updateProbe(vx, vy);
            })
            .on("mouseleave", () => {
                // Keep last position or hide?
                // Keeping feels more useful for reading values
            });

        // Axes
        svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(xS).ticks(5));
        svg.append("g").call(d3.axisLeft(yS).ticks(5));

        // Legend
        legendContainer.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px; justify-content: center;">
                <div style="font-size: 0.9rem;">Min Eigenvalue λ_min(∇²f):</div>
                <div style="display: flex; align-items: center; font-size: 0.8rem;">
                    <span style="color: ${colorScale(-2)}; font-weight: bold;">Negative (Concave)</span>
                    <div style="width: 100px; height: 12px; background: linear-gradient(to right, ${colorScale(-2)}, ${colorScale(0)}, ${colorScale(2)}); margin: 0 8px; border-radius: 2px;"></div>
                    <span style="color: ${colorScale(2)}; font-weight: bold;">Positive (Convex)</span>
                </div>
            </div>
        `;
    }

    function updateProbe(x, y) {
        const H = selectedFunc.hessian(x, y);
        const minEig = getMinEigenvalue(H);
        const maxEig = H[0][0] + H[1][1] - minEig; // Trace - min

        let type = "Indefinite (Saddle)";
        if (minEig > 1e-3) type = "Positive Definite (Bowl)";
        else if (maxEig < -1e-3) type = "Negative Definite (Hill)";
        else if (minEig >= -1e-3 && maxEig >= -1e-3) type = "Positive Semidefinite (Valley)";

        probeInfo.innerHTML = `
            <div><strong>Pos:</strong> [${x.toFixed(2)}, ${y.toFixed(2)}]</div>
            <div><strong>Hessian:</strong> [[${H[0][0].toFixed(1)}, ${H[0][1].toFixed(1)}], [${H[1][0].toFixed(1)}, ${H[1][1].toFixed(1)}]]</div>
            <div><strong>Min Eigenvalue:</strong> <span style="color: ${minEig < 0 ? 'var(--color-error)' : 'var(--color-success)'}">${minEig.toFixed(2)}</span></div>
            <div><strong>Shape:</strong> ${type}</div>
        `;

        renderWireframe(H);
    }

    function renderWireframe(H) {
        // Simple 3D wireframe on 2D canvas
        const ctx = probeCanvas.getContext('2d');
        const w = probeCanvas.width = probeCanvas.clientWidth;
        const h = probeCanvas.height = probeCanvas.clientHeight;

        ctx.clearRect(0, 0, w, h);
        ctx.strokeStyle = "var(--color-primary)";
        ctx.lineWidth = 1;

        // Projection
        const proj = (x, y, z) => {
            const scale = 40;
            // Isometric-ish
            const isoX = (x - y) * Math.cos(Math.PI/6);
            const isoY = (x + y) * Math.sin(Math.PI/6) - z;
            return [w/2 + isoX * scale, h/2 + isoY * scale];
        };

        // Draw grid z = 0.5 * [x y] H [x y]^T
        const range = 1.5;
        const steps = 8;

        ctx.beginPath();
        for(let i=-steps; i<=steps; i++) {
            const u = i/steps * range;
            for(let j=-steps; j<steps; j++) {
                 const v1 = j/steps * range;
                 const v2 = (j+1)/steps * range;

                 // Line along V
                 const z1 = 0.5 * (H[0][0]*u*u + 2*H[0][1]*u*v1 + H[1][1]*v1*v1);
                 const z2 = 0.5 * (H[0][0]*u*u + 2*H[0][1]*u*v2 + H[1][1]*v2*v2);

                 const p1 = proj(u, v1, z1);
                 const p2 = proj(u, v2, z2);
                 ctx.moveTo(p1[0], p1[1]);
                 ctx.lineTo(p2[0], p2[1]);

                 // Line along U
                 const z3 = 0.5 * (H[0][0]*v1*v1 + 2*H[0][1]*v1*u + H[1][1]*u*u); // Swap u,v role for other dir
                 // Actually easier just to loop again?
            }
        }
        // Second pass for cross lines
        for(let j=-steps; j<=steps; j++) {
            const v = j/steps * range;
            for(let i=-steps; i<steps; i++) {
                 const u1 = i/steps * range;
                 const u2 = (i+1)/steps * range;

                 const z1 = 0.5 * (H[0][0]*u1*u1 + 2*H[0][1]*u1*v + H[1][1]*v*v);
                 const z2 = 0.5 * (H[0][0]*u2*u2 + 2*H[0][1]*u2*v + H[1][1]*v*v);

                 const p1 = proj(u1, v, z1);
                 const p2 = proj(u2, v, z2);
                 ctx.moveTo(p1[0], p1[1]);
                 ctx.lineTo(p2[0], p2[1]);
            }
        }
        ctx.strokeStyle = "rgba(124, 197, 255, 0.6)";
        ctx.stroke();

        // Axes
        ctx.beginPath();
        const origin = proj(0,0,0);
        const xAxis = proj(1.5,0,0);
        const yAxis = proj(0,1.5,0);
        const zAxis = proj(0,0,1.5);

        ctx.moveTo(origin[0], origin[1]); ctx.lineTo(xAxis[0], xAxis[1]);
        ctx.moveTo(origin[0], origin[1]); ctx.lineTo(yAxis[0], yAxis[1]);
        ctx.moveTo(origin[0], origin[1]); ctx.lineTo(zAxis[0], zAxis[1]);
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    select.addEventListener("change", (e) => {
        selectedFunc = functions[e.target.value];
        setupChart();
    });

    new ResizeObserver(setupChart).observe(heatmapContainer);
    setupChart();
}
