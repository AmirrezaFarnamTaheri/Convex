/**
 * Widget: Matrix & Geometry Explorer
 *
 * Description: An interactive explorer for 2x2 matrices.
 *              Merges functionality of Matrix Explorer and Eigen-PSD.
 *              Features:
 *              - General 2x2 matrix input
 *              - Symmetric constraint toggle
 *              - Visualizations: Linear Transformation (Unit Circle -> Ellipse), Quadratic Form (Contours), Eigenvectors
 *              - Analysis: Determinant, Trace, Eigenvalues, Definiteness
 * Version: 3.0.0
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { getPyodide } from "../../../../static/js/pyodide-manager.js";

export async function initMatrixGeometry(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="widget-container" style="min-height: 600px;">
             <div class="widget-loading">
                <div class="widget-loading-spinner"></div>
                <div>Initializing Python...</div>
            </div>
        </div>
    `;

    const pyodide = await getPyodide();
    await pyodide.loadPackage("numpy");

    // --- WIDGET LAYOUT ---
    container.innerHTML = `
        <div class="widget-container">
            <div class="widget-controls">
                <div class="widget-control-group" style="flex-basis: 100%; flex-direction: row; justify-content: space-between; align-items: center;">
                     <h4 style="margin: 0; color: var(--color-text-main); font-size: 1rem;">Matrix A = [[a, b], [c, d]]</h4>
                     <div style="display: flex; align-items: center; gap: 8px;">
                        <input type="checkbox" id="symmetric-toggle">
                        <label for="symmetric-toggle" class="widget-label" style="margin: 0; cursor: pointer;">Force Symmetric (c = b)</label>
                     </div>
                </div>
                <div id="sliders-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 16px; width: 100%;"></div>
            </div>

            <div id="vis-area" style="display: flex; flex-wrap: wrap; border-bottom: 1px solid var(--color-border);">
                 <div id="linear-plot" style="flex: 1; min-width: 300px; height: 350px; position: relative; border-right: 1px solid var(--color-border);">
                    <div style="position: absolute; top: 10px; left: 10px; z-index: 5; pointer-events: none;">
                        <span style="background: rgba(0,0,0,0.7); padding: 4px 8px; border-radius: 4px; font-size: 0.85rem; color: var(--color-text-main); border: 1px solid var(--color-border);">
                            Linear Map: y = Ax
                        </span>
                        <div style="margin-top:4px; font-size: 0.75rem; color: var(--color-text-muted);">
                            Shows <span style="color: var(--color-primary);">Unit Circle</span> transformed
                        </div>
                    </div>
                 </div>
                 <div id="quad-plot" style="flex: 1; min-width: 300px; height: 350px; position: relative; background: var(--surface-1);">
                    <div style="position: absolute; top: 10px; left: 10px; z-index: 5; pointer-events: none;">
                        <span style="background: rgba(0,0,0,0.7); padding: 4px 8px; border-radius: 4px; font-size: 0.85rem; color: var(--color-text-main); border: 1px solid var(--color-border);">
                            Quadratic Form: z = xᵀAx
                        </span>
                        <div style="margin-top:4px; font-size: 0.75rem; color: var(--color-text-muted);">
                            Contours of curvature
                        </div>
                    </div>
                 </div>
            </div>

            <div id="analysis-output" class="widget-output"></div>
        </div>
    `;

    const slidersGrid = container.querySelector("#sliders-grid");
    const symmetricToggle = container.querySelector("#symmetric-toggle");
    const analysisOutput = container.querySelector("#analysis-output");

    let A = { a: 1.5, b: 0.5, c: 0.5, d: 1.0 };
    let isSymmetric = true; // Start symmetric as in the lecture context

    // Initialize checkbox state
    symmetricToggle.checked = isSymmetric;

    // Sliders UI
    const sliders = {};
    const config = [
        { id: 'a', label: 'a (0,0)' },
        { id: 'b', label: 'b (0,1)' },
        { id: 'c', label: 'c (1,0)' },
        { id: 'd', label: 'd (1,1)' }
    ];

    config.forEach(param => {
        const div = document.createElement('div');
        div.className = "widget-control-group";
        div.innerHTML = `
            <label class="widget-label">${param.label}: <span id="val-${param.id}" class="widget-value-display">${A[param.id].toFixed(1)}</span></label>
            <input type="range" id="slider-${param.id}" min="-2" max="2" step="0.1" value="${A[param.id]}" class="widget-slider">
        `;
        slidersGrid.appendChild(div);
        const input = div.querySelector('input');
        const display = div.querySelector('span');

        sliders[param.id] = { input, display };

        input.oninput = () => {
            const val = parseFloat(input.value);
            A[param.id] = val;
            display.textContent = val.toFixed(1);

            if (isSymmetric) {
                if (param.id === 'b') {
                    A.c = val;
                    sliders.c.input.value = val;
                    sliders.c.display.textContent = val.toFixed(1);
                }
                if (param.id === 'c') {
                    A.b = val;
                    sliders.b.input.value = val;
                    sliders.b.display.textContent = val.toFixed(1);
                }
            }
            update();
        };
    });

    symmetricToggle.onchange = (e) => {
        isSymmetric = e.target.checked;
        if (isSymmetric) {
            // Enforce symmetry immediately
            const avg = (A.b + A.c) / 2;
            A.b = avg;
            A.c = avg;
            sliders.b.input.value = avg;
            sliders.b.display.textContent = avg.toFixed(1);
            sliders.c.input.value = avg;
            sliders.c.display.textContent = avg.toFixed(1);
            // Disable 'c' slider visually?
            sliders.c.input.disabled = true;
        } else {
            sliders.c.input.disabled = false;
        }
        update();
    };
    // Initial state for disabled c slider
    if(isSymmetric) sliders.c.input.disabled = true;


    // --- PYODIDE LOGIC ---
    const pythonUpdate = pyodide.runPython(`
        import numpy as np
        def analyze(a, b, c, d):
            A = np.array([[a, b], [c, d]])
            det = np.linalg.det(A)
            trace = np.trace(A)

            # Eigen decomposition
            try:
                eigvals, eigvecs = np.linalg.eig(A)
                # Sort by real part descending
                idx = np.argsort(np.real(eigvals))[::-1]
                eigvals = eigvals[idx]
                eigvecs = eigvecs[:, idx]

                ev_real = np.real(eigvals).tolist()
                ev_imag = np.imag(eigvals).tolist()

                # Only send real eigenvectors if eigenvalues are real
                if np.all(np.abs(np.imag(eigvals)) < 1e-5):
                    vecs_real = np.real(eigvecs).T.tolist()
                else:
                    vecs_real = []
            except:
                ev_real, ev_imag, vecs_real = [], [], []

            # Symmetric part for Quadratic Form
            S = (A + A.T) / 2
            s_vals, s_vecs = np.linalg.eigh(S)
            # Sort descending
            idx_s = np.argsort(s_vals)[::-1]
            s_vals = s_vals[idx_s]
            s_vecs = s_vecs[:, idx_s]

            tol = 1e-4
            if np.all(s_vals > tol): def_type = "Positive Definite"
            elif np.all(s_vals >= -tol): def_type = "Positive Semidefinite"
            elif np.all(s_vals < -tol): def_type = "Negative Definite"
            elif np.all(s_vals <= tol): def_type = "Negative Semidefinite"
            else: def_type = "Indefinite"

            # Contours for quadratic form z = xT A x
            # Actually we plot z = xT S x because xT A x = xT S x
            nx, ny = 40, 40
            x = np.linspace(-2.5, 2.5, nx)
            y = np.linspace(-2.5, 2.5, ny)
            X, Y = np.meshgrid(x, y)
            Z = S[0,0]*X**2 + 2*S[0,1]*X*Y + S[1,1]*Y**2

            return {
                "det": float(det),
                "trace": float(trace),
                "eigvals_real": ev_real,
                "eigvals_imag": ev_imag,
                "eigvecs": vecs_real,
                "def_type": def_type,
                "Z": Z.tolist(),
                "S_eigvals": s_vals.tolist(),
                "S_eigvecs": s_vecs.T.tolist()
            }
        analyze
    `);

    // --- D3 VISUALIZATIONS ---
    let linPlot, quadPlot;

    function createBasePlot(selector) {
        const div = container.querySelector(selector);

        // Remove existing SVG to rebuild
        const existingSvg = div.querySelector('.widget-svg');
        if (existingSvg) existingSvg.remove();

        const w = div.clientWidth;
        const h = div.clientHeight;
        const margin = { top: 20, right: 20, bottom: 20, left: 20 };

        const svg = d3.select(div).append("svg")
            .attr("class", "widget-svg")
            .attr("width", "100%").attr("height", "100%")
            .attr("viewBox", `0 0 ${w} ${h}`);

        const g = svg.append("g").attr("transform", `translate(${w/2}, ${h/2})`);

        // Scale: map [-3, 3] to width/2 - margin
        const scale = d3.scaleLinear().domain([-3, 3]).range([-(w-margin.left-margin.right)/2, (w-margin.left-margin.right)/2]);

        // Axes
        g.append("g").attr("class", "grid").call(d3.axisBottom(scale).ticks(5).tickSize(-h+margin.top+margin.bottom).tickFormat(""));
        g.append("g").attr("class", "grid").call(d3.axisLeft(scale).ticks(5).tickSize(-w+margin.left+margin.right).tickFormat(""));

        g.append("line").attr("x1", scale(-10)).attr("x2", scale(10)).attr("y1", 0).attr("y2", 0).attr("stroke", "var(--color-border)").attr("stroke-width", 2);
        g.append("line").attr("y1", scale(-10)).attr("y2", scale(10)).attr("x1", 0).attr("x2", 0).attr("stroke", "var(--color-border)").attr("stroke-width", 2);

        return { svg: g, scale, w, h };
    }

    function setupPlots() {
        linPlot = createBasePlot("#linear-plot");
        quadPlot = createBasePlot("#quad-plot");

        // Add unit circle to linear plot (faint reference)
        linPlot.svg.append("circle").attr("r", linPlot.scale(1) - linPlot.scale(0))
            .attr("fill", "none").attr("stroke", "var(--color-text-muted)").attr("stroke-dasharray", "4 4");
    }

    function update() {
        const res = pythonUpdate(A.a, A.b, A.c, A.d).toJs({create_proxies: false});

        // --- Update Linear Plot ---
        // Draw transformed unit circle
        const circlePts = d3.range(0, 2*Math.PI + 0.1, 0.1).map(t => {
            const x = Math.cos(t);
            const y = Math.sin(t);
            // Apply A
            return [A.a*x + A.b*y, A.c*x + A.d*y];
        });

        const lineGen = d3.line().x(d => linPlot.scale(d[0])).y(d => -linPlot.scale(d[1])); // Flip Y for screen coords

        linPlot.svg.selectAll(".transformed-shape").remove();
        linPlot.svg.append("path")
            .datum(circlePts)
            .attr("class", "transformed-shape")
            .attr("d", lineGen)
            .attr("fill", "rgba(124, 197, 255, 0.15)")
            .attr("stroke", "var(--color-primary)")
            .attr("stroke-width", 2.5);

        // Draw Eigenvectors (Real A)
        linPlot.svg.selectAll(".eigenvector").remove();
        if (res.eigvecs.length > 0) {
            res.eigvecs.forEach((v, i) => {
                const val = res.eigvals_real[i];
                // Draw line from origin to eigenvalue * eigenvector
                // v is normalized
                const endX = v[0] * val;
                const endY = v[1] * val;

                linPlot.svg.append("line")
                    .attr("class", "eigenvector")
                    .attr("x1", 0).attr("y1", 0)
                    .attr("x2", linPlot.scale(endX)).attr("y2", -linPlot.scale(endY))
                    .attr("stroke", i === 0 ? "var(--color-accent)" : "#ff6b6b")
                    .attr("stroke-width", 2)
                    .attr("marker-end", i === 0 ? "url(#arrow-accent)" : "url(#arrow-error)");
            });
        }

        // --- Update Quadratic Plot ---
        // Draw Contours
        const Z = res.Z;
        const n = Z.length;
        const m = Z[0].length;
        const values = new Float64Array(n * m);
        for (let j = 0; j < n; ++j) {
            for (let k = 0; k < m; ++k) {
                values[j * m + k] = Z[j][k];
            }
        }

        const contours = d3.contours().size([n, m]).thresholds(d3.range(-5, 5.1, 0.5))(values);
        const transform = d3.geoTransform({
            point: function(px, py) {
                // Grid [0,n] -> [-2.5, 2.5] -> Scale
                const x = px / n * 5 - 2.5;
                const y = py / m * 5 - 2.5;
                this.stream.point(quadPlot.scale(x), -quadPlot.scale(y));
            }
        });
        const path = d3.geoPath().projection(transform);
        // Use color scale: Red for positive, Blue for negative
        const colorScale = d3.scaleSequential(d3.interpolateRdBu).domain([5, -5]);

        quadPlot.svg.selectAll(".contour").remove();
        quadPlot.svg.selectAll("path.contour")
            .data(contours)
            .enter().append("path")
            .attr("class", "contour")
            .attr("d", path)
            .attr("fill", "none")
            .attr("stroke", d => colorScale(d.value))
            .attr("stroke-width", 1.5)
            .attr("opacity", 0.7);

        // Draw Principal Axes (Eigenvectors of Symmetric Part)
        quadPlot.svg.selectAll(".principal-axis").remove();
        res.S_eigvecs.forEach((v, i) => {
             // Draw lines indicating axes
             const len = 3;
             quadPlot.svg.append("line")
                .attr("class", "principal-axis")
                .attr("x1", quadPlot.scale(-v[0]*len)).attr("y1", -quadPlot.scale(-v[1]*len))
                .attr("x2", quadPlot.scale(v[0]*len)).attr("y2", -quadPlot.scale(v[1]*len))
                .attr("stroke", "var(--color-text-muted)")
                .attr("stroke-dasharray", "2 2")
                .attr("stroke-width", 1);
        });


        // --- Update Text Analysis ---
        let eigStr = res.eigvals_real.map((r, i) => {
            const im = res.eigvals_imag[i];
            return im === 0 ? r.toFixed(2) : `${r.toFixed(2)}${im > 0 ? '+' : ''}${im.toFixed(2)}i`;
        }).join(", ");

        analysisOutput.innerHTML = `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 24px;">
                <div>
                    <div style="font-size: 0.8rem; color: var(--color-text-muted);">PROPERTIES</div>
                    <div><strong>Determinant:</strong> ${res.det.toFixed(2)}</div>
                    <div><strong>Trace:</strong> ${res.trace.toFixed(2)}</div>
                </div>
                <div>
                    <div style="font-size: 0.8rem; color: var(--color-text-muted);">SPECTRAL</div>
                    <div><strong>Eigenvalues:</strong> ${eigStr}</div>
                    <div><strong>Definiteness:</strong> <span style="color: var(--color-primary); font-weight: bold;">${res.def_type}</span></div>
                </div>
            </div>
        `;
    }

    // Define markers
    const defs = d3.select(container).append("svg").attr("width", 0).attr("height", 0).append("defs");
    defs.append("marker").attr("id", "arrow-accent").attr("viewBox", "0 -5 10 10").attr("refX", 8).attr("refY", 0).attr("markerWidth", 6).attr("markerHeight", 6).attr("orient", "auto").append("path").attr("d", "M0,-5L10,0L0,5").attr("fill", "var(--color-accent)");
    defs.append("marker").attr("id", "arrow-error").attr("viewBox", "0 -5 10 10").attr("refX", 8).attr("refY", 0).attr("markerWidth", 6).attr("markerHeight", 6).attr("orient", "auto").append("path").attr("d", "M0,-5L10,0L0,5").attr("fill", "#ff6b6b");


    new ResizeObserver(() => {
        setupPlots();
        update();
    }).observe(container);

    setupPlots();
    update();
}
