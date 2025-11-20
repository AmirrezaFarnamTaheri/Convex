/**
 * Widget: Operations Preserving Convexity Builder
 *
 * Description: A tool where users can apply operations (intersection, affine transformation, etc.)
 *              to pre-defined convex sets to see the result.
 * Version: 3.0.0
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

// Helper: Sutherland-Hodgman Clipping
function clipPolygon(subjectPolygon, clipPolygon) {
    let output = subjectPolygon;
    if(!clipPolygon || clipPolygon.length < 3) return [];

    const cp = [...clipPolygon];

    for(let j=0; j<cp.length; j++) {
        const edgeStart = cp[j];
        const edgeEnd = cp[(j+1)%cp.length];
        const input = output;
        output = [];

        if(input.length === 0) break;

        const isInside = (p) => {
            return (edgeEnd[0]-edgeStart[0])*(p[1]-edgeStart[1]) - (edgeEnd[1]-edgeStart[1])*(p[0]-edgeStart[0]) >= 0; // CCW
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
                        <option value="union">Union (Hull(A ∪ B))</option>
                        <option value="minkowski">Minkowski Sum (A + B)</option>
                        <option value="affine">Affine Map f(A)</option>
                    </select>
                </div>
                <div class="widget-control-group" id="transform-controls" style="flex: 1; display:none;">
                    <label class="widget-label">Scaling Factor</label>
                    <input type="range" id="scale-slider" min="0.5" max="2" step="0.1" value="1" class="widget-slider">
                </div>
            </div>
            <div id="status-output" class="widget-output" style="min-height: 60px; display: flex; align-items: center; justify-content: center; text-align: center;"></div>
        </div>
    `;

    const plotContainer = container.querySelector("#plot-container");
    const opSelect = container.querySelector("#op-select");
    const scaleSlider = container.querySelector("#scale-slider");
    const transformControls = container.querySelector("#transform-controls");
    const statusOutput = container.querySelector("#status-output");

    let svg, x, y;

    // Sets
    const setA = [[-2, -2], [2, -2], [2, 2], [-2, 2]]; // Square centered at 0
    // Set B: Triangle offset
    const setB = [[1, 1], [5, 1], [3, 5]];

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

        x = d3.scaleLinear().domain([-8, 8]).range([0, width]);
        y = d3.scaleLinear().domain([-8, 8]).range([height, 0]);

        // Grid
        svg.append("g").attr("class", "grid-line").call(d3.axisBottom(x).ticks(10).tickSize(height).tickFormat("")).attr("transform", `translate(0,0)`);
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
            .attr("fill", "rgba(255, 107, 107, 0.4)").attr("stroke", "var(--color-error)").attr("stroke-width", 3).attr("stroke-dasharray", "4 2");

        // Labels
        svg.append("text").attr("class", "label-a").attr("fill", "var(--color-primary)").style("font-weight", "bold").text("A");
        svg.append("text").attr("class", "label-b").attr("fill", "var(--color-accent)").style("font-weight", "bold").text("B");
    }

    function update() {
        const op = opSelect.value;
        const scale = parseFloat(scaleSlider.value);

        const isAffine = op === "affine";
        transformControls.style.display = isAffine ? "block" : "none";

        const line = d3.line().x(d => x(d[0])).y(d => y(d[1])).curve(d3.curveLinearClosed);

        let currentA = setA;
        let currentB = setB;

        if (isAffine) {
             // Apply scale to A
             currentA = setA.map(p => [p[0]*scale, p[1]*scale]);
             svg.select(".set-a").datum(currentA).attr("d", line(currentA));
             svg.select(".set-b").attr("display", "none");
             svg.select(".label-b").attr("display", "none");

             const result = currentA; // Result is just transformed A
             svg.select(".result-set").attr("display", "none"); // Same as A

             // Show label
             const cA = d3.polygonCentroid(currentA);
             svg.select(".label-a").attr("x", x(cA[0])).attr("y", y(cA[1])).text("f(A)");

             statusOutput.innerHTML = `
                <div>
                    <div style="color: var(--color-primary); font-weight: bold;">Affine Transformation</div>
                    <div style="font-size: 0.9rem; margin-top: 4px;">
                        f(x) = ${scale}x maps convex set A to convex set f(A).
                    </div>
                </div>
             `;
        } else {
             svg.select(".set-a").datum(setA).attr("d", line(setA));
             svg.select(".set-b").attr("display", null).datum(setB).attr("d", line(setB));
             svg.select(".label-b").attr("display", null);
             svg.select(".result-set").attr("display", null);

             const cA = d3.polygonCentroid(setA);
             svg.select(".label-a").attr("x", x(cA[0])).attr("y", y(cA[1])).text("A");
             const cB = d3.polygonCentroid(setB);
             svg.select(".label-b").attr("x", x(cB[0])).attr("y", y(cB[1])).text("B");

             let result = [];
             let message = "";

             if (op === "intersection") {
                 result = clipPolygon(setA, setB);
                 if(!result || result.length < 3) result = clipPolygon(setB, setA); // Try other order if clipping failed

                 message = `
                    <div style="color: var(--color-error); font-weight: bold;">Intersection A ∩ B</div>
                    <div style="font-size: 0.9rem; margin-top: 4px;">
                        The intersection of any number of convex sets is convex.
                    </div>
                 `;
             } else if (op === "union") {
                 const combined = [...setA, ...setB];
                 result = d3.polygonHull(combined);
                 message = `
                    <div style="color: var(--color-error); font-weight: bold;">Convex Hull of Union</div>
                    <div style="font-size: 0.9rem; margin-top: 4px;">
                        A ∪ B is NOT convex. The smallest convex set containing A ∪ B is its hull (shown in red).
                    </div>
                 `;
             } else if (op === "minkowski") {
                 result = minkowskiSum(setA, setB);
                 message = `
                    <div style="color: var(--color-error); font-weight: bold;">Minkowski Sum A + B</div>
                    <div style="font-size: 0.9rem; margin-top: 4px;">
                        The sum {a + b | a∈A, b∈B} is always convex.
                    </div>
                 `;
             }

             if (result && result.length > 2) {
                 svg.select(".result-set").datum(result).attr("d", line(result));
             } else {
                 svg.select(".result-set").attr("d", null);
                 if(op === "intersection") message += " (Empty)";
             }
             statusOutput.innerHTML = message;
        }
    }

    opSelect.addEventListener("change", update);
    scaleSlider.addEventListener("input", update);

    new ResizeObserver(setupChart).observe(plotContainer);
    setupChart();
    update();
}
