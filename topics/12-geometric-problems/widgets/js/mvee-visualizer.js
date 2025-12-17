/**
 * Widget: MVEE Visualizer (Minimum Volume Enclosing Ellipsoid)
 *
 * Description: Interactive Khachiyan Algorithm visualization to find the MVEE
 *              for a set of user-defined points in 2D.
 *              (Implementing Khachiyan's algorithm in JS for speed and interactivity without Pyodide overhead)
 * Version: 2.0.0
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function initMVEEVisualizer(containerId) {
    console.log("Initializing MVEE Widget...");
    const container = document.getElementById(containerId);
    if (!container) {
        console.error("Container not found:", containerId);
        return;
    }

    // --- WIDGET LAYOUT ---
    container.innerHTML = `
        <div class="widget-container">
            <div id="plot-container" style="width: 100%; height: 400px; cursor: crosshair;"></div>
            <div class="widget-controls" style="padding: 15px;">
                 <div class="control-grid" style="display: flex; gap: 10px; align-items:center; flex-wrap:wrap;">
                    <span style="font-size:0.9rem; color:var(--text-secondary);">Presets:</span>
                    <button class="widget-btn-sm preset-btn" data-shape="default">Triangle</button>
                    <button class="widget-btn-sm preset-btn" data-shape="square">Square</button>
                    <button class="widget-btn-sm preset-btn" data-shape="outlier">Outlier</button>
                    <button class="widget-btn-sm preset-btn" data-shape="random">Random</button>
                </div>

                <div style="display:flex; justify-content:space-between; margin-top:12px;">
                    <button id="reset-mvee-btn" class="widget-btn">Clear</button>
                    <div style="font-size:0.85rem; color:var(--text-tertiary); display:flex; align-items:center;">
                        Algorithm: Khachiyan (Iterative)
                    </div>
                </div>

                <div id="mvee-output" class="widget-output" style="margin-top: 10px;"></div>
                <p class="widget-instructions" style="margin-top: 8px;">Click to add points. Drag points to adjust.</p>
            </div>
        </div>
    `;

    const resetBtn = container.querySelector("#reset-mvee-btn");
    const plotContainer = container.querySelector("#plot-container");
    const outputDiv = container.querySelector("#mvee-output");

    let points = [];
    const defaultPoints = [[-1,-1], [1,-1], [0,1]]; // Triangle

    const margin = {top: 20, right: 20, bottom: 40, left: 40};
    const width = plotContainer.clientWidth - margin.left - margin.right;
    const height = plotContainer.clientHeight - margin.top - margin.bottom;

    const svg = d3.select(plotContainer).append("svg")
        .attr("width", "100%").attr("height", "100%")
        .attr("viewBox", `0 0 ${plotContainer.clientWidth} ${plotContainer.clientHeight}`)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().domain([-4, 4]).range([0, width]);
    const y = d3.scaleLinear().domain([-4, 4]).range([height, 0]);

    // Grid
    svg.append("g").attr("class", "grid-line").call(d3.axisBottom(x).tickSize(-height).tickFormat("")).attr("opacity", 0.1);
    svg.append("g").attr("class", "grid-line").call(d3.axisLeft(y).tickSize(-width).tickFormat("")).attr("opacity", 0.1);

    svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));
    svg.append("g").call(d3.axisLeft(y));

    // Ellipsoid parts
    const pointsGroup = svg.append("g");

    // Khachiyan Algorithm Implementation (JS)
    // Solves for MVEE of points P = [p1, ..., pm]
    // Maximize log det(A) s.t. ||Ax + c|| <= 1
    // Dual problem: Maximize log det (P U P^T) s.t. 1^T u = 1, u >= 0
    // Algorithm finds optimal weights u.
    // Center c = P u
    // Shape M = (P diag(u) P^T - c c^T)^-1 / d  (where d is dimension)
    // Actually, Khachiyan is for Minimum Volume Enclosing Ellipsoid centered at origin usually?
    // No, generalized.

    // Simplified Khachiyan for (P U P^T) form?
    // Let's use the Lifting trick: append 1 to each point to handle center.
    // Q = [P; 1]. Find M (d+1 x d+1) minimizing volume.

    function solveMVEE(pts) {
        if (pts.length < 3) return null;

        const N = pts.length;
        const d = 2;
        // Lift points: Q = [ [x, y, 1] ... ]
        const Q = pts.map(p => [...p, 1]);

        // Initialize u = 1/N
        let u = new Array(N).fill(1/N);

        // Iterations
        const maxIter = 1000;
        const tol = 1e-4;

        for (let iter = 0; iter < maxIter; iter++) {
            // V = Q diag(u) Q^T
            // Calculate V manually
            let V = [[0,0,0], [0,0,0], [0,0,0]];
            for(let i=0; i<N; i++) {
                const q = Q[i];
                const w = u[i];
                for(let r=0; r<3; r++) {
                    for(let c=0; c<3; c++) {
                        V[r][c] += w * q[r] * q[c];
                    }
                }
            }

            // Invert V (3x3 inverse)
            // Det
            const det = V[0][0]*(V[1][1]*V[2][2] - V[1][2]*V[2][1]) -
                        V[0][1]*(V[1][0]*V[2][2] - V[1][2]*V[2][0]) +
                        V[0][2]*(V[1][0]*V[2][1] - V[1][1]*V[2][0]);

            if (Math.abs(det) < 1e-9) return null; // Degenerate

            const invDet = 1/det;
            const Vinv = [
                [ (V[1][1]*V[2][2] - V[1][2]*V[2][1])*invDet, -(V[0][1]*V[2][2] - V[0][2]*V[2][1])*invDet,  (V[0][1]*V[1][2] - V[0][2]*V[1][1])*invDet ],
                [-(V[1][0]*V[2][2] - V[1][2]*V[2][0])*invDet,  (V[0][0]*V[2][2] - V[0][2]*V[2][0])*invDet, -(V[0][0]*V[1][2] - V[0][2]*V[1][0])*invDet ],
                [ (V[1][0]*V[2][1] - V[1][1]*V[2][0])*invDet, -(V[0][0]*V[2][1] - V[0][1]*V[2][0])*invDet,  (V[0][0]*V[1][1] - V[0][1]*V[1][0])*invDet ]
            ];

            // Mahalanobis distances: M[i] = Q[i]^T Vinv Q[i]
            let maxM = -1;
            let maxIdx = -1;

            for(let i=0; i<N; i++) {
                const q = Q[i];
                // q^T Vinv q
                let val = 0;
                for(let r=0; r<3; r++) {
                    let rowSum = 0;
                    for(let c=0; c<3; c++) {
                        rowSum += q[c] * Vinv[c][r]; // Vinv is symmetric
                    }
                    val += q[r] * rowSum;
                }

                if (val > maxM) {
                    maxM = val;
                    maxIdx = i;
                }
            }

            // Stopping criteria: (d+1) is optimal maxM
            const error = maxM - (d + 1);
            if (error < tol) break;

            // Step size beta
            const beta = (maxM - (d + 1)) / ((d + 1) * (maxM - 1));

            // Update u
            for(let i=0; i<N; i++) {
                u[i] = (1 - beta) * u[i];
            }
            u[maxIdx] += beta;
        }

        // Final Extraction of Parameters
        // Center c = P u
        let center = [0, 0];
        for(let i=0; i<N; i++) {
            center[0] += pts[i][0] * u[i];
            center[1] += pts[i][1] * u[i];
        }

        // Shape Matrix M = inv(P diag(u) P^T - c c^T) / d
        // Actually, easy recovery from V_inv (of lifted)
        // Center c is actually related to V (lifted).
        // Let's recompute V with final u.
        // A_ellipse = (1/d) * (V_11 - c c^T)^-1?
        // Let's use the property: E = { x | (x-c)^T A (x-c) <= 1 }

        // Recompute V
        let V = [[0,0,0], [0,0,0], [0,0,0]];
        for(let i=0; i<N; i++) {
            const q = Q[i];
            const w = u[i];
            for(let r=0; r<3; r++) for(let c=0; c<3; c++) V[r][c] += w * q[r] * q[c];
        }

        // Center is [V02, V12] (since last col of Q is 1) ? No.
        // Center c = P u = [V02, V12] is only true if sum(u)=1 (it is).
        // Check: sum(u_i * p_i) = [ sum(u_i x_i), sum(u_i y_i) ]
        // V02 = sum(u_i * x_i * 1) = center_x. Correct.
        center = [V[0][2], V[1][2]];

        // Shape matrix for (x-c) part
        // M = (V_topleft - c c^T)^-1 / d ??
        // Let P_cen = P - c. Then E is related to (P_cen U P_cen^T).
        // Correct formula for A: A = (d) * inv( V_2x2 - c c^T )
        const V22 = [[V[0][0], V[0][1]], [V[1][0], V[1][1]]];
        const ccT = [[center[0]**2, center[0]*center[1]], [center[1]*center[0], center[1]**2]];

        const S = [
            [V22[0][0] - ccT[0][0], V22[0][1] - ccT[0][1]],
            [V22[1][0] - ccT[1][0], V22[1][1] - ccT[1][1]]
        ];

        // Inv(S) / d
        const detS = S[0][0]*S[1][1] - S[0][1]*S[1][0];
        if (Math.abs(detS) < 1e-9) return null;

        // Matrix A describing ellipse: (x-c)T A (x-c) <= 1
        // We want to draw this. We need eigenvalues of A^-1 (which is d*S).
        // The axes lengths are sqrt(eigenvalues of d*S).

        const M = [[S[0][0]*d, S[0][1]*d], [S[1][0]*d, S[1][1]*d]];

        // Eigen decomposition of 2x2 symmetric matrix M
        // Trace and Det
        const T = M[0][0] + M[1][1];
        const D = M[0][0]*M[1][1] - M[0][1]*M[1][0];
        const L1 = T/2 + Math.sqrt(T*T/4 - D);
        const L2 = T/2 - Math.sqrt(T*T/4 - D);

        const radii = [Math.sqrt(Math.abs(L1)), Math.sqrt(Math.abs(L2))];

        // Angle of first eigenvector (associated with L1)
        // (M - L2 I) v1 = 0 => (M00 - L2) x + M01 y = 0
        // y = - (M00 - L2) / M01 * x
        // angle = atan2(y, x)
        let angle = 0;
        if (Math.abs(M[0][1]) > 1e-9) {
            angle = Math.atan2(-(M[0][0] - L2), M[0][1]);
        } else {
            angle = 0; // Aligned with axis
        }

        return { c: center, radii: radii, angle: angle * 180 / Math.PI };
    }

    function setPoints(newPoints) {
        points = JSON.parse(JSON.stringify(newPoints));
        drawAndSolve();
    }

    const pointDrag = d3.drag()
        .on("drag", function(event, d) {
            d[0] = x.invert(event.x);
            d[1] = y.invert(event.y);
            drawAndSolve();
        });

    svg.append("rect").attr("width", width).attr("height", height).style("fill", "transparent").style("pointer-events", "all")
        .on("click", (event) => {
            const [mx, my] = d3.pointer(event, svg.node());
            points.push([x.invert(mx), y.invert(my)]);
            drawAndSolve();
        });

    function drawAndSolve() {
        // Draw points
        pointsGroup.selectAll("circle").data(points).join("circle")
            .attr("cx", d => x(d[0])).attr("cy", d => y(d[1])).attr("r", 6)
            .attr("fill", "var(--color-primary)")
            .attr("stroke", "#fff").attr("stroke-width", 2)
            .style("cursor", "move")
            .call(pointDrag);

        // Solve and draw
        const ellipse = solveMVEE(points);

        if (ellipse) {
            const rx = Math.abs(x(ellipse.radii[0]) - x(0));
            const ry = Math.abs(y(ellipse.radii[1]) - y(0));

            // Ensure ellipse exists
            let el = svg.select(".mvee-ellipse");
            if (el.empty()) el = svg.insert("ellipse", "g").attr("class", "mvee-ellipse")
                .attr("fill", "rgba(16, 185, 129, 0.1)")
                .attr("stroke", "var(--color-success)")
                .attr("stroke-width", 2);

            el
                .attr("cx", x(ellipse.c[0]))
                .attr("cy", y(ellipse.c[1]))
                .attr("rx", rx)
                .attr("ry", ry)
                .attr("transform", `rotate(${-ellipse.angle}, ${x(ellipse.c[0])}, ${y(ellipse.c[1])})`) // SVG rotate is clockwise? D3 y is down.
                .style("display", "block");

            outputDiv.innerHTML = `
                <div style="padding:10px; background:var(--bg-surface-2); border-radius:4px;">
                    <strong>MVEE Solution:</strong><br>
                    Center: (${ellipse.c[0].toFixed(2)}, ${ellipse.c[1].toFixed(2)})<br>
                    Semi-axes: ${ellipse.radii[0].toFixed(2)}, ${ellipse.radii[1].toFixed(2)}<br>
                    Volume (Area): ${(Math.PI * ellipse.radii[0] * ellipse.radii[1]).toFixed(2)}
                </div>`;
        } else {
             svg.select(".mvee-ellipse").style("display", "none");
             outputDiv.innerHTML = "Add at least 3 non-collinear points.";
        }
    }

    const presets = {
        default: defaultPoints,
        square: [[-2, -2], [2, -2], [2, 2], [-2, 2]],
        outlier: [[-2, -2], [2, -2], [0, 2], [3.5, 3.5]], // One outlier
        random: Array.from({length: 8}, () => [(Math.random()-0.5)*6, (Math.random()-0.5)*6])
    };

    container.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const shape = btn.dataset.shape;
            if (shape === 'random') {
                setPoints(Array.from({length: 8}, () => [(Math.random()-0.5)*6, (Math.random()-0.5)*6]));
            } else if (presets[shape]) {
                setPoints(presets[shape]);
            }
        });
    });

    resetBtn.addEventListener("click", () => {
        points = [];
        drawAndSolve();
    });

    // Add CSS for small buttons
    const style = document.createElement('style');
    style.textContent = `.widget-btn-sm { padding: 4px 8px; font-size: 0.8rem; background: var(--bg-surface-2); border: 1px solid var(--border-subtle); color: var(--text-primary); cursor: pointer; border-radius: 4px; } .widget-btn-sm:hover { background: var(--bg-surface-3); }`;
    container.appendChild(style);

    setPoints(defaultPoints);
}
