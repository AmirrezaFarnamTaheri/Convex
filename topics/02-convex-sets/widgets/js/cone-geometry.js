/**
 * Widget: Interactive Cone Geometry
 *
 * Description: An interactive visualizer for exploring Lp-cones and Normal Cones.
 * Version: 2.1.0 (Refined)
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function initConeGeometry(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="cone-geometry-widget">
            <div id="plot-area" class="plot-area"></div>
            <div class="controls-area">
                <h4>Cone Explorer</h4>
                <div class="control-group">
                    <label for="cone-select">Cone Type:</label>
                    <select id="cone-select" class="widget-select">
                        <option value="lp-cone">Lp Cone</option>
                        <option value="normal-cone">Normal Cone</option>
                    </select>
                </div>
                <div id="lp-controls" class="control-group">
                    <label for="p-slider">p = <span id="p-value">2.0</span></label>
                    <input type="range" id="p-slider" min="1" max="10" step="0.1" value="2" class="styled-slider">
                </div>
                <div id="output-box" class="output-box"></div>
            </div>
        </div>
    `;

    const plotArea = container.querySelector("#plot-area");
    const coneSelect = container.querySelector("#cone-select");
    const lpControls = container.querySelector("#lp-controls");
    const pSlider = container.querySelector("#p-slider");
    const pValue = container.querySelector("#p-value");
    const outputBox = container.querySelector("#output-box");

    let svg, x, y, width, height;
    const domain = 5;
    let currentMode = "lp-cone";

    // State for Lp Cone
    let p = 2;
    let testPointLp = { x: 1.5, y: 2.5 };

    // State for Normal Cone
    const convexSetPath = [[-4,-4], [4,-4], [4,4], [-4,4]]; // A square
    let boundaryPoint = { x: 4, y: 0 };

    function setupChart() {
        plotArea.innerHTML = '';
        const margin = { top: 20, right: 20, bottom: 20, left: 20 };
        width = plotArea.clientWidth - margin.left - margin.right;
        height = plotArea.clientHeight - margin.top - margin.bottom;

        svg = d3.select(plotArea).append("svg")
            .attr("width", "100%").attr("height", "100%")
            .attr("viewBox", `0 0 ${plotArea.clientWidth} ${plotArea.clientHeight}`)
            .append("g").attr("transform", `translate(${margin.left + width/2},${margin.top + height/2})`);

        x = d3.scaleLinear().domain([-domain, domain]).range([-width / 2, width / 2]);
        y = d3.scaleLinear().domain([-domain, domain]).range([height / 2, -height / 2]);

        svg.append("g").attr("class", "grid").call(d3.axisBottom(x).ticks(10).tickSize(-height).tickFormat(""));
        svg.append("g").attr("class", "grid").call(d3.axisLeft(y).ticks(10).tickSize(-width).tickFormat(""));
        svg.append("g").attr("class", "axis x-axis").attr("transform", `translate(0,${y(0)})`).call(d3.axisBottom(x).ticks(5));
        svg.append("g").attr("class", "axis y-axis").attr("transform", `translate(${x(0)},0)`).call(d3.axisLeft(y).ticks(5));

        svg.append("g").attr("class", "viz-elements");
    }

    function update() {
        svg.select(".viz-elements").selectAll("*").remove();
        lpControls.style.display = (currentMode === 'lp-cone') ? 'flex' : 'none';

        if (currentMode === 'lp-cone') {
            drawLpCone();
        } else {
            drawNormalCone();
        }
    }

    function drawLpCone() {
        const g = svg.select(".viz-elements");
        const t_max = domain;
        const x_at_t_max = Math.pow(t_max, p);
        const p_inv = 1 / p;

        const conePath = d3.line()
            .x(d => x(d.x)).y(d => y(d.y));

        const right_boundary = d3.range(0, t_max, 0.1).map(t => ({x: Math.pow(t, p_inv), y: t}));
        const left_boundary = d3.range(t_max, 0, -0.1).map(t => ({x: -Math.pow(t, p_inv), y: t}));

        g.append("path").attr("class", "cone-path-fill")
            .attr("d", conePath([...right_boundary, {x:0, y:0}, ...left_boundary]));

        // Is the test point in the cone? ||x||_p <= t
        const inCone = Math.pow(Math.abs(testPointLp.x), p) <= testPointLp.y;

        g.append("circle").datum(testPointLp)
            .attr("class", `test-point ${inCone ? 'inside' : 'outside'}`)
            .attr("cx", d => x(d.x)).attr("cy", d => y(d.y))
            .attr("r", 6)
            .call(d3.drag().on("drag", function(event, d) {
                const [mx, my] = d3.pointer(event, svg.node());
                d.x = x.invert(mx);
                d.y = y.invert(my);
                update();
            }));

        outputBox.innerHTML = `
            <div><strong>Lp Cone:</strong> <code>{ (x, t) | ||x||p ≤ t }</code></div>
            <div>Point (x,t) = <code>(${testPointLp.x.toFixed(2)}, ${testPointLp.y.toFixed(2)})</code></div>
            <div class="${inCone ? 'inside' : 'outside'}">Status: <strong>${inCone ? 'INSIDE' : 'OUTSIDE'}</strong></div>
        `;
    }

    function drawNormalCone() {
         const g = svg.select(".viz-elements");

         g.append("path").datum(convexSetPath)
            .attr("class", "convex-set-path")
            .attr("d", d3.line().x(d => x(d[0])).y(d => y(d[1])) + "Z");

        // Find closest point on boundary to update boundaryPoint
        let minDist = Infinity;
        for(let i=0; i<convexSetPath.length; i++) {
            const p1 = convexSetPath[i];
            const p2 = convexSetPath[(i+1)%convexSetPath.length];
            const t = ((boundaryPoint.x - p1[0]) * (p2[0] - p1[0]) + (boundaryPoint.y - p1[1]) * (p2[1] - p1[1])) / ((p2[0]-p1[0])**2 + (p2[1]-p1[1])**2);
            const t_clamped = Math.max(0, Math.min(1, t));
            const proj = {x: p1[0] + t_clamped * (p2[0]-p1[0]), y: p1[1] + t_clamped * (p2[1]-p1[1])};
            const dist = Math.hypot(boundaryPoint.x - proj.x, boundaryPoint.y - proj.y);
            if(dist < minDist) {
                minDist = dist;
                boundaryPoint = proj;
            }
        }

        // Calculate and draw normal cone
        const normal = [0,0]; // Simplified for a square
        if(Math.abs(boundaryPoint.x - 4) < 1e-3) normal[0] = 1;
        if(Math.abs(boundaryPoint.x - (-4)) < 1e-3) normal[0] = -1;
        if(Math.abs(boundaryPoint.y - 4) < 1e-3) normal[1] = 1;
        if(Math.abs(boundaryPoint.y - (-4)) < 1e-3) normal[1] = -1;
        // ... (more complex logic for corners is needed for full correctness)

        g.append("line").attr("class", "normal-vector")
            .attr("x1", x(boundaryPoint.x)).attr("y1", y(boundaryPoint.y))
            .attr("x2", x(boundaryPoint.x + normal[0]*2)).attr("y2", y(boundaryPoint.y + normal[1]*2));

        g.append("circle").datum(boundaryPoint)
            .attr("class", "boundary-point")
            .attr("cx", d => x(d.x)).attr("cy", d => y(d.y))
            .attr("r", 6)
            .call(d3.drag().on("drag", function(event, d) {
                const [mx, my] = d3.pointer(event, svg.node());
                d.x = x.invert(mx);
                d.y = y.invert(my);
                update();
            }));

        outputBox.innerHTML = `
            <div><strong>Normal Cone N<sub>C</sub>(x):</strong> <code>{ g | gᵀ(y-x) ≤ 0, ∀y∈C }</code></div>
            <div>Point x = <code>(${boundaryPoint.x.toFixed(2)}, ${boundaryPoint.y.toFixed(2)})</code></div>
        `;
    }

    coneSelect.onchange = (e) => { currentMode = e.target.value; update(); };
    pSlider.oninput = (e) => { p = parseFloat(e.target.value); pValue.textContent = p.toFixed(1); update(); };

    new ResizeObserver(setupChart).observe(plotArea);
    setupChart();
    update();
}

const style = document.createElement('style');
style.textContent = `
.cone-geometry-widget { display: flex; height: 100%; background: var(--color-background); border-radius: var(--border-radius-lg); overflow: hidden; }
.plot-area { flex: 2; position: relative; }
.controls-area { flex: 1; padding: 1rem; border-left: 1px solid var(--color-border); background: var(--color-surface-1); }
.cone-path-fill { fill: var(--color-primary); fill-opacity: 0.3; }
.test-point { stroke: var(--color-background); stroke-width: 2; cursor: grab; }
.test-point.inside { fill: var(--color-success); }
.test-point.outside { fill: var(--color-error); }
.output-box .inside { color: var(--color-success); }
.output-box .outside { color: var(--color-error); }
.convex-set-path { fill: var(--color-surface-3); stroke: var(--color-text-muted); }
.boundary-point { fill: var(--color-primary); cursor: grab; }
.normal-vector { stroke: var(--color-accent); stroke-width: 3; marker-end: url(#arrow-accent); }
`;
document.head.appendChild(style);
