/**
 * Widget: Matrix Completion Visualizer
 *
 * Description: Users can hide entries of a low-rank matrix (e.g., an image)
 *              and watch an algorithm recover the missing values.
 */
import { getPyodide } from "../../../../static/js/pyodide-manager.js";

export async function initMatrixCompletionVisualizer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="matrix-completion-widget">
            <div class="widget-controls">
                <label>Missing Pixels: <span id="missing-pct-val">50</span>%</label>
                <input type="range" id="missing-pct-slider" min="10" max="95" value="50">
                <button id="run-completion-btn">Run Matrix Completion</button>
            </div>
            <div class="canvases-container">
                <div><h5>Original</h5><canvas id="original-canvas"></canvas></div>
                <div><h5>Masked</h5><canvas id="masked-canvas"></canvas></div>
                <div><h5>Reconstructed</h5><canvas id="reconstructed-canvas"></canvas></div>
            </div>
        </div>
    `;

    const pctSlider = container.querySelector("#missing-pct-slider");
    const pctVal = container.querySelector("#missing-pct-val");
    const runBtn = container.querySelector("#run-completion-btn");
    const originalCanvas = container.querySelector("#original-canvas");
    const maskedCanvas = container.querySelector("#masked-canvas");
    const reconstructedCanvas = container.querySelector("#reconstructed-canvas");

    const IMG_SIZE = 128;
    [originalCanvas, maskedCanvas, reconstructedCanvas].forEach(c => {
        c.width = IMG_SIZE; c.height = IMG_SIZE;
    });

    const pyodide = await getPyodide();
    await pyodide.loadPackage(["scikit-image", "scikit-learn"]);
    const pythonCode = `
import numpy as np
from skimage import data
from skimage.transform import resize
from sklearn.decomposition import NMF
import json

def get_image_data():
    img = data.camera()
    img_resized = resize(img, (128, 128), anti_aliasing=True)
    return (img_resized * 255).astype(np.uint8).tolist()

def complete_matrix(img_data, missing_pct, rank=10):
    M = np.array(img_data)
    mask = np.random.rand(*M.shape) > (missing_pct / 100.0)

    masked_M = M * mask

    # Use Non-negative Matrix Factorization for completion
    model = NMF(n_components=rank, init='random', random_state=0, max_iter=500)
    W = model.fit_transform(masked_M)
    H = model.components_

    reconstructed_M = np.dot(W, H)

    return json.dumps({
        "masked": (masked_M).astype(np.uint8).tolist(),
        "reconstructed": np.clip(reconstructed_M, 0, 255).astype(np.uint8).tolist()
    })
`;
    await pyodide.runPythonAsync(pythonCode);
    const get_image_data = pyodide.globals.get('get_image_data');
    const complete_matrix = pyodide.globals.get('complete_matrix');

    function drawImage(canvas, data) {
        const ctx = canvas.getContext('2d');
        const imageData = ctx.createImageData(IMG_SIZE, IMG_SIZE);
        for(let i=0; i < IMG_SIZE*IMG_SIZE; i++) {
            const val = data[Math.floor(i/IMG_SIZE)][i%IMG_SIZE];
            imageData.data.set([val, val, val, 255], i*4);
        }
        ctx.putImageData(imageData, 0, 0);
    }

    const original_img_data = await get_image_data().then(r => r.toJs());
    drawImage(originalCanvas, original_img_data);

    async function runCompletion() {
        runBtn.disabled = true;
        const missing_pct = +pctSlider.value;
        pctVal.textContent = missing_pct;

        const result = await complete_matrix(original_img_data, missing_pct).then(r => JSON.parse(r));

        drawImage(maskedCanvas, result.masked);
        drawImage(reconstructedCanvas, result.reconstructed);

        runBtn.disabled = false;
    }

    pctSlider.addEventListener("input", () => pctVal.textContent = pctSlider.value);
    runBtn.addEventListener("click", runCompletion);

    runCompletion();
}
