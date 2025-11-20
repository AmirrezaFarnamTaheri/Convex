/**
 * Widget: Hessian Minimum Eigenvalue Heatmap
 *
 * Description: Visualizes the minimum eigenvalue of the Hessian for various functions.
 *              For a 2D function, convexity requires the Hessian to be positive semidefinite
 *              everywhere, which means its minimum eigenvalue must be non-negative.
 * Version: 2.1.0
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function initHessianHeatmap(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // --- WIDGET LAYOUT ---
    container.innerHTML = `
        <div class="widget-container">
             <div class="widget-canvas-container" id="plot-container" style="height: 400px; cursor: crosshair;"></div>
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
    const plotContainer = container.querySelector("#plot-container");
    const legendContainer = container.querySelector("#legend");

    const functions = {
        "x² + y² (Convex)": {
            func: (x, y) => x**2 + y**2,
            hessian_min_eig: (x, y) => 2,
            range: [-2, 2]
        },
        "x⁴ + y⁴ (Convex)": {
            func: (x, y) => x**4 + y**4,
            hessian_min_eig: (x, y) => Math.min(12 * x**2, 12 * y**2),
            range: [-2, 2]
        },
        "x³ + y³ (Non-Convex)": {
            func: (x, y) => x**3 + y**3,
            hessian_min_eig: (x, y) => Math.min(6 * x, 6 * y),
            range: [-2, 2]
        },
        "Gaussian Bump (Non-Convex)": {
            func: (x, y) => -Math.exp(-(x**2 + y**2)),
            hessian_min_eig: (x, y) => {
                // H = exp(-(x^2+y^2)) * [ 4x^2 - 2,  4xy     ]
                //                     [ 4xy,     4y^2 - 2 ]
                const e = Math.exp(-(x**2 + y**2));
                const a = e * (4*x**2 - 2);
                const c = e * (4*y**2 - 2);
                const b = e * (4*x*y);
                const tr = a + c;
                const det = a*c - b*b;
                // Min eigenvalue = (tr - sqrt(tr^2 - 4det))/2
                return (tr - Math.sqrt(Math.max(0, tr**2 - 4*det))) / 2;
            },
            range: [-2, 2]
        },
        "Saddle x² - y² (Non-Convex)": {
            func: (x, y) => x**2 - y**2,
            hessian_min_eig: (x, y) => -2,
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

    let svg;

    function setupChart() {
        plotContainer.innerHTML = '';
        const margin = { top: 20, right: 50, bottom: 30, left: 40 };
        const width = plotContainer.clientWidth - margin.left - margin.right;
        const height = plotContainer.clientHeight - margin.top - margin.bottom;

        svg = d3.select(plotContainer).append("svg")
            .attr("class", "widget-svg")
            .attr("width", "100%").attr("height", "100%")
            .attr("viewBox", `0 0 ${plotContainer.clientWidth} ${plotContainer.clientHeight}`)
            .append("g").attr("transform", `translate(${margin.left},${margin.top})`);

        draw();
    }

    function draw() {
        const { range, func, hessian_min_eig } = selectedFunc;
        const gridSize = 80; // Resolution
        const w = 400; // internal logical size
        const h = 400;

        // Scales
        const x = d3.scaleLinear().domain([range[0], range[1]]).range([0, w]);
        const y = d3.scaleLinear().domain([range[0], range[1]]).range([h, 0]);

        // Compute Data
        const values = [];
        const eigValues = [];

        const step = (range[1] - range[0]) / gridSize;

        for (let j = 0; j < gridSize; j++) {
            for (let i = 0; i < gridSize; i++) {
                const xv = range[0] + i * step;
                const yv = range[0] + j * step;
                values.push(func(xv, yv));
                eigValues.push(hessian_min_eig(xv, yv));
            }
        }

        // Color Scale for Eigenvalues
        // Typically positive is good (convex). Negative is bad.
        // Use RdBu diverging: Red (negative), White (zero), Blue (positive)
        // Or PiYG: Pink (Neg), Green (Pos)
        const colorScale = d3.scaleDiverging(d3.interpolateRdBu).domain([-2, 0, 2]);

        // Draw Heatmap using canvas for performance? Or simple rects?
        // Rects in SVG can be slow for 80x80 = 6400 nodes.
        // Let's use a canvas overlay inside the div, then SVG for contours/axes.

        // Re-do layout: separate canvas layer
        const canvas = document.createElement('canvas');
        canvas.width = gridSize;
        canvas.height = gridSize;
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.style.position = "absolute";
        canvas.style.top = "0";
        canvas.style.left = "0";
        canvas.style.imageRendering = "pixelated"; // Show grid clearly

        // Put canvas behind SVG
        // Actually we need to align canvas with SVG inner group area.
        // Easier: Just use SVG image element with data URL?
        // Or just simpler rects with lower res (40x40).

        // Let's use 40x40 rects for SVG.
        const lowResGrid = 40;
        const lowResStep = (range[1] - range[0]) / lowResGrid;
        const rectW = svg.attr("width") ? parseFloat(svg.attr("width")) : 400; // fallback
        // Wait, viewBox logic.
        // Let's rely on D3 selection.

        // Clear
        svg.selectAll("*").remove();

        // We need actual pixel width for rects
        const pixelW = 400;
        const pixelH = 400;

        const xS = d3.scaleLinear().domain([range[0], range[1]]).range([0, pixelW]);
        const yS = d3.scaleLinear().domain([range[0], range[1]]).range([pixelH, 0]);

        // Generate Heatmap Data
        const heatmapData = [];
        for(let j=0; j<lowResGrid; j++) {
            for(let i=0; i<lowResGrid; i++) {
                const xv = range[0] + i * lowResStep + lowResStep/2;
                const yv = range[0] + j * lowResStep + lowResStep/2;
                heatmapData.push({
                    x: xv,
                    y: yv,
                    val: hessian_min_eig(xv, yv)
                });
            }
        }

        svg.append("g").selectAll("rect")
            .data(heatmapData)
            .enter().append("rect")
            .attr("x", d => xS(d.x - lowResStep/2))
            .attr("y", d => yS(d.y + lowResStep/2))
            .attr("width", xS(lowResStep) - xS(0) + 0.5) // +0.5 to remove gaps
            .attr("height", yS(0) - yS(lowResStep) + 0.5)
            .attr("fill", d => colorScale(d.val));

        // Draw Contours of Function Value
        const contours = d3.contours().size([gridSize, gridSize]).thresholds(10)(values);
        // Transform contours to scale
        const transform = d3.geoTransform({
            point: function(px, py) {
                // px, py are in grid coords [0, gridSize]
                // y is flipped in grid vs Cartesian
                this.stream.point(xS(range[0] + px/gridSize*(range[1]-range[0])), yS(range[0] + py/gridSize*(range[1]-range[0])));
            }
        });

        svg.append("g").selectAll("path")
            .data(contours)
            .enter().append("path")
            .attr("d", d3.geoPath().projection(transform))
            .attr("fill", "none")
            .attr("stroke", "rgba(0,0,0,0.4)")
            .attr("stroke-width", 1);

        // Axes
        svg.append("g").attr("class", "axis").attr("transform", `translate(0,${pixelH})`).call(d3.axisBottom(xS).ticks(5));
        svg.append("g").attr("class", "axis").call(d3.axisLeft(yS).ticks(5));

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

        // Add Hover info
        const overlay = svg.append("rect").attr("width", pixelW).attr("height", pixelH).attr("fill", "transparent")
            .on("mousemove", (e) => {
                const [mx, my] = d3.pointer(e);
                const vx = xS.invert(mx);
                const vy = yS.invert(my);
                const eig = hessian_min_eig(vx, vy);
                // Tooltip logic would go here or update a text element
            });
    }

    select.addEventListener("change", (e) => {
        selectedFunc = functions[e.target.value];
        draw();
    });

    new ResizeObserver(setupChart).observe(plotContainer);
    setupChart();
}
