/**
 * Widget: Norm Geometry Visualizer
 *
 * Description: Interactively displays the unit balls for ℓ₁, ℓ₂, and ℓ∞ norms.
 */

import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export async function initNormGeometryVisualizer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container #${containerId} not found.`);
        return;
    }

    let p = 2; // Start with the L2 norm

    // --- UI CONTROLS ---
    const controls = document.createElement("div");
    controls.className = "widget-controls"; // Use a class for styling

    const buttons = [
        { label: "L1 Norm (p=1)", value: 1 },
        { label: "L2 Norm (p=2)", value: 2 },
        { label: "L∞ Norm (p→∞)", value: Infinity }
    ];

    buttons.forEach(btnInfo => {
        const button = document.createElement("button");
        button.textContent = btnInfo.label;
        button.onclick = () => {
            p = btnInfo.value;
            drawUnitBall();
            // Optional: Add an 'active' class to the button
            controls.querySelectorAll("button").forEach(b => b.classList.remove("active"));
            button.classList.add("active");
        };
        controls.appendChild(button);
    });

    // Clear previous content and add new controls
    container.innerHTML = '';
    container.appendChild(controls);

    // --- D3.js PLOT ---
    const margin = { top: 20, right: 20, bottom: 40, left: 40 };
    const width = container.clientWidth - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;

    const svg = d3.select(container).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left + width / 2}, ${margin.top + height / 2})`);

    const x = d3.scaleLinear().domain([-1.5, 1.5]).range([-width / 2, width / 2]);
    const y = d3.scaleLinear().domain([-1.5, 1.5]).range([height / 2, -height / 2]);

    // Add Axes
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0, ${height / 2})`)
        .call(d3.axisBottom(x).ticks(5));

    svg.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(${-width / 2}, 0)`)
        .call(d3.axisLeft(y).ticks(5));

    const unitBallPath = svg.append("path")
        .attr("fill", "var(--color-primary-light)")
        .attr("stroke", "var(--color-primary)")
        .attr("stroke-width", 2);

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

        const lineGenerator = d3.line()
            .x(d => x(d.x))
            .y(d => y(d.y))
            .curve(d3.curveLinearClosed);

        unitBallPath
            .datum(points)
            .transition()
            .duration(500)
            .attr("d", lineGenerator);
    }

    // Initial draw
    drawUnitBall();
    // Set L2 button as active initially
    controls.children[1].classList.add("active");
}
