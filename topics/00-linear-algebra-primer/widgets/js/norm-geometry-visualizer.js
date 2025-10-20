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

    let p = 2; // The p-norm parameter

    // --- UI CONTROLS ---
    const controls = document.createElement("div");
    controls.style.cssText = "padding: 10px; display: flex; align-items: center; gap: 15px;";
    const pLabel = document.createElement("label");
    pLabel.textContent = "p-norm:";
    const pSlider = document.createElement("input");
    pSlider.type = "range";
    pSlider.min = 1;
    pSlider.max = 10; // Use a large number to approximate infinity norm
    pSlider.step = 0.1;
    pSlider.value = p;
    pSlider.oninput = () => {
        p = parseFloat(pSlider.value);
        drawUnitBall();
    };
    controls.append(pLabel, pSlider);
    container.appendChild(controls);

    // --- D3.js PLOT ---
    const margin = { top: 10, right: 10, bottom: 20, left: 30 };
    const width = container.clientWidth - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;

    const svg = d3.select(container).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left + width/2},${margin.top + height/2})`);

    const x = d3.scaleLinear().domain([-1.5, 1.5]).range([-width/2, width/2]);
    const y = d3.scaleLinear().domain([-1.5, 1.5]).range([height/2, -height/2]);

    svg.append("g").call(d3.axisBottom(x));
    svg.append("g").call(d3.axisLeft(y));

    const unitBallPath = svg.append("path")
        .attr("fill", "lightblue")
        .attr("stroke", "black");

    function drawUnitBall() {
        const points = [];
        for (let angle = 0; angle <= 2 * Math.PI; angle += 0.01) {
            const cos_a = Math.cos(angle);
            const sin_a = Math.sin(angle);
            let r;
            if (p >= 10) { // Approximation for infinity norm
                 r = 1 / Math.max(Math.abs(cos_a), Math.abs(sin_a));
            } else {
                 r = Math.pow(Math.pow(Math.abs(cos_a), p) + Math.pow(Math.abs(sin_a), p), -1/p);
            }

            points.push({x: r * cos_a, y: r * sin_a});
        }

        const lineGenerator = d3.line().x(d => x(d.x)).y(d => y(d.y));
        unitBallPath.datum(points).attr("d", lineGenerator);
    }

    drawUnitBall();
}
