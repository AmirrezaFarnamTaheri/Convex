/**
 * Widget: LP Path Comparison: Simplex vs. Interior-Point
 *
 * Description: A side-by-side comparison of the path taken by the Simplex algorithm (along the exterior)
 *              and an interior-point method (through the interior).
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { getPyodide } from "../../../../static/js/pyodide-manager.js";

export async function initSimplexVsIPM(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="svi-widget">
            <div class="widget-controls">
                <p>Drag the objective vector (red arrow) or the constraint (purple line).</p>
                 <div class="legend">
                    <span style="color:var(--color-primary);">―</span> Simplex
                    <span style="color:var(--color-accent); margin-left: 10px;">―</span> Interior-Point
                </div>
            </div>
            <div id="plot-container"></div>
        </div>
    `;

    const plotContainer = container.querySelector("#plot-container");

    let c = [-1, -1];
    let b_ub = [8, 7];
    const A_ub = [[1, 2], [2, 1]];

    const margin = {top: 20, right: 20, bottom: 40, left: 40};
    const width = (plotContainer.clientWidth || 600) - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(plotContainer).append("svg")
        .attr("width", "100%").attr("height", height + margin.top + margin.bottom)
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().domain([0, 5]).range([0, width]);
    const y = d3.scaleLinear().domain([0, 5]).range([height, 0]);
    svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));
    svg.append("g").call(d3.axisLeft(y));

    const visGroup = svg.append("g");

    const pyodide = await getPyodide();
    await pyodide.loadPackage("numpy");
    const pythonCode = `
import numpy as np
import json

def get_paths(c_list, A_ub_list, b_ub_list):
    c = np.array(c_list)
    A_ub = np.array(A_ub_list)
    b_ub = np.array(b_ub_list)

    # Simplified Simplex (assuming origin is feasible, iterating through vertices)
    vertices = [np.array([0,0])]
    try:
        # Intersections of constraints with axes and each other
        vertices.append(np.array([b_ub[0]/A_ub[0][0], 0]))
        vertices.append(np.array([0, b_ub[0]/A_ub[0][1]]))
        vertices.append(np.array([b_ub[1]/A_ub[1][0], 0]))
        vertices.append(np.array([0, b_ub[1]/A_ub[1][1]]))
        A_inv = np.linalg.inv(A_ub)
        vertices.append(A_inv @ b_ub)
    except np.linalg.LinAlgError: pass

    feasible_vertices = [p for p in vertices if np.all(A_ub @ p <= b_ub + 1e-6) and np.all(p >= -1e-6)]

    simplex_path = [np.array([0,0])]
    current_v = simplex_path[0]
    for _ in range(len(feasible_vertices)):
        neighbors = sorted([v for v in feasible_vertices if np.linalg.norm(v-current_v) > 1e-6], key=lambda v: c @ v)
        if neighbors and c @ neighbors[0] < c @ current_v:
            simplex_path.append(neighbors[0])
            current_v = neighbors[0]
        else: break

    # Simplified IPM (central path)
    ip_path = []
    start_point = np.mean([v for v in feasible_vertices if np.linalg.norm(v)>1e-6], axis=0)
    if not np.any(start_point): start_point = np.array([0.1, 0.1])

    for t in np.logspace(-1, 2, 20):
        # Grad of barrier: c - sum(A_i / (b_i - A_i'x))
        x_k = start_point
        for _ in range(5): # Centering steps
            residuals = b_ub - A_ub @ x_k
            grad_barrier = (A_ub.T / residuals).sum(axis=1)
            grad = c + (1/t) * grad_barrier
            x_k = x_k - 0.1 * grad # Simplified step
        ip_path.append(x_k.tolist())

    return json.dumps({"simplex": [p.tolist() for p in simplex_path], "ip": ip_path})
`;
    await pyodide.runPythonAsync(pythonCode);
    const get_paths = pyodide.globals.get('get_paths');

    async function update() {
        visGroup.selectAll("*").remove();

        const paths = await get_paths(c, A_ub, b_ub).then(r => JSON.parse(r));

        // Contours
        const contours = d3.range(-10, 10, 1).map(val => {
            if (Math.abs(c[1]) > 1e-4) return [[(val - c[0]*0)/c[1], 0], [(val-c[0]*5)/c[1], 5]];
            return [[val/c[0], 0], [val/c[0], 5]];
        });
        visGroup.append("g").selectAll("path").data(contours).join("path")
            .attr("d", d3.line().x(d=>x(d[0])).y(d=>y(d[1])))
            .attr("stroke", "var(--color-surface-1)").attr("stroke-dasharray", "2,2");

        // Feasible region
        const vertices = [[0,0], [b_ub[0]/A_ub[0][0], 0], np.linalg.inv(A_ub) @ b_ub, [0, b_ub[1]/A_ub[1][1]]];
        visGroup.append("path").datum(vertices).attr("d", d3.line().x(d=>x(d[0])).y(d=>y(d[1])) + "Z").attr("fill", "var(--color-primary-light)").attr("opacity", 0.5);

        // Paths
        visGroup.append("path").datum(paths.simplex).attr("d", d3.line().x(d=>x(d[0])).y(d=>y(d[1]))).attr("fill", "none").attr("stroke", "var(--color-primary)").attr("stroke-width", 3);
        visGroup.append("path").datum(paths.ip).attr("d", d3.line().x(d=>x(d[0])).y(d=>y(d[1]))).attr("fill", "none").attr("stroke", "var(--color-accent)").attr("stroke-width", 3);

        // Draggable objective vector
        const c_handle_pos = [-c[0] * 0.5, -c[1] * 0.5];
        visGroup.append("line").attr("x1",x(0)).attr("y1",y(0)).attr("x2",x(c_handle_pos[0])).attr("y2",y(c_handle_pos[1])).attr("stroke","var(--color-danger)").attr("stroke-width",2).attr("marker-end","url(#arrow-svi)");
        visGroup.append("circle").attr("cx", x(c_handle_pos[0])).attr("cy", y(c_handle_pos[1])).attr("r", 7).attr("fill","transparent").style("cursor","move")
            .call(d3.drag().on("drag", function(event) { c = [-x.invert(event.x)*2, -y.invert(event.y)*2]; update(); }));

    }

    svg.append("defs").append("marker").attr("id", "arrow-svi").attr("viewBox", "0 -5 10 10")
        .attr("refX", 10).attr("refY", 0).attr("markerWidth", 6).attr("markerHeight", 6)
        .attr("orient", "auto").append("path").attr("d", "M0,-5L10,0L0,5").attr("fill", "var(--color-danger)");

    update();
}
