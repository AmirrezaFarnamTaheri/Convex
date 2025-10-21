import "https://d3js.org/d3.v7.min.js";
import {
    loadPyodide
} from "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.mjs";

async function getPyodide() {
    if (!window.pyodide) {
        window.pyodide = await loadPyodide({
            indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/",
        });
        await window.pyodide.loadPackage(["numpy", "scipy"]);
    }
    return window.pyodide;
}

export async function initPolyhedronVisualizer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container #${containerId} not found`);
        return;
    }

    const width = container.clientWidth;
    const height = container.clientHeight;
    const svg = d3.select(container).append("svg")
        .attr("width", width)
        .attr("height", height);

    const state = {
        constraints: [
            { a: [1, 1], b: 1 },
            { a: [1, -1], b: 1 },
            { a: [-1, -1], b: 1 },
            { a: [-1, 1], b: 1 },
        ],
    };

    function render() {
        // rendering logic will go here
    }

    async function updatePolyhedron() {
        const pyodide = await getPyodide();
        const result = await pyodide.runPythonAsync(`
            import numpy as np
            from scipy.spatial import HalfspaceIntersection, ConvexHull

            halfspaces = np.array([
                [-a[0], -a[1], b] for a, b in ${JSON.stringify(state.constraints.map(c => [c.a, c.b]))}
            ])

            # feasible point for scipy
            feasible_point = np.array([0, 0])

            try:
                hs = HalfspaceIntersection(halfspaces, feasible_point)
                vertices = hs.intersections
                hull = ConvexHull(vertices)

                print(vertices[hull.vertices].tolist())
            except Exception as e:
                print(str(e))

        `);
        render();
    }

    updatePolyhedron();
}