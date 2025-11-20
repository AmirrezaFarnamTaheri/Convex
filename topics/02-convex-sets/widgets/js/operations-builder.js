/**
 * Widget: Operations Preserving Convexity Builder
 *
 * Description: A tool where users can apply operations (intersection, affine transformation)
 *              to pre-defined convex sets to see the result.
 * Version: 2.1.0
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

// Helper: Sutherland-Hodgman Clipping (Convex-Convex intersection)
function clipPolygon(subjectPolygon, clipPolygon) {
    let output = subjectPolygon;
    if(!clipPolygon || clipPolygon.length < 3) return [];

    const cp = [...clipPolygon]; // Ensure closed loop logic?

    for(let j=0; j<cp.length; j++) {
        const edgeStart = cp[j];
        const edgeEnd = cp[(j+1)%cp.length];
        const input = output;
        output = [];

        if(input.length === 0) break;

        const isInside = (p) => {
            return (edgeEnd[0]-edgeStart[0])*(p[1]-edgeStart[1]) - (edgeEnd[1]-edgeStart[1])*(p[0]-edgeStart[0]) >= 0; // Assuming CCW order
        };

        const intersect = (p1, p2) => {
             const num = (edgeStart[0]*edgeEnd[1] - edgeStart[1]*edgeEnd[0]) * (p1[0]-p2[0]) - (edgeStart[0]-edgeEnd[0]) * (p1[0]*p2[1] - p1[1]*p2[0]);
             const den = (edgeStart[0]-edgeEnd[0]) * (p1[1]-p2[1]) - (edgeStart[1]-edgeEnd[1]) * (p1[0]-p2[0]);
             return [
                 num/den,
                 ((edgeStart[0]*edgeEnd[1] - edgeStart[1]*edgeEnd[0]) * (p1[1]-p2[1]) - (edgeStart[1]-edgeEnd[1]) * (p1[0]*p2[1] - p1[1]*p2[0]))/den
             ];
        };

        let s = input[input.length-1];
        for(const e of input) {
            if(isInside(e)) {
                if(!isInside(s)) output.push(intersect(s,e));
                output.push(e);
            } else if(isInside(s)) {
                output.push(intersect(s,e));
            }
            s = e;
        }
    }
    return output;
}

// Helper: Minkowski Sum
function minkowskiSum(poly1, poly2) {
    // Sum of every point pair. The convex hull of sums is the Minkowski sum.
    const points = [];
    for(let p1 of poly1) {
        for(let p2 of poly2) {
            points.push([p1[0]+p2[0], p1[1]+p2[1]]);
        }
    }
    return d3.polygonHull(points);
}

export function initOperationsBuilder(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // --- WIDGET LAYOUT ---
    container.innerHTML = `
        <div class="widget-container">
             <div class="widget-canvas-container" id="plot-container" style="height: 400px;"></div>
            <div class="widget-controls">
                <div class="widget-control-group" style="flex: 1;">
                    <label class="widget-label">Operation</label>
                    <select id="op-select" class="widget-select">
                        <option value="intersection">Intersection (A ∩ B)</option>
                        <option value="union">Union (A ∪ B) - Hull</option>
                        <option value="minkowski">Minkowski Sum (A + B)</option>
                        <option value="affine">Affine Transform (M*A + v)</option>
                    </select>
                </div>
                <div class="widget-control-group" style="flex: 1;" id="transform-controls" style="display:none;">
                    <label class="widget-label">Transform Scale</label>
                    <input type="range" id="scale-slider" min="0.1" max="2" step="0.1" value="1" class="widget-slider">
                </div>
            </div>
            <div id="status-output" class="widget-output"></div>
        </div>
    `;

    const plotContainer = container.querySelector("#plot-container");
    const opSelect = container.querySelector("#op-select");
    const scaleSlider = container.querySelector("#scale-slider");
    const transformControls = container.querySelector("#transform-controls");
    const statusOutput = container.querySelector("#status-output");

    let svg, x, y;

    // Define base sets (CCW order for clipping)
    const setA = [[-2, -2], [2, -2], [2, 2], [-2, 2]]; // Square
    const setB = d3.range(0, 2*Math.PI, 0.2).map(t => [3 + 2*Math.cos(t), 2*Math.sin(t)]).reverse(); // Circle centered at (3,0)

    // Current transform
    let affineM = [[1, 0], [0, 1]]; // Identity
    let affineV = [0, 0];

    function setupChart() {
        plotContainer.innerHTML = '';
        const margin = { top: 20, right: 20, bottom: 20, left: 20 };
        const width = plotContainer.clientWidth - margin.left - margin.right;
        const height = plotContainer.clientHeight - margin.top - margin.bottom;

        svg = d3.select(plotContainer).append("svg")
            .attr("class", "widget-svg")
            .attr("width", "100%").attr("height", "100%")
            .attr("viewBox", `0 0 ${plotContainer.clientWidth} ${plotContainer.clientHeight}`)
            .append("g").attr("transform", `translate(${margin.left},${margin.top})`);

        x = d3.scaleLinear().domain([-10, 10]).range([0, width]);
        y = d3.scaleLinear().domain([-10, 10]).range([height, 0]);

        // Grid
        svg.append("g").attr("class", "grid-line").call(d3.axisBottom(x).ticks(10).tickSize(height).tickFormat(""));
        svg.append("g").attr("class", "grid-line").call(d3.axisLeft(y).ticks(10).tickSize(-width).tickFormat(""));

        // Axes
        svg.append("g").attr("class", "axis").attr("transform", `translate(0,${height/2})`).call(d3.axisBottom(x).ticks(5));
        svg.append("g").attr("class", "axis").attr("transform", `translate(${width/2},0)`).call(d3.axisLeft(y).ticks(5));

        // Layers
        svg.append("path").attr("class", "set-a")
            .attr("fill", "rgba(124, 197, 255, 0.3)").attr("stroke", "var(--color-primary)").attr("stroke-width", 2);

        svg.append("path").attr("class", "set-b")
            .attr("fill", "rgba(128, 255, 176, 0.3)").attr("stroke", "var(--color-accent)").attr("stroke-width", 2);

        svg.append("path").attr("class", "result-set")
            .attr("fill", "rgba(255, 107, 107, 0.5)").attr("stroke", "#ff6b6b").attr("stroke-width", 3).attr("stroke-dasharray", "4 2");
    }

    function update() {
        const op = opSelect.value;
        const scale = parseFloat(scaleSlider.value);

        // Affine mode
        const isAffine = op === "affine";
        transformControls.style.visibility = isAffine ? "visible" : "hidden";

        const line = d3.line().x(d => x(d[0])).y(d => y(d[1]));

        // Draw Set A
        let currentA = setA;
        if (isAffine) {
             // Apply scale
             currentA = setA.map(p => [p[0]*scale, p[1]*scale]);
             svg.select(".set-a").datum(currentA).attr("d", line(currentA) + "Z");
             svg.select(".set-b").attr("display", "none"); // Hide B for affine on A

             const result = currentA; // Just showing transformed A
             svg.select(".result-set").datum(result).attr("d", line(result) + "Z");
             statusOutput.textContent = `Affine transform f(x) = ${scale}x preserves convexity.`;
        } else {
             svg.select(".set-a").datum(setA).attr("d", line(setA) + "Z");
             svg.select(".set-b").attr("display", null).datum(setB).attr("d", line(setB) + "Z");

             let result = [];
             let message = "";

             if (op === "intersection") {
                 result = clipPolygon(setA, setB); // Order matters for clipper but intersection is symmetric
                 // If result empty try B clip A
                 if(!result || result.length < 3) result = clipPolygon(setB, setA);

                 message = "Intersection of convex sets is convex.";
             } else if (op === "union") {
                 // Union is not convex, but Hull(Union) is.
                 // We show Hull.
                 const combined = [...setA, ...setB];
                 result = d3.polygonHull(combined);
                 message = "Union is NOT convex. Convex Hull(A ∪ B) is shown (dashed).";
             } else if (op === "minkowski") {
                 result = minkowskiSum(setA, setB);
                 message = "Minkowski Sum A + B is convex.";
             }

             if (result && result.length > 2) {
                 svg.select(".result-set").datum(result).attr("d", line(result) + "Z");
             } else {
                 svg.select(".result-set").attr("d", null);
                 if(op === "intersection") message += " (Empty Set)";
             }
             statusOutput.innerHTML = `<span style="color: var(--color-text-main); font-weight: bold;">${message}</span>`;
        }
    }

    opSelect.addEventListener("change", update);
    scaleSlider.addEventListener("input", update);

    new ResizeObserver(setupChart).observe(plotContainer);
    setupChart();
    update();
}
