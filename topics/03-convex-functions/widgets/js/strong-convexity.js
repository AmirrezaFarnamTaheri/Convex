import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import {
    createModernWidget,
    createTabs,
    createSlider,
    createSelect,
    showStatus,
    addModernAxes,
    makeDraggable,
    formatValue
} from '/static/js/modern-components.js';

export function initStrongConvexity(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const { viz: vizContainer } = createModernWidget(container, 'Strong Convexity Explorer');

    // Test functions with their strong convexity parameters
    const functions = [
        {
            label: "Quadratic (f(x) = x²)",
            f: x => x * x,
            df: x => 2 * x,
            m: 2,  // strongly convex with m=2
            domain: [-3, 3],
            range: [0, 10]
        },
        {
            label: "Shifted Quadratic (f(x) = (x-1)²)",
            f: x => (x - 1) ** 2,
            df: x => 2 * (x - 1),
            m: 2,
            domain: [-2, 4],
            range: [0, 10]
        },
        {
            label: "Steep Parabola (f(x) = 2x²)",
            f: x => 2 * x * x,
            df: x => 4 * x,
            m: 4,
            domain: [-2, 2],
            range: [0, 10]
        },
        {
            label: "Exponential (f(x) = eˣ)",
            f: x => Math.exp(x),
            df: x => Math.exp(x),
            m: 0,  // strongly convex on any bounded interval
            domain: [-2, 2],
            range: [0, 8]
        },
        {
            label: "Fourth Power (f(x) = x⁴)",
            f: x => x ** 4,
            df: x => 4 * x ** 3,
            m: 0,  // not globally strongly convex
            domain: [-2, 2],
            range: [0, 16]
        },
        {
            label: "Smooth Absolute (f(x) = √(x²+0.1))",
            f: x => Math.sqrt(x * x + 0.1),
            df: x => x / Math.sqrt(x * x + 0.1),
            m: 0,
            domain: [-3, 3],
            range: [0, 4]
        }
    ];

    let currentFunc = functions[0];
    let x0 = -1.5, x1 = 1.5;
    let mParam = currentFunc.m;

    // Create tabs
    const tabs = createTabs(container, ['Interactive', 'Analysis', 'Theory']);

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

    const xScale = d3.scaleLinear().range([0, plotWidth]);
    const yScale = d3.scaleLinear().range([plotHeight, 0]);

    const { xAxis: xAxisG, yAxis: yAxisG } = addModernAxes(g, xScale, yScale, plotWidth, plotHeight, "x", "f(x)");

    // Create paths
    const functionPath = g.append("path")
        .attr("fill", "none")
        .attr("stroke", "#4dabf7")
        .attr("stroke-width", 3);

    const lowerBoundPath = g.append("path")
        .attr("fill", "none")
        .attr("stroke", "#51cf66")
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "5,5");

    const tangentPath = g.append("path")
        .attr("fill", "none")
        .attr("stroke", "#ffd43b")
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "3,3");

    // Create draggable points
    const point0 = g.append("circle")
        .attr("r", 8)
        .attr("fill", "#ff6b6b")
        .attr("stroke", "white")
        .attr("stroke-width", 2)
        .style("cursor", "move");

    const point1 = g.append("circle")
        .attr("r", 8)
        .attr("fill", "#845ef7")
        .attr("stroke", "white")
        .attr("stroke-width", 2)
        .style("cursor", "move");

    // Labels
    const label0 = g.append("text")
        .attr("fill", "#ff6b6b")
        .attr("font-weight", "bold")
        .attr("dy", -12)
        .text("x");

    const label1 = g.append("text")
        .attr("fill", "#845ef7")
        .attr("font-weight", "bold")
        .attr("dy", -12)
        .text("y");

    // Inequality verification display
    const statusDiv = g.append("foreignObject")
        .attr("x", 10)
        .attr("y", 10)
        .attr("width", plotWidth - 20)
        .attr("height", 100)
        .append("xhtml:div")
        .style("font-size", "14px")
        .style("background", "rgba(255,255,255,0.95)")
        .style("padding", "10px")
        .style("border-radius", "8px")
        .style("box-shadow", "0 2px 8px rgba(0,0,0,0.1)");

    // Controls
    const controlsDiv = tabs[0].appendChild(document.createElement('div'));
    controlsDiv.className = 'modern-controls-panel';
    controlsDiv.style.marginTop = '20px';

    const funcSelect = createSelect(controlsDiv, 'Test Function',
        functions.map((f, i) => ({ value: i, label: f.label })));

    const mSlider = createSlider(controlsDiv, 'Strong Convexity Parameter (m)',
        0, 10, 0.1, mParam, (val) => {
            mParam = val;
            updateVisualization();
        });

    funcSelect.addEventListener('change', (e) => {
        currentFunc = functions[parseInt(e.target.value)];
        mParam = currentFunc.m;
        mSlider.setValue(mParam);
        x0 = currentFunc.domain[0] * 0.5;
        x1 = currentFunc.domain[1] * 0.5;
        updateVisualization();
    });

    // Tab 2: Analysis
    const analysisDiv = tabs[1];
    analysisDiv.innerHTML = `
        <div style="padding: 20px; max-width: 800px;">
            <h3>Strong Convexity Analysis</h3>

            <div class="formula-block">
                <strong>Definition:</strong> A function f is <em>m-strongly convex</em> if:
                <div style="margin: 10px 0; padding: 15px; background: #f8f9fa; border-radius: 8px; font-size: 18px; text-align: center;">
                    f(y) ≥ f(x) + ∇f(x)ᵀ(y-x) + <span style="color: #51cf66; font-weight: bold;">m/2 · ||y-x||²</span>
                </div>
                for all x, y in the domain.
            </div>

            <div class="formula-block">
                <strong>Interpretation:</strong>
                <ul>
                    <li><span style="color: #4dabf7;">●</span> <strong>Function</strong>: f(x) - the actual function value</li>
                    <li><span style="color: #ffd43b;">●</span> <strong>Tangent Line</strong>: f(x) + ∇f(x)ᵀ(y-x) - first-order approximation</li>
                    <li><span style="color: #51cf66;">●</span> <strong>Lower Bound</strong>: Tangent + (m/2)||y-x||² - quadratic lower bound</li>
                </ul>
                The green lower bound must stay <em>below</em> the blue function for all points.
            </div>

            <div class="formula-block">
                <strong>Key Properties:</strong>
                <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                    <tr style="background: #f8f9fa;">
                        <td style="padding: 8px; border: 1px solid #dee2e6;"><strong>Property</strong></td>
                        <td style="padding: 8px; border: 1px solid #dee2e6;"><strong>Implication</strong></td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #dee2e6;">Unique Minimizer</td>
                        <td style="padding: 8px; border: 1px solid #dee2e6;">m > 0 guarantees exactly one global minimum</td>
                    </tr>
                    <tr style="background: #f8f9fa;">
                        <td style="padding: 8px; border: 1px solid #dee2e6;">Convergence Rate</td>
                        <td style="padding: 8px; border: 1px solid #dee2e6;">Gradient descent: O(log(1/ε)) iterations</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #dee2e6;">Condition Number</td>
                        <td style="padding: 8px; border: 1px solid #dee2e6;">κ = M/m where M is smoothness parameter</td>
                    </tr>
                    <tr style="background: #f8f9fa;">
                        <td style="padding: 8px; border: 1px solid #dee2e6;">Hessian Condition</td>
                        <td style="padding: 8px; border: 1px solid #dee2e6;">∇²f(x) ⪰ mI (all eigenvalues ≥ m)</td>
                    </tr>
                </table>
            </div>

            <div class="formula-block">
                <strong>Examples:</strong>
                <ul>
                    <li><strong>Quadratic:</strong> f(x) = x² is 2-strongly convex (m=2)</li>
                    <li><strong>Scaled Quadratic:</strong> f(x) = cx² is 2c-strongly convex (m=2c)</li>
                    <li><strong>Exponential:</strong> f(x) = eˣ is m-strongly convex on any bounded interval</li>
                    <li><strong>Regularized Loss:</strong> f(x) + (λ/2)||x||² adds λ-strong convexity</li>
                </ul>
            </div>
        </div>
    `;

    // Tab 3: Theory
    const theoryDiv = tabs[2];
    theoryDiv.innerHTML = `
        <div style="padding: 20px; max-width: 800px;">
            <h3>Strong Convexity Theory</h3>

            <div class="formula-block">
                <strong>Formal Definition:</strong>
                <p>A differentiable function f: ℝⁿ → ℝ is <em>m-strongly convex</em> with parameter m > 0 if:</p>
                <div style="margin: 10px 0; padding: 15px; background: #f8f9fa; border-radius: 8px; font-size: 16px; text-align: center;">
                    f(y) ≥ f(x) + ⟨∇f(x), y-x⟩ + (m/2)||y-x||²
                </div>
                <p>Equivalently, g(x) = f(x) - (m/2)||x||² is convex.</p>
            </div>

            <div class="formula-block">
                <strong>Second-Order Characterization:</strong>
                <p>For twice-differentiable f, the following are equivalent:</p>
                <ol>
                    <li>f is m-strongly convex</li>
                    <li>∇²f(x) ⪰ mI for all x (Hessian has eigenvalues ≥ m)</li>
                    <li>λ_min(∇²f(x)) ≥ m for all x</li>
                </ol>
            </div>

            <div class="formula-block">
                <strong>Convergence Implications:</strong>
                <p><strong>Gradient Descent:</strong> For m-strongly convex and L-smooth f:</p>
                <ul>
                    <li><strong>Step size:</strong> α = 1/L (fixed)</li>
                    <li><strong>Convergence:</strong> f(x_k) - f(x*) ≤ (1 - m/L)ᵏ · [f(x_0) - f(x*)]</li>
                    <li><strong>Rate:</strong> O(log(1/ε)) iterations (linear convergence)</li>
                    <li><strong>Condition number:</strong> κ = L/m affects convergence speed</li>
                </ul>
                <p>This is much faster than the O(1/ε) rate for merely convex functions!</p>
            </div>

            <div class="formula-block">
                <strong>Comparison with Convexity:</strong>
                <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                    <tr style="background: #f8f9fa;">
                        <td style="padding: 8px; border: 1px solid #dee2e6;"><strong>Property</strong></td>
                        <td style="padding: 8px; border: 1px solid #dee2e6;"><strong>Convex</strong></td>
                        <td style="padding: 8px; border: 1px solid #dee2e6;"><strong>Strongly Convex</strong></td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #dee2e6;">Lower Bound</td>
                        <td style="padding: 8px; border: 1px solid #dee2e6;">f(y) ≥ f(x) + ∇fᵀ(y-x)</td>
                        <td style="padding: 8px; border: 1px solid #dee2e6;">+ (m/2)||y-x||²</td>
                    </tr>
                    <tr style="background: #f8f9fa;">
                        <td style="padding: 8px; border: 1px solid #dee2e6;">Minimizer</td>
                        <td style="padding: 8px; border: 1px solid #dee2e6;">May not exist, or non-unique</td>
                        <td style="padding: 8px; border: 1px solid #dee2e6;">Unique global minimum</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #dee2e6;">GD Convergence</td>
                        <td style="padding: 8px; border: 1px solid #dee2e6;">O(1/k) sublinear</td>
                        <td style="padding: 8px; border: 1px solid #dee2e6;">O((1-m/L)ᵏ) linear</td>
                    </tr>
                    <tr style="background: #f8f9fa;">
                        <td style="padding: 8px; border: 1px solid #dee2e6;">Hessian</td>
                        <td style="padding: 8px; border: 1px solid #dee2e6;">∇²f ⪰ 0 (PSD)</td>
                        <td style="padding: 8px; border: 1px solid #dee2e6;">∇²f ⪰ mI (bounded below)</td>
                    </tr>
                </table>
            </div>

            <div class="formula-block">
                <strong>Applications:</strong>
                <ul>
                    <li><strong>Regularization:</strong> Adding (λ/2)||w||² to loss functions for stability</li>
                    <li><strong>Ridge Regression:</strong> ||Xw - y||² + λ||w||² is strongly convex</li>
                    <li><strong>Logistic Regression + L2:</strong> Guarantees unique solution</li>
                    <li><strong>Gradient Descent:</strong> Strong convexity enables linear convergence</li>
                    <li><strong>Proximal Methods:</strong> Strongly convex proximal terms for acceleration</li>
                </ul>
            </div>

            <div class="formula-block">
                <strong>How to Induce Strong Convexity:</strong>
                <p>If f is convex but not strongly convex, add regularization:</p>
                <div style="margin: 10px 0; padding: 15px; background: #f8f9fa; border-radius: 8px; text-align: center;">
                    f_reg(x) = f(x) + (λ/2)||x||²
                </div>
                <p>This makes f_reg λ-strongly convex, enabling faster optimization.</p>
            </div>
        </div>
    `;

    function updateVisualization() {
        // Update scales
        xScale.domain(currentFunc.domain);
        yScale.domain(currentFunc.range);
        xAxisG.call(d3.axisBottom(xScale));
        yAxisG.call(d3.axisLeft(yScale));

        // Generate function data
        const numPoints = 200;
        const xValues = d3.range(currentFunc.domain[0], currentFunc.domain[1],
            (currentFunc.domain[1] - currentFunc.domain[0]) / numPoints);
        const functionData = xValues.map(x => ({ x, y: currentFunc.f(x) }));

        const line = d3.line()
            .x(d => xScale(d.x))
            .y(d => yScale(d.y));

        functionPath
            .datum(functionData)
            .transition()
            .duration(300)
            .attr("d", line);

        // Calculate lower bound: f(x0) + df(x0)*(x-x0) + (m/2)*(x-x0)^2
        const f0 = currentFunc.f(x0);
        const df0 = currentFunc.df(x0);
        const lowerBoundData = xValues.map(x => ({
            x,
            y: f0 + df0 * (x - x0) + (mParam / 2) * (x - x0) ** 2
        }));

        lowerBoundPath
            .datum(lowerBoundData)
            .transition()
            .duration(300)
            .attr("d", line);

        // Tangent line at x0
        const tangentData = xValues.map(x => ({
            x,
            y: f0 + df0 * (x - x0)
        }));

        tangentPath
            .datum(tangentData)
            .transition()
            .duration(300)
            .attr("d", line);

        // Update points
        point0
            .transition()
            .duration(300)
            .attr("cx", xScale(x0))
            .attr("cy", yScale(currentFunc.f(x0)));

        point1
            .transition()
            .duration(300)
            .attr("cx", xScale(x1))
            .attr("cy", yScale(currentFunc.f(x1)));

        label0
            .transition()
            .duration(300)
            .attr("x", xScale(x0))
            .attr("y", yScale(currentFunc.f(x0)));

        label1
            .transition()
            .duration(300)
            .attr("x", xScale(x1))
            .attr("y", yScale(currentFunc.f(x1)));

        // Check strong convexity condition
        const f1 = currentFunc.f(x1);
        const lowerBound = f0 + df0 * (x1 - x0) + (mParam / 2) * (x1 - x0) ** 2;
        const satisfied = f1 >= lowerBound - 1e-10;
        const difference = f1 - lowerBound;

        statusDiv.html(`
            <div style="font-family: monospace;">
                <strong>Strong Convexity Check:</strong><br>
                <span style="color: #ff6b6b;">x</span> = ${formatValue(x0)},
                <span style="color: #845ef7;">y</span> = ${formatValue(x1)}<br>
                f(<span style="color: #845ef7;">y</span>) = ${formatValue(f1)}<br>
                f(<span style="color: #ff6b6b;">x</span>) + ∇f·(y-x) + (m/2)||y-x||² = ${formatValue(lowerBound)}<br>
                <strong>Difference:</strong> ${formatValue(difference)}<br>
                <strong>Status:</strong> <span class="modern-badge modern-badge-${satisfied ? 'success' : 'danger'}">${satisfied ? '✓ Satisfied' : '✗ Violated'}</span>
            </div>
        `);
    }

    // Make points draggable
    makeDraggable(point0, (x, y) => {
        x0 = Math.max(currentFunc.domain[0], Math.min(currentFunc.domain[1], xScale.invert(x)));
        updateVisualization();
    });

    makeDraggable(point1, (x, y) => {
        x1 = Math.max(currentFunc.domain[0], Math.min(currentFunc.domain[1], xScale.invert(x)));
        updateVisualization();
    });

    // Initial render
    updateVisualization();
}
