import "https://d3js.org/d3.v7.min.js";
import {
    loadPyodide
} from "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.mjs";

async function getPyodide() {
    if (!window.pyodide) {
        window.pyodide = await loadPyodide({
            indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/",
        });
        await window.pyodide.loadPackage(["numpy"]);
    }
    return window.pyodide;
}

export async function initRankNullspace(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container #${containerId} not found`);
        return;
    }

    // Widget UI and logic will go here
    container.innerHTML = `<p>Rank & Nullspace Visualizer</p>`;
}