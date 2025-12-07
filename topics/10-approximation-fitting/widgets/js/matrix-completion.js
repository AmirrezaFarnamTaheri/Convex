/**
 * Widget: Matrix Completion Visualizer
 *
 * Description: Demonstrates recovering a low-rank matrix (an image) from a small
 *              subset of its pixels using Singular Value Thresholding.
 * Version: 2.0.0
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { getPyodide } from "../../../../static/js/pyodide-manager.js"; // For linear algebra

export async function initMatrixCompletionVisualizer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `<div class="widget-loading-indicator">Loading Pyodide & scikit-image...</div>`;
    const pyodide = await getPyodide();
    await pyodide.loadPackage("scikit-image");

    // --- WIDGET LAYOUT ---
    container.innerHTML = `
        <div class="matrix-completion-widget">
            <div class="canvases-container" style="display: flex; flex-wrap: wrap; gap: 15px; justify-content: center;">
                <div><h5>Original</h5><canvas id="original-canvas"></canvas></div>
                <div><h5>Masked</h5><canvas id="masked-canvas"></canvas></div>
                <div><h5>Reconstructed</h5><canvas id="reconstructed-canvas"></canvas></div>
            </div>
             <div id="singular-value-plot" style="width: 100%; height: 200px; margin-top: 15px;"></div>
            <div class="widget-controls" style="padding: 15px;">
                <div class="control-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
                    <div>
                        <label>Image Type:</label>
                        <select id="image-type-select">
                            <option value="sines">Sines (Rank 1)</option>
                            <option value="gradient">Gradient (Rank 2)</option>
                            <option value="checkerboard">Checkerboard (Low Rank)</option>
                        </select>
                    </div>
                    <div>
                        <label>Missing Pixels: <span id="missing-pct-val">70</span>%</label>
                        <input type="range" id="missing-pct-slider" min="10" max="95" value="70">
                    </div>
                </div>
                <button id="run-completion-btn" style="margin-top: 15px;">Run Matrix Completion</button>
            </div>
            <div id="completion-status" class="widget-output"></div>
        </div>
    `;

    const imageSelect = container.querySelector("#image-type-select");
    const pctSlider = container.querySelector("#missing-pct-slider");
    const pctVal = container.querySelector("#missing-pct-val");
    const runBtn = container.querySelector("#run-completion-btn");
    const canvases = {
        original: container.querySelector("#original-canvas"),
        masked: container.querySelector("#masked-canvas"),
        reconstructed: container.querySelector("#reconstructed-canvas"),
    };
    const statusDiv = container.querySelector("#completion-status");

    const IMG_SIZE = 128;
    Object.values(canvases).forEach(c => { c.width = IMG_SIZE; c.height = IMG_SIZE; });
    const svPlotDiv = container.querySelector("#singular-value-plot");

    // --- Image & Python Setup ---
    const pythonCode = `
        import numpy as np

        def create_image(type='sines', size=128):
            x = np.linspace(-np.pi, np.pi, size)
            y = np.linspace(-np.pi, np.pi, size)
            xx, yy = np.meshgrid(x, y)
            if type == 'sines':
                img = np.sin(xx) * np.cos(yy)
            elif type == 'gradient':
                img = xx + yy
            else: // checkerboard
                img = np.sign(np.sin(xx*4) * np.sin(yy*4))

            img = (img - img.min()) / (img.max() - img.min()) * 255
            return img.astype(np.uint8)

        def singular_value_thresholding(M, mask, tau=100, max_iter=50):
            Y = M.copy()
            singular_values = []
            for i in range(max_iter):
                U, s, Vt = np.linalg.svd(Y, full_matrices=False)
                if i % 5 == 0: singular_values.append(s)
                s_thresh = np.maximum(s - tau, 0)
                X = U @ np.diag(s_thresh) @ Vt
                Y[mask] = M[mask]
            return {"X": np.clip(X, 0, 255).astype(np.uint8), "sv": singular_values}
    `;
    await pyodide.runPythonAsync(pythonCode);
    const create_image = pyodide.globals.get('create_image');
    const singular_value_thresholding = pyodide.globals.get('singular_value_thresholding');

    let original_img_py;

    function drawImage(canvas, imgPy) {
        const ctx = canvas.getContext('2d');
        const data = imgPy.toJs({ depth: 2 });
        const imageData = new ImageData(new Uint8ClampedArray(IMG_SIZE * IMG_SIZE * 4), IMG_SIZE);
        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[0].length; j++) {
                const val = data[i][j];
                const index = (i * IMG_SIZE + j) * 4;
                imageData.data[index] = val;
                imageData.data[index+1] = val;
                imageData.data[index+2] = val;
                imageData.data[index+3] = 255;
            }
        }
        ctx.putImageData(imageData, 0, 0);
    }

    function plotSingularValues(sv_data) {
        svPlotDiv.innerHTML = '';
        const margin = {top: 20, right: 20, bottom: 40, left: 50};
        const width = svPlotDiv.clientWidth - margin.left - margin.right;
        const height = svPlotDiv.clientHeight - margin.top - margin.bottom;

        const svg = d3.select(svPlotDiv).append("svg")
            .attr("width", "100%").attr("height", "100%")
            .attr("viewBox", `0 0 ${svPlotDiv.clientWidth} ${svPlotDiv.clientHeight}`)
            .append("g").attr("transform", `translate(${margin.left},${margin.top})`);

        const max_sv = d3.max(sv_data.flat());
        const x = d3.scaleLinear().domain([0, sv_data[0].length]).range([0, width]);
        const y = d3.scaleLog().domain([1, max_sv]).range([height, 0]);

        svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));
        svg.append("g").call(d3.axisLeft(y).ticks(3, ".1e"));

        const color = d3.scaleSequential(d3.interpolateCividis).domain([0, sv_data.length]);
        sv_data.forEach((sv_list, i) => {
            svg.append("path").datum(sv_list)
               .attr("fill", "none").attr("stroke", color(i)).attr("stroke-width", 1.5)
               .attr("d", d3.line().x((d,j) => x(j)).y(d => y(d)));
        });
    }

    async function runCompletion() {
        runBtn.disabled = true;
        statusDiv.textContent = "Running singular value thresholding...";
        const missing_pct = +pctSlider.value;
        const imageType = imageSelect.value;
        pctVal.textContent = missing_pct;

        original_img_py = await create_image(imageType);
        drawImage(canvases.original, original_img_py);

        const mask_py = pyodide.runPython(`
            import numpy as np
            mask = np.random.rand(128, 128) > (${missing_pct} / 100.0)
            mask
        `);

        const masked_M_py = pyodide.runPython(`original_img_py * mask_py`);
        drawImage(canvases.masked, masked_M_py);

        const result = await singular_value_thresholding(masked_M_py, mask_py).then(r => r.toJs({create_proxies: false}));
        const reconstructed_py = pyodide.pyimport("numpy").array(result.X);
        drawImage(canvases.reconstructed, reconstructed_py);
        plotSingularValues(result.sv);

        const L2_error = pyodide.runPython(`
            import numpy as np
            np.linalg.norm(original_img_py - reconstructed_py) / np.linalg.norm(original_img_py)
        `);
        statusDiv.innerHTML = `Done! Relative reconstruction error: <strong>${(L2_error * 100).toFixed(2)}%</strong>`;

        runBtn.disabled = false;
        [mask_py, masked_M_py, reconstructed_py, original_img_py].forEach(p => p.destroy());
    }

    imageSelect.onchange = runCompletion;
    pctSlider.oninput = () => pctVal.textContent = pctSlider.value;
    runBtn.onclick = runCompletion;

    runCompletion();
}
