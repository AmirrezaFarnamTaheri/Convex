import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import {
    createModernWidget,
    createTabs,
    createSelect,
    createSlider,
    createButton,
    showStatus,
    addModernAxes,
    formatValue
} from '/static/js/modern-components.js';

export function initOperationsBuilder(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const { viz: vizContainer } = createModernWidget(container, 'Operations Preserving Convexity');

    // Preset sets
    const presetSets = [
        {
            name: "Circle & Square",
            set1: d3.range(0, 2 * Math.PI, 0.2).map(a => [2.5 * Math.cos(a), 2.5 * Math.sin(a)]),
            set2: [[-3, -3], [3, -3], [3, 3], [-3, 3]]
        },
        {
            name: "Two Circles",
            set1: d3.range(0, 2 * Math.PI, 0.2).map(a => [2 * Math.cos(a) - 2, 2 * Math.sin(a)]),
            set2: d3.range(0, 2 * Math.PI, 0.2).map(a => [2 * Math.cos(a) + 2, 2 * Math.sin(a)])
        },
        {
            name: "Ellipse & Rectangle",
            set1: d3.range(0, 2 * Math.PI, 0.2).map(a => [3 * Math.cos(a), 1.5 * Math.sin(a)]),
            set2: [[-2, -2.5], [2, -2.5], [2, 2.5], [-2, 2.5]]
        },
        {
            name: "Triangle & Hexagon",
            set1: [[0, 3], [-2.6, -1.5], [2.6, -1.5]],
            set2: d3.range(0, 2 * Math.PI, Math.PI / 3).map(a => [2 * Math.cos(a), 2 * Math.sin(a)])
        }
    ];

    let set1 = [...presetSets[0].set1];
    let set2 = [...presetSets[0].set2];

    // Affine transformation parameters
    let affineParams = {
        a11: 1.2, a12: 0.3,
        a21: -0.2, a22: 1.1,
        b1: 1, b2: 0.5
    };

    // Create tabs
    const tabs = createTabs(container, ['Interactive', 'Operations', 'Theory']);

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

    const xScale = d3.scaleLinear().range([0, plotWidth]).domain([-8, 8]);
    const yScale = d3.scaleLinear().range([plotHeight, 0]).domain([-8, 8]);

    const { xAxis: xAxisG, yAxis: yAxisG } = addModernAxes(g, xScale, yScale, plotWidth, plotHeight, "x", "y");

    // Create paths
    const set1Path = g.append("path")
        .attr("fill", "rgba(77, 171, 247, 0.3)")
        .attr("stroke", "#4dabf7")
        .attr("stroke-width", 2);

    const set2Path = g.append("path")
        .attr("fill", "rgba(255, 107, 107, 0.3)")
        .attr("stroke", "#ff6b6b")
        .attr("stroke-width", 2);

    const resultPath = g.append("path")
        .attr("fill", "rgba(81, 207, 102, 0.4)")
        .attr("stroke", "#51cf66")
        .attr("stroke-width", 3);

    // Legend
    const legend = g.append("g")
        .attr("transform", `translate(${plotWidth - 150}, 10)`);

    legend.append("rect").attr("x", 0).attr("y", 0).attr("width", 15).attr("height", 15)
        .attr("fill", "rgba(77, 171, 247, 0.3)").attr("stroke", "#4dabf7");
    legend.append("text").attr("x", 20).attr("y", 12).text("Set 1").attr("font-size", "12px");

    legend.append("rect").attr("x", 0).attr("y", 20).attr("width", 15).attr("height", 15)
        .attr("fill", "rgba(255, 107, 107, 0.3)").attr("stroke", "#ff6b6b");
    legend.append("text").attr("x", 20).attr("y", 32).text("Set 2").attr("font-size", "12px");

    legend.append("rect").attr("x", 0).attr("y", 40).attr("width", 15).attr("height", 15)
        .attr("fill", "rgba(81, 207, 102, 0.4)").attr("stroke", "#51cf66");
    legend.append("text").attr("x", 20).attr("y", 52).text("Result").attr("font-size", "12px");

    // Controls
    const controlsDiv = tabs[0].appendChild(document.createElement('div'));
    controlsDiv.className = 'modern-controls-panel';
    controlsDiv.style.marginTop = '20px';

    const operationSelect = createSelect(controlsDiv, 'Operation',
        [
            { value: 'intersection', label: 'Intersection (C₁ ∩ C₂)' },
            { value: 'affine', label: 'Affine Transformation' },
            { value: 'scaling', label: 'Scaling (αC₁)' },
            { value: 'sum', label: 'Minkowski Sum (C₁ + C₂)' }
        ]);

    const presetSelect = createSelect(controlsDiv, 'Preset Sets',
        presetSets.map((p, i) => ({ value: i, label: p.name })));

    const statusDiv = document.createElement('div');
    statusDiv.className = 'formula-block';
    statusDiv.style.marginTop = '10px';
    controlsDiv.appendChild(statusDiv);

    // Affine transformation controls (hidden initially)
    const affineControlsDiv = document.createElement('div');
    affineControlsDiv.style.display = 'none';
    affineControlsDiv.style.marginTop = '10px';
    controlsDiv.appendChild(affineControlsDiv);

    affineControlsDiv.innerHTML = `
        <div style="padding: 10px; background: #f8f9fa; border-radius: 8px;">
            <h4>Affine Transform: y = Ax + b</h4>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                <div><label>a₁₁: <input type="number" id="a11" value="1.2" step="0.1" style="width: 60px;"></label></div>
                <div><label>a₁₂: <input type="number" id="a12" value="0.3" step="0.1" style="width: 60px;"></label></div>
                <div><label>a₂₁: <input type="number" id="a21" value="-0.2" step="0.1" style="width: 60px;"></label></div>
                <div><label>a₂₂: <input type="number" id="a22" value="1.1" step="0.1" style="width: 60px;"></label></div>
                <div><label>b₁: <input type="number" id="b1" value="1" step="0.1" style="width: 60px;"></label></div>
                <div><label>b₂: <input type="number" id="b2" value="0.5" step="0.1" style="width: 60px;"></label></div>
            </div>
        </div>
    `;

    // Scaling controls (hidden initially)
    const scalingDiv = document.createElement('div');
    scalingDiv.style.display = 'none';
    scalingDiv.style.marginTop = '10px';
    controlsDiv.appendChild(scalingDiv);

    const alphaSlider = createSlider(scalingDiv, 'Scaling Factor (α)', 0.1, 3, 0.1, 1.5, updateVisualization);

    presetSelect.addEventListener('change', (e) => {
        const preset = presetSets[parseInt(e.target.value)];
        set1 = [...preset.set1];
        set2 = [...preset.set2];
        updateVisualization();
    });

    operationSelect.addEventListener('change', (e) => {
        affineControlsDiv.style.display = e.target.value === 'affine' ? 'block' : 'none';
        scalingDiv.style.display = e.target.value === 'scaling' ? 'block' : 'none';
        updateVisualization();
    });

    // Affine parameter inputs
    ['a11', 'a12', 'a21', 'a22', 'b1', 'b2'].forEach(id => {
        const input = affineControlsDiv.querySelector(`#${id}`);
        if (input) {
            input.addEventListener('input', () => {
                affineParams[id] = parseFloat(input.value) || 0;
                updateVisualization();
            });
        }
    });

    // Tab 2: Operations
    tabs[1].innerHTML = `
        <div style="padding: 20px; max-width: 800px;">
            <h3>Operations Preserving Convexity</h3>

            <div class="formula-block">
                <strong>Theorem:</strong> The following operations preserve convexity:
                <p>If C₁ and C₂ are convex sets, then:</p>
            </div>

            <div class="formula-block">
                <strong>1. Intersection:</strong>
                <div style="margin: 10px 0; padding: 15px; background: #f8f9fa; border-radius: 8px; text-align: center;">
                    C₁ ∩ C₂ is convex
                </div>
                <p><strong>Proof:</strong> Let x, y ∈ C₁ ∩ C₂ and θ ∈ [0,1]. Then:</p>
                <ul>
                    <li>x, y ∈ C₁ ⟹ θx + (1-θ)y ∈ C₁ (C₁ is convex)</li>
                    <li>x, y ∈ C₂ ⟹ θx + (1-θ)y ∈ C₂ (C₂ is convex)</li>
                    <li>Therefore: θx + (1-θ)y ∈ C₁ ∩ C₂</li>
                </ul>
                <p><strong>Note:</strong> This extends to arbitrary intersections! ∩ᵢCᵢ is convex if all Cᵢ are convex.</p>
            </div>

            <div class="formula-block">
                <strong>2. Affine Transformation:</strong>
                <div style="margin: 10px 0; padding: 15px; background: #f8f9fa; border-radius: 8px; text-align: center;">
                    If C is convex, then f(C) = {Ax + b : x ∈ C} is convex
                </div>
                <p><strong>Proof:</strong> Let y₁ = Ax₁ + b, y₂ = Ax₂ + b where x₁, x₂ ∈ C. Then:</p>
                <ul>
                    <li>θy₁ + (1-θ)y₂ = θ(Ax₁ + b) + (1-θ)(Ax₂ + b)</li>
                    <li>= A(θx₁ + (1-θ)x₂) + b</li>
                    <li>Since C is convex: θx₁ + (1-θ)x₂ ∈ C</li>
                    <li>Therefore: θy₁ + (1-θ)y₂ ∈ f(C)</li>
                </ul>
                <p><strong>Examples:</strong> Scaling, rotation, translation, projection, etc.</p>
            </div>

            <div class="formula-block">
                <strong>3. Scaling:</strong>
                <div style="margin: 10px 0; padding: 15px; background: #f8f9fa; border-radius: 8px; text-align: center;">
                    If C is convex and α ≥ 0, then αC = {αx : x ∈ C} is convex
                </div>
                <p>This is a special case of affine transformation (A = αI, b = 0).</p>
            </div>

            <div class="formula-block">
                <strong>4. Minkowski Sum:</strong>
                <div style="margin: 10px 0; padding: 15px; background: #f8f9fa; border-radius: 8px; text-align: center;">
                    C₁ + C₂ = {x₁ + x₂ : x₁ ∈ C₁, x₂ ∈ C₂} is convex
                </div>
                <p><strong>Proof:</strong> Let y₁ = x₁ + x₂, y₂ = x₁' + x₂'. Then:</p>
                <ul>
                    <li>θy₁ + (1-θ)y₂ = θ(x₁ + x₂) + (1-θ)(x₁' + x₂')</li>
                    <li>= (θx₁ + (1-θ)x₁') + (θx₂ + (1-θ)x₂')</li>
                    <li>Both terms are in C₁ and C₂ respectively (convexity)</li>
                    <li>Therefore: θy₁ + (1-θ)y₂ ∈ C₁ + C₂</li>
                </ul>
            </div>

            <div class="formula-block">
                <strong>Operations that DON'T preserve convexity:</strong>
                <ul>
                    <li><strong>Union:</strong> C₁ ∪ C₂ is generally NOT convex (try two disjoint circles)</li>
                    <li><strong>Set Difference:</strong> C₁ \\ C₂ is generally NOT convex</li>
                    <li><strong>Complement:</strong> C is convex ⇏ Cᶜ is convex</li>
                </ul>
            </div>
        </div>
    `;

    // Tab 3: Theory
    tabs[2].innerHTML = `
        <div style="padding: 20px; max-width: 800px;">
            <h3>Convexity-Preserving Operations Theory</h3>

            <div class="formula-block">
                <strong>Why This Matters:</strong>
                <p>Understanding which operations preserve convexity allows us to:</p>
                <ul>
                    <li><strong>Build Complex Sets:</strong> Construct complicated convex sets from simple ones</li>
                    <li><strong>Verify Convexity:</strong> Prove a set is convex without checking the definition</li>
                    <li><strong>Optimization:</strong> Ensure feasible regions remain convex after transformations</li>
                    <li><strong>Problem Reformulation:</strong> Transform problems while preserving convexity</li>
                </ul>
            </div>

            <div class="formula-block">
                <strong>Perspective and Linear-Fractional Functions:</strong>
                <p>More advanced operations that preserve convexity:</p>
                <ul>
                    <li><strong>Perspective:</strong> If C ⊆ ℝⁿ⁺¹ is convex, then P(C) = {x/t : (x,t) ∈ C, t > 0} is convex</li>
                    <li><strong>Linear-Fractional:</strong> f(x) = (Ax + b)/(cᵀx + d) preserves convexity under certain conditions</li>
                </ul>
            </div>

            <div class="formula-block">
                <strong>Partial Minimum:</strong>
                <p>If f(x, y) is convex in (x, y), then g(x) = infᵧ f(x, y) is convex in x.</p>
                <p>This is powerful for optimization! Taking partial minimums preserves convexity.</p>
            </div>

            <div class="formula-block">
                <strong>Applications in Optimization:</strong>
                <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                    <tr style="background: #f8f9fa;">
                        <td style="padding: 8px; border: 1px solid #dee2e6;"><strong>Problem Type</strong></td>
                        <td style="padding: 8px; border: 1px solid #dee2e6;"><strong>Operation Used</strong></td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #dee2e6;">Linear Programming</td>
                        <td style="padding: 8px; border: 1px solid #dee2e6;">Intersection of half-spaces</td>
                    </tr>
                    <tr style="background: #f8f9fa;">
                        <td style="padding: 8px; border: 1px solid #dee2e6;">Robust Optimization</td>
                        <td style="padding: 8px; border: 1px solid #dee2e6;">Intersection over uncertainty sets</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #dee2e6;">Change of Variables</td>
                        <td style="padding: 8px; border: 1px solid #dee2e6;">Affine transformation</td>
                    </tr>
                    <tr style="background: #f8f9fa;">
                        <td style="padding: 8px; border: 1px solid #dee2e6;">Projection</td>
                        <td style="padding: 8px; border: 1px solid #dee2e6;">Affine transformation (partial minimum)</td>
                    </tr>
                </table>
            </div>

            <div class="formula-block">
                <strong>Generalized Inequalities:</strong>
                <p>For a proper cone K, if f: ℝⁿ → ℝᵐ is K-convex and C is convex, then:</p>
                <div style="margin: 10px 0; padding: 15px; background: #f8f9fa; border-radius: 8px; text-align: center;">
                    {x ∈ C : f(x) ⪯_K 0} is convex
                </div>
                <p>This generalizes the sublevel set property to vector-valued functions!</p>
            </div>

            <div class="formula-block">
                <strong>Proof Strategy:</strong>
                <p>To prove an operation preserves convexity:</p>
                <ol>
                    <li>Take arbitrary x, y in the resulting set</li>
                    <li>Express θx + (1-θ)y using the operation</li>
                    <li>Use convexity of the original set(s)</li>
                    <li>Show the combination is in the resulting set</li>
                </ol>
            </div>

            <div class="formula-block">
                <strong>Important Note on Union:</strong>
                <p>While union doesn't preserve convexity, the <em>convex hull</em> of a union does:</p>
                <div style="margin: 10px 0; padding: 15px; background: #f8f9fa; border-radius: 8px; text-align: center;">
                    conv(C₁ ∪ C₂) is convex
                </div>
                <p>In fact, conv(C₁ ∪ C₂) = {θx₁ + (1-θ)x₂ : x₁ ∈ C₁, x₂ ∈ C₂, θ ∈ [0,1]}</p>
            </div>
        </div>
    `;

    function polygonIntersection(poly1, poly2) {
        // Simple polygon clipping for convex polygons using Sutherland-Hodgman
        let output = [...poly1];

        for (let i = 0; i < poly2.length; i++) {
            if (output.length === 0) break;

            const edge = [poly2[i], poly2[(i + 1) % poly2.length]];
            const input = output;
            output = [];

            for (let j = 0; j < input.length; j++) {
                const current = input[j];
                const next = input[(j + 1) % input.length];

                const currentInside = isLeft(edge, current);
                const nextInside = isLeft(edge, next);

                if (currentInside && nextInside) {
                    output.push(next);
                } else if (currentInside && !nextInside) {
                    const intersection = lineIntersection(current, next, edge[0], edge[1]);
                    if (intersection) output.push(intersection);
                } else if (!currentInside && nextInside) {
                    const intersection = lineIntersection(current, next, edge[0], edge[1]);
                    if (intersection) output.push(intersection);
                    output.push(next);
                }
            }
        }

        return output.length >= 3 ? output : null;
    }

    function isLeft(edge, point) {
        const [p1, p2] = edge;
        return ((p2[0] - p1[0]) * (point[1] - p1[1]) - (p2[1] - p1[1]) * (point[0] - p1[0])) >= 0;
    }

    function lineIntersection(p1, p2, p3, p4) {
        const x1 = p1[0], y1 = p1[1];
        const x2 = p2[0], y2 = p2[1];
        const x3 = p3[0], y3 = p3[1];
        const x4 = p4[0], y4 = p4[1];

        const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
        if (Math.abs(denom) < 1e-10) return null;

        const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;

        return [x1 + t * (x2 - x1), y1 + t * (y2 - y1)];
    }

    function minkowskiSum(poly1, poly2) {
        // Simplified Minkowski sum for convex polygons
        const result = [];
        for (const p1 of poly1) {
            for (const p2 of poly2) {
                result.push([p1[0] + p2[0], p1[1] + p2[1]]);
            }
        }
        return convexHull(result);
    }

    function convexHull(points) {
        // Graham scan
        if (points.length < 3) return points;

        points.sort((a, b) => a[0] === b[0] ? a[1] - b[1] : a[0] - b[0]);

        const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);

        const lower = [];
        for (const p of points) {
            while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) {
                lower.pop();
            }
            lower.push(p);
        }

        const upper = [];
        for (let i = points.length - 1; i >= 0; i--) {
            const p = points[i];
            while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) {
                upper.pop();
            }
            upper.push(p);
        }

        lower.pop();
        upper.pop();
        return lower.concat(upper);
    }

    function updateVisualization() {
        const operation = operationSelect.value;

        const line = d3.line()
            .x(d => xScale(d[0]))
            .y(d => yScale(d[1]));

        // Draw sets
        set1Path.datum(set1).attr("d", line(set1) + "Z");

        let result;
        let statusText = '';

        switch (operation) {
            case 'intersection':
                set2Path.style("display", "block");
                set2Path.datum(set2).attr("d", line(set2) + "Z");

                result = polygonIntersection(set1, set2);
                statusText = `<strong>Intersection:</strong> C₁ ∩ C₂<br>`;
                statusText += result ? `Result has ${result.length} vertices` : 'Empty intersection';
                break;

            case 'affine':
                set2Path.style("display", "none");

                result = set1.map(p => [
                    affineParams.a11 * p[0] + affineParams.a12 * p[1] + affineParams.b1,
                    affineParams.a21 * p[0] + affineParams.a22 * p[1] + affineParams.b2
                ]);
                statusText = `<strong>Affine Transform:</strong> y = Ax + b<br>`;
                statusText += `A = [[${formatValue(affineParams.a11)}, ${formatValue(affineParams.a12)}], [${formatValue(affineParams.a21)}, ${formatValue(affineParams.a22)}]]<br>`;
                statusText += `b = [${formatValue(affineParams.b1)}, ${formatValue(affineParams.b2)}]`;
                break;

            case 'scaling':
                set2Path.style("display", "none");
                const alpha = alphaSlider.getValue();

                result = set1.map(p => [alpha * p[0], alpha * p[1]]);
                statusText = `<strong>Scaling:</strong> αC₁ where α = ${formatValue(alpha)}`;
                break;

            case 'sum':
                set2Path.style("display", "block");
                set2Path.datum(set2).attr("d", line(set2) + "Z");

                result = minkowskiSum(set1, set2);
                statusText = `<strong>Minkowski Sum:</strong> C₁ + C₂<br>`;
                statusText += `Result has ${result.length} vertices`;
                break;
        }

        if (result && result.length > 0) {
            resultPath.datum(result).attr("d", line(result) + "Z").style("display", "block");
        } else {
            resultPath.style("display", "none");
        }

        statusDiv.innerHTML = statusText;
    }

    // Initial render
    updateVisualization();
}
