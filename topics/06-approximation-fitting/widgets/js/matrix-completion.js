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
                <div><h5>Original (Rank 1)</h5><canvas id="original-canvas"></canvas></div>
                <div><h5>Masked</h5><canvas id="masked-canvas"></canvas></div>
                <div><h5>Reconstructed</h5><canvas id="reconstructed-canvas"></canvas></div>
            </div>
            <div class="widget-controls" style="padding: 15px;">
                <label>Missing Pixels: <span id="missing-pct-val">70</span>%</label>
                <input type="range" id="missing-pct-slider" min="10" max="95" value="70" style="width:100%;">
                <button id="run-completion-btn">Run Matrix Completion</button>
            </div>
            <div id="completion-status" class="widget-output"></div>
        </div>
    `;

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

    // --- Image & Python Setup ---
    const pythonCode = `
        import numpy as np

        def create_low_rank_image(size=128):
            x = np.linspace(-np.pi, np.pi, size)
            y = np.linspace(-np.pi, np.pi, size)
            xx, yy = np.meshgrid(x, y)
            # A simple rank-1 matrix
            u = np.sin(xx)
            v = np.cos(yy)
            img = u * v
            img = (img - img.min()) / (img.max() - img.min()) * 255
            return img.astype(np.uint8)

        def singular_value_thresholding(M, mask, tau=100, max_iter=50):
            Y = M.copy()
            for i in range(max_iter):
                U, s, Vt = np.linalg.svd(Y, full_matrices=False)
                s_thresh = np.maximum(s - tau, 0)
                X = U @ np.diag(s_thresh) @ Vt
                Y[mask] = M[mask] # Project onto observed entries
            return np.clip(X, 0, 255).astype(np.uint8)
    `;
    await pyodide.runPythonAsync(pythonCode);
    const create_low_rank_image = pyodide.globals.get('create_low_rank_image');
    const singular_value_thresholding = pyodide.globals.get('singular_value_thresholding');

    const original_img_py = await create_low_rank_image();

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

    drawImage(canvases.original, original_img_py);

    async function runCompletion() {
        runBtn.disabled = true;
        statusDiv.textContent = "Running singular value thresholding...";
        const missing_pct = +pctSlider.value;
        pctVal.textContent = missing_pct;

        const mask_py = pyodide.runPython(`
            import numpy as np
            mask = np.random.rand(128, 128) > (${missing_pct} / 100.0)
            mask
        `);

        const masked_M_py = pyodide.runPython(`original_img_py * mask_py`);
        drawImage(canvases.masked, masked_M_py);

        const reconstructed_py = await singular_value_thresholding(masked_M_py, mask_py);
        drawImage(canvases.reconstructed, reconstructed_py);

        const L2_error = pyodide.runPython(`
            import numpy as np
            np.linalg.norm(original_img_py - reconstructed_py) / np.linalg.norm(original_img_py)
        `);
        statusDiv.innerHTML = `Done! Relative reconstruction error: <strong>${(L2_error * 100).toFixed(2)}%</strong>`;

        runBtn.disabled = false;
        [mask_py, masked_M_py, reconstructed_py].forEach(p => p.destroy());
    }

    pctSlider.oninput = () => pctVal.textContent = pctSlider.value;
    runBtn.onclick = runCompletion;

    runCompletion();
}
