/**
 * Widget: Norm Geometry Visualizer
 *
 * Description: Interactively displays the unit balls for ℓ_p norms and allows users
 *              to explore the norm of a point in 2D space.
 * Version: 2.0.0
 */

import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function initNormGeometryVisualizer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container #${containerId} not found.`);
        return;
    }

    let p = 2; // Default to L2 norm
    let userPoint = { x: 0.8, y: 0.8 };

    // --- WIDGET LAYOUT ---
    container.innerHTML = `
        <div class="norm-visualizer-widget">
            <div id="plot-container" style="width: 100%; height: 400px; position: relative;"></div>
            <div class="widget-controls" style="padding: 15px; border-top: 1px solid var(--color-surface-1);">
                <div id="p-selector" style="margin-bottom: 15px;"></div>
                <div id="output-container" class="widget-output"></div>
            </div>
        </div>
    `;

    const plotContainer = container.querySelector("#plot-container");
    const controlsContainer = container.querySelector("#p-selector");
    const outputContainer = container.querySelector("#output-container");

    // --- UI CONTROLS ---
    controlsContainer.innerHTML = `
        <label for="p-slider" style="display: block; margin-bottom: 5px;">p-value: <span id="p-value-label">2.0</span></label>
        <input type="range" id="p-slider" min="1" max="10" step="0.1" value="2" style="width: 100%; margin-bottom: 10px;">
        <div id="p-buttons"></div>
    `;
    const pSlider = controlsContainer.querySelector("#p-slider");
    const pValueLabel = controlsContainer.querySelector("#p-value-label");
    const pButtonsContainer = controlsContainer.querySelector("#p-buttons");

    const buttons = [
        { label: "L¹ Norm (p=1)", value: 1 },
        { label: "L² Norm (p=2)", value: 2 },
        { label: "L¹⁰ Norm (p=10)", value: 10 },
        { label: "L\u221E Norm", value: Infinity }
    ];

    buttons.forEach(btnInfo => {
        const button = document.createElement("button");
        button.textContent = btnInfo.label;
        button.onclick = () => {
            p = btnInfo.value;
            if (p !== Infinity) {
                pSlider.value = p;
                pValueLabel.textContent = p.toFixed(1);
            } else {
                pValueLabel.textContent = "Infinity";
            }
            pSlider.disabled = (p === Infinity);
            update();
        };
        pButtonsContainer.appendChild(button);
    });

    pSlider.oninput = () => {
        p = parseFloat(pSlider.value);
        pValueLabel.textContent = p.toFixed(1);
        update();
    };

    // --- D3.js PLOT SETUP ---
    let svg, x, y;

    function setupChart() {
        plotContainer.innerHTML = '';
        const margin = { top: 20, right: 20, bottom: 40, left: 40 };
        const width = plotContainer.clientWidth - margin.left - margin.right;
        const height = plotContainer.clientHeight - margin.top - margin.bottom;

        svg = d3.select(plotContainer).append("svg")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("viewBox", `0 0 ${plotContainer.clientWidth} ${plotContainer.clientHeight}`)
            .append("g")
            .attr("transform", `translate(${margin.left + width / 2}, ${margin.top + height / 2})`);

        const domain = 1.6;
        x = d3.scaleLinear().domain([-domain, domain]).range([-width / 2, width / 2]);
        y = d3.scaleLinear().domain([-domain, domain]).range([height / 2, -height / 2]);

        svg.append("g").attr("class", "axis x-axis").attr("transform", `translate(0, ${height / 2})`).call(d3.axisBottom(x).ticks(5));
        svg.append("g").attr("class", "axis y-axis").attr("transform", `translate(${-width/2}, 0)`).call(d3.axisLeft(y).ticks(5));

        svg.append("path").attr("class", "unit-ball")
            .attr("fill", "var(--color-primary-light)")
            .attr("stroke", "var(--color-primary)")
            .attr("stroke-width", 2);

        // Group for the user point and its projection
        svg.append("g").attr("class", "user-point-group");
    }

    const drag = d3.drag()
        .on("start", (event) => d3.select(event.sourceEvent.target).raise().classed("active", true))
        .on("drag", function(event) {
            const [mx, my] = d3.pointer(event, svg.node());
            userPoint.x = x.invert(mx);
            userPoint.y = y.invert(my);
            update();
        })
        .on("end", () => d3.select(event.sourceEvent.target).classed("active", false));

    function update() {
        drawUnitBall();
        drawUserPoint();
        updateOutput();
    }

    function calculateNorm(point) {
        if (p === Infinity) {
            return Math.max(Math.abs(point.x), Math.abs(point.y));
        }
        return Math.pow(Math.pow(Math.abs(point.x), p) + Math.pow(Math.abs(point.y), p), 1 / p);
    }

    function drawUnitBall() {
        const points = [];
        const numPoints = 200;
        for (let i = 0; i <= numPoints; i++) {
            const angle = (i / numPoints) * 2 * Math.PI;
            const cos_a = Math.cos(angle);
            const sin_a = Math.sin(angle);
            let r;

            if (p === Infinity) {
                r = 1 / Math.max(Math.abs(cos_a), Math.abs(sin_a));
            } else {
                r = Math.pow(Math.pow(Math.abs(cos_a), p) + Math.pow(Math.abs(sin_a), p), -1 / p);
            }
            points.push({ x: r * cos_a, y: r * sin_a });
        }

        const lineGenerator = d3.line().x(d => x(d.x)).y(d => y(d.y)).curve(d3.curveLinearClosed);
        svg.select(".unit-ball").datum(points).attr("d", lineGenerator);
    }

    function drawUserPoint() {
        const pointGroup = svg.select(".user-point-group");
        pointGroup.selectAll("*").remove();

        pointGroup.append("line")
            .attr("x1", x(0)).attr("y1", y(0))
            .attr("x2", x(userPoint.x)).attr("y2", y(userPoint.y))
            .attr("stroke", "var(--color-accent)")
            .attr("stroke-width", 2.5);

        pointGroup.append("circle")
            .attr("cx", x(userPoint.x)).attr("cy", y(userPoint.y))
            .attr("r", 8)
            .attr("fill", "var(--color-accent)")
            .style("cursor", "grab")
            .call(drag);
    }

    function updateOutput() {
        const norm = calculateNorm(userPoint);
        const pDisplay = p === Infinity ? "\u221E" : p.toFixed(1);
        outputContainer.innerHTML = `
            <p><strong>Point x:</strong> [${userPoint.x.toFixed(2)}, ${userPoint.y.toFixed(2)}]</p>
            <p><strong>L<sub>${pDisplay}</sub> Norm ||x||<sub>${pDisplay}</sub>:</strong> ${norm.toFixed(3)}</p>
            <p style="color: ${norm <= 1.001 ? 'var(--color-accent)' : '#ff6b6b'};">
                ${norm <= 1.001 ? "Point is inside the unit ball." : "Point is outside the unit ball."}
            </p>
        `;
    }

    // --- RESPONSIVENESS ---
    const resizeObserver = new ResizeObserver(entries => {
        if (entries[0].target === plotContainer) {
            setupChart();
            update();
        }
    });
    resizeObserver.observe(plotContainer);

    // Initial setup
    setupChart();
    update();
}
