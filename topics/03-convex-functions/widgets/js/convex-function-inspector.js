/**
 * Widget: Convex Function Inspector
 *
 * Description: An interactive tool for analyzing convex functions.
 *              Unifies Jensen's visualizer (definition), Epigraph (set view),
 *              and Tangent Line (first-order condition) into a single interface.
 *
 * Features:
 * - Select from a library of functions.
 * - Toggle overlays: "Jensen Chord", "Epigraph", "Tangent Line", "Quadratic Bound".
 * - Interactive graph with multiple control points.
 *
 * Version: 1.0.0
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function initConvexFunctionInspector(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // --- WIDGET LAYOUT ---
    container.innerHTML = `
        <div class="widget-container">
            <div class="widget-controls" style="flex-wrap: wrap; gap: 12px;">
                <div class="control-group" style="flex: 1; min-width: 200px;">
                    <label class="widget-label">Select Function</label>
                    <select id="func-select" class="widget-select"></select>
                </div>

                <div class="control-group" style="flex: 2; min-width: 300px;">
                    <label class="widget-label">Visualization Layers</label>
                    <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                        <label class="checkbox-label">
                            <input type="checkbox" id="layer-jensen" checked> Jensen (Chord)
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" id="layer-tangent"> Tangent (1st Order)
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" id="layer-epigraph"> Epigraph
                        </label>
                         <label class="checkbox-label">
                            <input type="checkbox" id="layer-quadratic"> Quadratic Bound
                        </label>
                    </div>
                </div>
            </div>

            <div class="widget-canvas-container" id="inspector-canvas" style="height: 500px; cursor: pointer;"></div>

            <div id="inspector-output" class="widget-output" style="min-height: 60px;">
                <span style="color: var(--text-secondary);">Click on the graph to interact.</span>
            </div>
        </div>
    `;

    // Styles for checkbox labels
    const style = document.createElement('style');
    style.innerHTML = `
        .checkbox-label { display: flex; align-items: center; gap: 6px; font-size: 0.9rem; cursor: pointer; user-select: none; }
        .checkbox-label input { cursor: pointer; }
    `;
    document.head.appendChild(style);

    const funcSelect = document.getElementById('func-select');
    const canvas = document.getElementById('inspector-canvas');
    const output = document.getElementById('inspector-output');

    // Function Library
    const functions = {
        "x² (Strongly Convex)": {
            func: x => x**2,
            grad: x => 2*x,
            domain: [-2.2, 2.2],
            mu: 2,
            desc: "Standard parabola. Strictly and strongly convex."
        },
        "eˣ (Strictly Convex)": {
            func: x => Math.exp(x),
            grad: x => Math.exp(x),
            domain: [-2, 1.5],
            mu: 0, // Locally strong, but globally 0
            desc: "Exponential growth. Strictly convex, but not strongly convex on R."
        },
        "|x| (Convex)": {
            func: x => Math.abs(x),
            grad: x => x > 0 ? 1 : (x < 0 ? -1 : 0), // Subgradient at 0
            domain: [-2.2, 2.2],
            mu: 0,
            desc: "Absolute value. Convex but not differentiable at 0."
        },
        "-log(x) (Convex)": {
            func: x => -Math.log(x),
            grad: x => -1/x,
            domain: [0.2, 4],
            mu: 0, // Strongly convex on compact sets
            desc: "Negative log. Convex on positive domain."
        },
        "x³ (Non-Convex)": {
            func: x => x**3,
            grad: x => 3*x**2,
            domain: [-1.5, 1.5],
            mu: 0,
            desc: "Cubic function. Convex for x>0, Concave for x<0. Inflection at 0."
        },
        "Double Well (Non-Convex)": {
            func: x => 0.5*x**4 - x**2,
            grad: x => 2*x**3 - 2*x,
            domain: [-1.8, 1.8],
            mu: -2, // Concave region exists
            desc: "Classic non-convex landscape with two local minima."
        }
    };

    let selectedFunc = functions[Object.keys(functions)[0]];

    // State
    let points = []; // For Jensen chord
    let tangentX = 0; // For tangent line
    let mode = 'jensen'; // Implicitly determined by last interaction?
    // Let's use layers to determine interaction.
    // Priority: Jensen (2 clicks) > Tangent (1 click/drag).
    // Actually, let's maintain both states.

    let svg, x, y;

    function init() {
        // Populate Select
        Object.keys(functions).forEach(k => {
            const opt = document.createElement('option');
            opt.value = k;
            opt.textContent = k;
            funcSelect.appendChild(opt);
        });

        setupChart();

        // Listeners
        funcSelect.addEventListener('change', () => {
            selectedFunc = functions[funcSelect.value];
            points = [];
            // Set default tangent to center
            tangentX = (selectedFunc.domain[0] + selectedFunc.domain[1])/2;
            draw();
            updateOutput("Function changed. Adjust layers to explore.");
        });

        ['layer-jensen', 'layer-tangent', 'layer-epigraph', 'layer-quadratic'].forEach(id => {
            document.getElementById(id).addEventListener('change', draw);
        });

        // Resize
        new ResizeObserver(() => { setupChart(); draw(); }).observe(canvas);

        // Set initial default tangent
        tangentX = 0;
        draw();
    }

    function setupChart() {
        canvas.innerHTML = '';
        const margin = {top: 20, right: 20, bottom: 30, left: 40};
        const width = canvas.clientWidth - margin.left - margin.right;
        const height = canvas.clientHeight - margin.top - margin.bottom;

        svg = d3.select(canvas).append("svg")
            .attr("width", "100%").attr("height", "100%")
            .attr("viewBox", `0 0 ${canvas.clientWidth} ${canvas.clientHeight}`)
            .append("g").attr("transform", `translate(${margin.left},${margin.top})`);

        // Interaction rect
        svg.append("rect").attr("width", width).attr("height", height)
            .attr("fill", "transparent")
            .on("click", handleClick)
            .on("mousemove", handleMouseMove);

        x = d3.scaleLinear().range([0, width]);
        y = d3.scaleLinear().range([height, 0]);

        svg.append("g").attr("class", "grid-x");
        svg.append("g").attr("class", "grid-y");
        svg.append("g").attr("class", "axis-x").attr("transform", `translate(0,${height})`);
        svg.append("g").attr("class", "axis-y");

        // Layers order matters
        svg.append("path").attr("class", "layer-epigraph-area").attr("fill", "rgba(24, 144, 255, 0.1)").style("opacity", 0);
        svg.append("path").attr("class", "function-curve").attr("fill", "none").attr("stroke", "var(--primary-500)").attr("stroke-width", 3);

        svg.append("line").attr("class", "layer-tangent-line").attr("stroke", "var(--accent-500)").attr("stroke-width", 2).attr("stroke-dasharray", "5 5").style("opacity", 0);
        svg.append("path").attr("class", "layer-quadratic-curve").attr("fill", "none").attr("stroke", "var(--warning)").attr("stroke-width", 2).attr("stroke-dasharray", "4 2").style("opacity", 0);

        const jensenG = svg.append("g").attr("class", "layer-jensen-group");
        jensenG.append("line").attr("class", "chord").attr("stroke", "var(--text-primary)").attr("stroke-width", 2).style("opacity", 0);
        jensenG.append("circle").attr("class", "pt1").attr("r", 5).attr("fill", "var(--text-primary)").style("opacity", 0);
        jensenG.append("circle").attr("class", "pt2").attr("r", 5).attr("fill", "var(--text-primary)").style("opacity", 0);
        jensenG.append("circle").attr("class", "midpt-chord").attr("r", 4).attr("fill", "var(--warning)").style("opacity", 0);
        jensenG.append("circle").attr("class", "midpt-func").attr("r", 4).attr("fill", "var(--success)").style("opacity", 0);

        svg.append("circle").attr("class", "tangent-pt").attr("r", 5).attr("fill", "var(--accent-500)").style("opacity", 0);
    }

    function draw() {
        const showJensen = document.getElementById('layer-jensen').checked;
        const showTangent = document.getElementById('layer-tangent').checked;
        const showEpigraph = document.getElementById('layer-epigraph').checked;
        const showQuadratic = document.getElementById('layer-quadratic').checked;

        const { func, domain, mu } = selectedFunc;
        x.domain(domain);

        // Sample points
        const step = (domain[1] - domain[0]) / 200;
        const data = d3.range(domain[0], domain[1]+step, step).map(val => ({ x: val, y: func(val) }));

        // Y Domain
        const yExtent = d3.extent(data, d => d.y);
        const yPad = (yExtent[1] - yExtent[0]) * 0.15 || 1;
        y.domain([yExtent[0] - yPad, yExtent[1] + yPad]);

        // Axes
        svg.select(".axis-x").call(d3.axisBottom(x).ticks(5));
        svg.select(".axis-y").call(d3.axisLeft(y).ticks(5));
        svg.select(".grid-x").call(d3.axisBottom(x).tickSize(-500).tickFormat("")).attr("stroke-opacity", 0.1); // Hack height
        svg.select(".grid-y").call(d3.axisLeft(y).tickSize(-500).tickFormat("")).attr("stroke-opacity", 0.1);

        // 1. Function Curve
        const line = d3.line().x(d => x(d.x)).y(d => y(d.y));
        svg.select(".function-curve").datum(data).attr("d", line);

        // 2. Epigraph
        if (showEpigraph) {
             const area = d3.area()
                .x(d => x(d.x))
                .y0(d => y(d.y))
                .y1(0); // Top of SVG coordinate space is 0
             svg.select(".layer-epigraph-area").datum(data).attr("d", area).style("opacity", 1);
        } else {
            svg.select(".layer-epigraph-area").style("opacity", 0);
        }

        // 3. Jensen's Inequality
        const jensenG = svg.select(".layer-jensen-group");
        if (showJensen && points.length > 0) {
            // Draw points
            points.forEach((p, i) => {
                const px = x(p.x);
                const py = y(p.y);
                jensenG.select(`.pt${i+1}`).attr("cx", px).attr("cy", py).style("opacity", 1);
            });

            if (points.length === 2) {
                const [p1, p2] = points;
                jensenG.select(".chord")
                    .attr("x1", x(p1.x)).attr("y1", y(p1.y))
                    .attr("x2", x(p2.x)).attr("y2", y(p2.y))
                    .style("opacity", 1);

                // Midpoint check (visualize theta=0.5)
                const mx = (p1.x + p2.x)/2;
                const myChord = (p1.y + p2.y)/2;
                const myFunc = func(mx);

                jensenG.select(".midpt-chord").attr("cx", x(mx)).attr("cy", y(myChord)).style("opacity", 1);
                jensenG.select(".midpt-func").attr("cx", x(mx)).attr("cy", y(myFunc)).style("opacity", 1);
            } else {
                 jensenG.select(".chord").style("opacity", 0);
                 jensenG.select(".midpt-chord").style("opacity", 0);
                 jensenG.select(".midpt-func").style("opacity", 0);
            }
        } else {
            jensenG.selectAll("*").style("opacity", 0);
        }

        // 4. Tangent Line
        if (showTangent) {
             const tx = tangentX;
             const ty = func(tx);
             const slope = selectedFunc.grad(tx);

             // Draw Point
             svg.select(".tangent-pt").attr("cx", x(tx)).attr("cy", y(ty)).style("opacity", 1);

             // Draw Line (y = slope*(x - tx) + ty)
             const y1 = slope*(domain[0] - tx) + ty;
             const y2 = slope*(domain[1] - tx) + ty;
             svg.select(".layer-tangent-line")
                .attr("x1", x(domain[0])).attr("y1", y(y1))
                .attr("x2", x(domain[1])).attr("y2", y(y2))
                .style("opacity", 1);
        } else {
            svg.select(".tangent-pt").style("opacity", 0);
            svg.select(".layer-tangent-line").style("opacity", 0);
        }

        // 5. Quadratic Bound (Strong Convexity)
        if (showQuadratic && mu !== 0) {
             const tx = tangentX;
             const ty = func(tx);
             const slope = selectedFunc.grad(tx);

             const quadData = data.map(d => {
                 const lin = slope*(d.x - tx) + ty;
                 const quad = (mu/2)*(d.x - tx)**2;
                 return { x: d.x, y: lin + quad };
             });

             svg.select(".layer-quadratic-curve").datum(quadData).attr("d", line).style("opacity", 1);
        } else {
            svg.select(".layer-quadratic-curve").style("opacity", 0);
        }
    }

    function handleClick(event) {
        const [mx] = d3.pointer(event);
        const xVal = x.invert(mx);
        const dom = selectedFunc.domain;
        if (xVal < dom[0] || xVal > dom[1]) return;
        const yVal = selectedFunc.func(xVal);

        // Logic: If Jensen enabled, handle point clicks. If Tangent enabled, update tangent pos.
        // If both? Jensen takes priority for clicks.
        const showJensen = document.getElementById('layer-jensen').checked;

        if (showJensen) {
            if (points.length >= 2) points = [];
            points.push({x: xVal, y: yVal});
            points.sort((a, b) => a.x - b.x);
            draw();

            if (points.length === 2) {
                updateOutput("Jensen's Inequality: Chord drawn between two points.");
            } else {
                updateOutput("Click a second point to draw the chord.");
            }
        } else {
            // Just move tangent if jensen off
            tangentX = xVal;
            draw();
            updateOutput(`Tangent updated at x = ${tangentX.toFixed(2)}`);
        }
    }

    function handleMouseMove(event) {
        // If drag logic implemented later
        if (event.buttons === 1 && document.getElementById('layer-tangent').checked && !document.getElementById('layer-jensen').checked) {
            const [mx] = d3.pointer(event);
            const xVal = x.invert(mx);
            const dom = selectedFunc.domain;
            if (xVal >= dom[0] && xVal <= dom[1]) {
                tangentX = xVal;
                draw();
            }
        }
    }

    function updateOutput(msg) {
        output.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 4px;">${selectedFunc.desc}</div>
            <div style="color: var(--text-secondary); font-size: 0.9rem;">${msg}</div>
        `;
    }

    init();
}
