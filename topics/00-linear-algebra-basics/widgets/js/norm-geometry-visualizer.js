/**
 * Widget: Norm Geometry Visualizer
 *
 * Description: Interactively displays the unit balls for ℓ_p norms and allows users
 *              to explore the norm of a point in 2D space.
 * Version: 2.1.0 (Styled & Interactive)
 */

import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function initNormGeometryVisualizer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let p = 2; // Default to L2 norm
    let userPoint = { x: 0.8, y: 0.8 };

    // --- WIDGET LAYOUT ---
    container.innerHTML = `
        <div class="widget-container">
            <div class="widget-canvas-container" id="plot-container"></div>
            <div class="widget-controls">
                <div class="control-group">
                    <label>Norm Parameter ($p$): <span id="p-value-label" style="color:var(--primary-400); font-weight:bold;">2.0</span></label>
                    <input type="range" id="p-slider" min="1" max="10" step="0.1" value="2" style="width:100%;">
                </div>
                <div id="p-buttons" style="display:flex; gap:8px; flex-wrap:wrap;"></div>
            </div>
            <div id="output-container" class="widget-output"></div>
        </div>
    `;

    const plotContainer = container.querySelector("#plot-container");
    const pSlider = container.querySelector("#p-slider");
    const pValueLabel = container.querySelector("#p-value-label");
    const pButtonsContainer = container.querySelector("#p-buttons");
    const outputContainer = container.querySelector("#output-container");

    const buttons = [
        { label: "L¹ (Diamond)", value: 1 },
        { label: "L² (Circle)", value: 2 },
        { label: "L⁴ (Squircle)", value: 4 },
        { label: "L∞ (Square)", value: Infinity }
    ];

    buttons.forEach(btnInfo => {
        const button = document.createElement("button");
        button.className = "btn btn-sm btn-secondary";
        button.textContent = btnInfo.label;
        button.onclick = () => {
            p = btnInfo.value;
            if (p !== Infinity) {
                pSlider.value = p;
                pValueLabel.textContent = p.toFixed(1);
                pSlider.disabled = false;
            } else {
                pValueLabel.textContent = "∞";
                pSlider.disabled = true;
            }
            // Update active state
            Array.from(pButtonsContainer.children).forEach(b => {
                b.classList.remove('btn-primary');
                b.classList.add('btn-secondary');
            });
            button.classList.remove('btn-secondary');
            button.classList.add('btn-primary');

            update();
        };
        if (btnInfo.value === 2) {
            button.classList.remove('btn-secondary');
            button.classList.add('btn-primary');
        }
        pButtonsContainer.appendChild(button);
    });

    pSlider.oninput = () => {
        p = parseFloat(pSlider.value);
        pValueLabel.textContent = p.toFixed(1);
        Array.from(pButtonsContainer.children).forEach(btn => {
            if (btn.textContent.includes("∞")) {
                btn.classList.remove('btn-primary');
                btn.classList.add('btn-secondary');
            }
        });
        update();
    };

    // --- D3.js PLOT SETUP ---
    let svg, x, y;

    function setupChart() {
        plotContainer.innerHTML = '';
        const margin = { top: 20, right: 20, bottom: 20, left: 20 };
        const width = plotContainer.clientWidth - margin.left - margin.right;
        const height = plotContainer.clientHeight - margin.top - margin.bottom;

        svg = d3.select(plotContainer).append("svg")
            .attr("class", "widget-svg")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("viewBox", `0 0 ${plotContainer.clientWidth} ${plotContainer.clientHeight}`)
            .append("g")
            .attr("transform", `translate(${margin.left + width / 2}, ${margin.top + height / 2})`);

        const domain = 1.5;
        x = d3.scaleLinear().domain([-domain, domain]).range([-width / 2, width / 2]);
        y = d3.scaleLinear().domain([-domain, domain]).range([height / 2, -height / 2]);

        // Axes
        svg.append("line").attr("x1", x(-domain)).attr("x2", x(domain)).attr("y1", y(0)).attr("y2", y(0)).attr("stroke", "var(--border-default)");
        svg.append("line").attr("x1", x(0)).attr("x2", x(0)).attr("y1", y(-domain)).attr("y2", y(domain)).attr("stroke", "var(--border-default)");

        // Unit Ball Path
        svg.append("path").attr("class", "unit-ball")
            .attr("fill", "rgba(59, 130, 246, 0.15)")
            .attr("stroke", "var(--primary-500)")
            .attr("stroke-width", 2);

        // User Point Group
        const pointGroup = svg.append("g").attr("class", "user-point-group");
        
        pointGroup.append("line").attr("class", "connector").attr("stroke-dasharray", "4,4").attr("stroke", "var(--text-tertiary)");
        pointGroup.append("circle").attr("class", "handle")
            .attr("r", 8)
            .attr("fill", "var(--accent-400)")
            .attr("stroke", "white")
            .attr("stroke-width", 2)
            .style("cursor", "grab")
            .call(d3.drag()
                .on("drag", function(event) {
                    const [mx, my] = d3.pointer(event, svg.node());
                    userPoint.x = x.invert(mx);
                    userPoint.y = y.invert(my);
                    update();
                }));
    }

    function update() {
        // Draw Unit Ball
        const points = [];
        const numPoints = 200;
        for (let i = 0; i <= numPoints; i++) {
            const angle = (i / numPoints) * 2 * Math.PI;
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);
            let r;
            if (p === Infinity) r = 1 / Math.max(Math.abs(cos), Math.abs(sin));
            else r = Math.pow(Math.pow(Math.abs(cos), p) + Math.pow(Math.abs(sin), p), -1 / p);
            points.push({ x: r * cos, y: r * sin });
        }
        svg.select(".unit-ball").datum(points).attr("d", d3.line().x(d => x(d.x)).y(d => y(d.y)));

        // Update Point
        const pg = svg.select(".user-point-group");
        pg.select(".connector")
            .attr("x1", x(0)).attr("y1", y(0))
            .attr("x2", x(userPoint.x)).attr("y2", y(userPoint.y));
        pg.select(".handle")
            .attr("cx", x(userPoint.x)).attr("cy", y(userPoint.y));

        updateOutput();
    }

    function calculateNorm(pt) {
        if (p === Infinity) return Math.max(Math.abs(pt.x), Math.abs(pt.y));
        return Math.pow(Math.pow(Math.abs(pt.x), p) + Math.pow(Math.abs(pt.y), p), 1 / p);
    }

    function updateOutput() {
        const norm = calculateNorm(userPoint);
        const pStr = p === Infinity ? "∞" : p;
        const color = norm <= 1.05 ? "var(--success)" : "var(--error)"; // Slight tolerance for visual feedback
        
        outputContainer.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <span>Point: <code>(${userPoint.x.toFixed(2)}, ${userPoint.y.toFixed(2)})</code></span>
                <span>Norm ||x||<sub>${pStr}</sub>: <strong style="color:${color}">${norm.toFixed(3)}</strong></span>
            </div>
        `;
    }

    const resizeObserver = new ResizeObserver(entries => {
        if (entries[0].target === plotContainer) { setupChart(); update(); }
    });
    resizeObserver.observe(plotContainer);

    setupChart();
    update();
}
