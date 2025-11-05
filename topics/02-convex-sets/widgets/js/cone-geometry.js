import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import {
    createModernWidget,
    createTabs,
    createSelect,
    createSlider,
    addModernAxes,
    makeDraggable,
    formatValue
} from '/static/js/modern-components.js';

export function initConeGeometry(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const { viz: vizContainer } = createModernWidget(container, 'Cone Geometry');

    // Cone types with their definitions
    const coneTypes = [
        {
            label: "Norm Cone (2D)",
            description: "{ (x, t) : ||x|| ≤ t }",
            type: "2d",
            draw: (svg, xScale, yScale, width, height) => draw2DNormCone(svg, xScale, yScale, width, height)
        },
        {
            label: "Second-Order Cone (Lorentz Cone)",
            description: "{ (x, t) : ||x||₂ ≤ t }",
            type: "2d",
            draw: (svg, xScale, yScale, width, height) => draw2DSecondOrderCone(svg, xScale, yScale, width, height)
        },
        {
            label: "Positive Orthant",
            description: "ℝ₊ⁿ = { x : x ≥ 0 }",
            type: "2d",
            draw: (svg, xScale, yScale, width, height) => drawPositiveOrthant(svg, xScale, yScale, width, height)
        },
        {
            label: "Normal Cone",
            description: "Nₓ = { g : gᵀ(y-x) ≤ 0, ∀y ∈ C }",
            type: "2d",
            draw: (svg, xScale, yScale, width, height) => drawNormalCone(svg, xScale, yScale, width, height)
        }
    ];

    let currentCone = coneTypes[0];

    // Create tabs
    const tabs = createTabs(container, ['Interactive', 'Properties', 'Theory']);

    // Tab 1: Interactive visualization
    const width = vizContainer.clientWidth || 800;
    const height = 500;
    const margin = { top: 20, right: 20, bottom: 50, left: 60 };

    const svg = d3.select(vizContainer)
        .append("svg")
        .attr("width", "100%")
        .attr("height", height)
        .attr("viewBox", `0 0 ${width} ${height}`);

    const g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;

    const xScale = d3.scaleLinear().range([0, plotWidth]).domain([-5, 5]);
    const yScale = d3.scaleLinear().range([plotHeight, 0]).domain([-1, 10]);

    const { xAxis: xAxisG, yAxis: yAxisG } = addModernAxes(g, xScale, yScale, plotWidth, plotHeight, "x", "t");

    // Clip path for the plot area
    g.append("defs").append("clipPath")
        .attr("id", "plot-clip")
        .append("rect")
        .attr("width", plotWidth)
        .attr("height", plotHeight);

    const plotGroup = g.append("g")
        .attr("clip-path", "url(#plot-clip)");

    // Controls
    const controlsDiv = tabs[0].appendChild(document.createElement('div'));
    controlsDiv.className = 'modern-controls-panel';
    controlsDiv.style.marginTop = '20px';

    const coneSelect = createSelect(controlsDiv, 'Cone Type',
        coneTypes.map((c, i) => ({ value: i, label: c.label })));

    const descriptionDiv = document.createElement('div');
    descriptionDiv.className = 'formula-block';
    descriptionDiv.style.marginTop = '10px';
    controlsDiv.appendChild(descriptionDiv);

    coneSelect.addEventListener('change', (e) => {
        currentCone = coneTypes[parseInt(e.target.value)];
        updateVisualization();
    });

    function draw2DNormCone(svg, xScale, yScale, width, height) {
        // Draw norm cone: { (x, t) : |x| ≤ t }
        plotGroup.selectAll("*").remove();

        const points = [
            { x: -5, y: 5 },
            { x: 0, y: 0 },
            { x: 5, y: 5 }
        ];

        const area = d3.area()
            .x(d => xScale(d.x))
            .y0(yScale(0))
            .y1(d => yScale(d.y));

        plotGroup.append("path")
            .datum(points)
            .attr("fill", "rgba(77, 171, 247, 0.3)")
            .attr("stroke", "#4dabf7")
            .attr("stroke-width", 3)
            .attr("d", d3.line()
                .x(d => xScale(d.x))
                .y(d => yScale(d.y)));

        // Add fill
        plotGroup.append("path")
            .datum([
                { x: -5, y: 5 },
                { x: 0, y: 0 },
                { x: 5, y: 5 },
                { x: 5, y: 10 },
                { x: -5, y: 10 }
            ])
            .attr("fill", "rgba(77, 171, 247, 0.2)")
            .attr("d", d3.line()
                .x(d => xScale(d.x))
                .y(d => yScale(d.y)));

        // Add sample point
        const sampleX = 2, sampleT = 3;
        const inCone = Math.abs(sampleX) <= sampleT;

        plotGroup.append("circle")
            .attr("cx", xScale(sampleX))
            .attr("cy", yScale(sampleT))
            .attr("r", 6)
            .attr("fill", inCone ? "#51cf66" : "#ff6b6b")
            .attr("stroke", "white")
            .attr("stroke-width", 2);

        plotGroup.append("text")
            .attr("x", xScale(sampleX) + 10)
            .attr("y", yScale(sampleT) - 10)
            .attr("fill", inCone ? "#51cf66" : "#ff6b6b")
            .attr("font-weight", "bold")
            .text(`(${formatValue(sampleX)}, ${formatValue(sampleT)}): ${inCone ? "In Cone" : "Not in Cone"}`);

        return `The norm cone in 2D: |x| ≤ t. All points above the V-shape are in the cone.`;
    }

    function draw2DSecondOrderCone(svg, xScale, yScale, width, height) {
        plotGroup.selectAll("*").remove();

        // Second-order cone (same as norm cone in 2D for L2 norm)
        const numPoints = 100;
        const points = [];
        for (let t = 0; t <= 10; t += 0.1) {
            points.push({ x: -t, y: t });
        }
        for (let t = 10; t >= 0; t -= 0.1) {
            points.push({ x: t, y: t });
        }

        plotGroup.append("path")
            .datum(points)
            .attr("fill", "rgba(77, 171, 247, 0.3)")
            .attr("stroke", "#4dabf7")
            .attr("stroke-width", 3)
            .attr("d", d3.line()
                .x(d => xScale(d.x))
                .y(d => yScale(d.y)));

        // Boundary lines
        const line = d3.line()
            .x(d => xScale(d.x))
            .y(d => yScale(d.y));

        plotGroup.append("path")
            .datum([{ x: 0, y: 0 }, { x: 5, y: 5 }])
            .attr("fill", "none")
            .attr("stroke", "#4dabf7")
            .attr("stroke-width", 3)
            .attr("d", line);

        plotGroup.append("path")
            .datum([{ x: 0, y: 0 }, { x: -5, y: 5 }])
            .attr("fill", "none")
            .attr("stroke", "#4dabf7")
            .attr("stroke-width", 3)
            .attr("d", line);

        return `The second-order (Lorentz) cone: ||x||₂ ≤ t. Critical in second-order cone programming (SOCP).`;
    }

    function drawPositiveOrthant(svg, xScale, yScale, width, height) {
        plotGroup.selectAll("*").remove();

        // Positive orthant: x ≥ 0, y ≥ 0
        plotGroup.append("rect")
            .attr("x", xScale(0))
            .attr("y", yScale(10))
            .attr("width", xScale(5) - xScale(0))
            .attr("height", yScale(0) - yScale(10))
            .attr("fill", "rgba(77, 171, 247, 0.3)")
            .attr("stroke", "#4dabf7")
            .attr("stroke-width", 3);

        // Axes (special emphasis on positive quadrant)
        plotGroup.append("line")
            .attr("x1", xScale(0))
            .attr("y1", yScale(0))
            .attr("x2", xScale(5))
            .attr("y2", yScale(0))
            .attr("stroke", "#4dabf7")
            .attr("stroke-width", 4);

        plotGroup.append("line")
            .attr("x1", xScale(0))
            .attr("y1", yScale(0))
            .attr("x2", xScale(0))
            .attr("y2", yScale(10))
            .attr("stroke", "#4dabf7")
            .attr("stroke-width", 4);

        // Sample points
        const samples = [
            { x: 2, y: 3, in: true },
            { x: -1, y: 2, in: false },
            { x: 3, y: -1, in: false }
        ];

        samples.forEach(s => {
            plotGroup.append("circle")
                .attr("cx", xScale(s.x))
                .attr("cy", yScale(s.y))
                .attr("r", 6)
                .attr("fill", s.in ? "#51cf66" : "#ff6b6b")
                .attr("stroke", "white")
                .attr("stroke-width", 2);
        });

        return `The positive orthant: all components non-negative. Simplest cone, used in LP constraints.`;
    }

    function drawNormalCone(svg, xScale, yScale, width, height) {
        plotGroup.selectAll("*").remove();

        // Draw a convex set (circle)
        const centerX = 0, centerY = 5, radius = 2;
        const boundaryPoint = { x: centerX + radius * Math.cos(Math.PI / 4), y: centerY + radius * Math.sin(Math.PI / 4) };

        plotGroup.append("circle")
            .attr("cx", xScale(centerX))
            .attr("cy", yScale(centerY))
            .attr("r", xScale(radius) - xScale(0))
            .attr("fill", "rgba(200, 200, 200, 0.3)")
            .attr("stroke", "#666")
            .attr("stroke-width", 2);

        // Normal cone at boundary point (half-space)
        const normal = { x: Math.cos(Math.PI / 4), y: Math.sin(Math.PI / 4) };
        const coneAngle = Math.atan2(normal.y, normal.x);

        // Draw normal cone as a filled region
        const conePoints = [];
        const angleRange = Math.PI; // 180 degrees
        for (let angle = coneAngle - angleRange / 2; angle <= coneAngle + angleRange / 2; angle += 0.1) {
            conePoints.push({
                x: boundaryPoint.x + 5 * Math.cos(angle),
                y: boundaryPoint.y + 5 * Math.sin(angle)
            });
        }
        conePoints.push(boundaryPoint);

        plotGroup.append("path")
            .datum(conePoints)
            .attr("fill", "rgba(77, 171, 247, 0.3)")
            .attr("stroke", "#4dabf7")
            .attr("stroke-width", 2)
            .attr("d", d3.line()
                .x(d => xScale(d.x))
                .y(d => yScale(d.y)));

        // Normal vector
        plotGroup.append("line")
            .attr("x1", xScale(boundaryPoint.x))
            .attr("y1", yScale(boundaryPoint.y))
            .attr("x2", xScale(boundaryPoint.x + 2 * normal.x))
            .attr("y2", yScale(boundaryPoint.y + 2 * normal.y))
            .attr("stroke", "#ff6b6b")
            .attr("stroke-width", 3)
            .attr("marker-end", "url(#arrowhead)");

        // Arrowhead
        svg.append("defs").append("marker")
            .attr("id", "arrowhead")
            .attr("markerWidth", 10)
            .attr("markerHeight", 10)
            .attr("refX", 5)
            .attr("refY", 3)
            .attr("orient", "auto")
            .append("polygon")
            .attr("points", "0 0, 10 3, 0 6")
            .attr("fill", "#ff6b6b");

        return `Normal cone at a boundary point: all vectors forming obtuse angles with feasible directions.`;
    }

    // Tab 2: Properties
    tabs[1].innerHTML = `
        <div style="padding: 20px; max-width: 800px;">
            <h3>Cone Properties</h3>

            <div class="formula-block">
                <strong>Definition:</strong> A set K is a <em>cone</em> if for all x ∈ K and θ ≥ 0, we have θx ∈ K.
            </div>

            <div class="formula-block">
                <strong>Common Cones in Optimization:</strong>
                <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                    <tr style="background: #f8f9fa;">
                        <td style="padding: 8px; border: 1px solid #dee2e6;"><strong>Cone</strong></td>
                        <td style="padding: 8px; border: 1px solid #dee2e6;"><strong>Definition</strong></td>
                        <td style="padding: 8px; border: 1px solid #dee2e6;"><strong>Application</strong></td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #dee2e6;">Positive Orthant</td>
                        <td style="padding: 8px; border: 1px solid #dee2e6;">ℝ₊ⁿ = { x : x ≥ 0 }</td>
                        <td style="padding: 8px; border: 1px solid #dee2e6;">Linear Programming</td>
                    </tr>
                    <tr style="background: #f8f9fa;">
                        <td style="padding: 8px; border: 1px solid #dee2e6;">Second-Order Cone</td>
                        <td style="padding: 8px; border: 1px solid #dee2e6;">{ (x,t) : ||x||₂ ≤ t }</td>
                        <td style="padding: 8px; border: 1px solid #dee2e6;">SOCP, Robust Opt</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #dee2e6;">PSD Cone</td>
                        <td style="padding: 8px; border: 1px solid #dee2e6;">S₊ⁿ = { X : X ⪰ 0 }</td>
                        <td style="padding: 8px; border: 1px solid #dee2e6;">SDP, Control</td>
                    </tr>
                    <tr style="background: #f8f9fa;">
                        <td style="padding: 8px; border: 1px solid #dee2e6;">Normal Cone</td>
                        <td style="padding: 8px; border: 1px solid #dee2e6;">Nₖ(x) = { g : gᵀ(y-x) ≤ 0, ∀y∈K }</td>
                        <td style="padding: 8px; border: 1px solid #dee2e6;">Optimality Cond</td>
                    </tr>
                </table>
            </div>

            <div class="formula-block">
                <strong>Convex Cone:</strong>
                <p>A cone K is <em>convex</em> if it's also convex as a set:</p>
                <ul>
                    <li>∀x, y ∈ K, ∀θ ∈ [0,1]: θx + (1-θ)y ∈ K</li>
                </ul>
                <p>All cones shown in this widget are convex cones.</p>
            </div>

            <div class="formula-block">
                <strong>Dual Cone:</strong>
                <p>The dual of cone K is: K* = { y : xᵀy ≥ 0, ∀x ∈ K }</p>
                <p><strong>Examples:</strong></p>
                <ul>
                    <li>ℝ₊ⁿ is self-dual: (ℝ₊ⁿ)* = ℝ₊ⁿ</li>
                    <li>Second-order cone is self-dual</li>
                    <li>PSD cone is self-dual: (S₊ⁿ)* = S₊ⁿ</li>
                </ul>
            </div>

            <div class="formula-block">
                <strong>Importance in Optimization:</strong>
                <ul>
                    <li><strong>Conic Programming:</strong> min cᵀx s.t. Ax = b, x ∈ K</li>
                    <li><strong>Duality:</strong> Dual cones appear in dual problems</li>
                    <li><strong>Optimality:</strong> Normal cone characterizes optimal points</li>
                    <li><strong>Generalization:</strong> LP → SOCP → SDP (increasing generality via cones)</li>
                </ul>
            </div>
        </div>
    `;

    // Tab 3: Theory
    tabs[2].innerHTML = `
        <div style="padding: 20px; max-width: 800px;">
            <h3>Cone Theory</h3>

            <div class="formula-block">
                <strong>Formal Definition:</strong>
                <p>A set K ⊆ ℝⁿ is a <em>cone</em> if:</p>
                <div style="margin: 10px 0; padding: 15px; background: #f8f9fa; border-radius: 8px; text-align: center;">
                    ∀x ∈ K, ∀θ ≥ 0: θx ∈ K
                </div>
                <p>Interpretation: Scaling any point in K by a non-negative factor stays in K.</p>
            </div>

            <div class="formula-block">
                <strong>Pointed Cone:</strong>
                <p>A cone K is <em>pointed</em> if K ∩ (-K) = {0}.</p>
                <p>Pointed cones don't contain any lines. All cones used in optimization are pointed.</p>
            </div>

            <div class="formula-block">
                <strong>Conic Combination:</strong>
                <p>A <em>conic combination</em> of x₁, ..., xₖ is:</p>
                <div style="margin: 10px 0; padding: 15px; background: #f8f9fa; border-radius: 8px; text-align: center;">
                    θ₁x₁ + ... + θₖxₖ where θᵢ ≥ 0
                </div>
                <p>The <em>conic hull</em> is the set of all conic combinations.</p>
            </div>

            <div class="formula-block">
                <strong>Proper Cone:</strong>
                <p>A cone K is <em>proper</em> if it is:</p>
                <ul>
                    <li><strong>Convex:</strong> θx + (1-θ)y ∈ K for x,y ∈ K, θ ∈ [0,1]</li>
                    <li><strong>Closed:</strong> Contains its boundary</li>
                    <li><strong>Solid:</strong> Has nonempty interior</li>
                    <li><strong>Pointed:</strong> K ∩ (-K) = {0}</li>
                </ul>
                <p>Proper cones are used to define generalized inequalities: x ⪯_K y ⟺ y - x ∈ K</p>
            </div>

            <div class="formula-block">
                <strong>Generalized Inequalities:</strong>
                <p>A proper cone K induces a partial ordering on ℝⁿ:</p>
                <ul>
                    <li><strong>x ⪯_K y</strong> if y - x ∈ K</li>
                    <li><strong>x ≺_K y</strong> if y - x ∈ int(K) (interior of K)</li>
                </ul>
                <p><strong>Examples:</strong></p>
                <ul>
                    <li>K = ℝ₊ⁿ: x ⪯_K y means x ≤ y componentwise</li>
                    <li>K = S₊ⁿ: X ⪯_K Y means Y - X ⪰ 0 (PSD)</li>
                </ul>
            </div>

            <div class="formula-block">
                <strong>Separation Theorem for Cones:</strong>
                <p>For a closed convex cone K and point x ∉ K, there exists y such that:</p>
                <div style="margin: 10px 0; padding: 15px; background: #f8f9fa; border-radius: 8px; text-align: center;">
                    yᵀx < 0 and yᵀz ≥ 0 ∀z ∈ K
                </div>
                <p>This means y separates x from K.</p>
            </div>

            <div class="formula-block">
                <strong>Conic Programming:</strong>
                <p>Optimization over cones generalizes LP, SOCP, and SDP:</p>
                <div style="margin: 10px 0; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                    minimize cᵀx<br>
                    subject to Ax = b<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;x ∈ K
                </div>
                <p>where K is a proper cone.</p>
                <ul>
                    <li>K = ℝ₊ⁿ → Linear Programming</li>
                    <li>K = Second-order cone → SOCP</li>
                    <li>K = S₊ⁿ → Semidefinite Programming</li>
                </ul>
            </div>

            <div class="formula-block">
                <strong>Normal Cone and Optimality:</strong>
                <p>The normal cone at x ∈ K is:</p>
                <div style="margin: 10px 0; padding: 15px; background: #f8f9fa; border-radius: 8px; text-align: center;">
                    N_K(x) = { g : gᵀ(y - x) ≤ 0, ∀y ∈ K }
                </div>
                <p><strong>Optimality Condition:</strong> x* minimizes f over K iff:</p>
                <div style="margin: 10px 0; padding: 15px; background: #f8f9fa; border-radius: 8px; text-align: center;">
                    -∇f(x*) ∈ N_K(x*)
                </div>
                <p>This generalizes ∇f(x*) = 0 for unconstrained problems.</p>
            </div>
        </div>
    `;

    function updateVisualization() {
        const description = currentCone.draw(plotGroup, xScale, yScale, plotWidth, plotHeight);
        descriptionDiv.innerHTML = `<p style="margin: 5px 0;"><strong>${currentCone.label}:</strong> ${description}</p>`;
    }

    // Initial render
    updateVisualization();
}
