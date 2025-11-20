/**
 * Widget: SVD Image Approximator
 *
 * Description: Allows users to upload an image, performs SVD, and shows the
 *              low-rank approximation by adjusting the number of singular values (k).
 *              Includes a visualization of the singular value spectrum.
 * Version: 2.1.0
 */
import { getPyodide } from "../../../../static/js/pyodide-manager.js";
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export async function initSvdApproximator(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container #${containerId} not found.`);
        return;
    }

    // Initial load state
    container.innerHTML = `
        <div class="widget-container" style="height: 500px;">
             <div class="widget-loading">
                <div class="widget-loading-spinner"></div>
                <div>Initializing Python (scikit-image)...</div>
            </div>
        </div>
    `;

    const pyodide = await getPyodide();
    await pyodide.loadPackage("scikit-image");

    // Define Python functions
    const pythonCode = `
import numpy as np
from skimage.color import rgb2gray
from skimage.transform import resize
from skimage import data
import io
from PIL import Image

def process_uploaded_image(img_bytes):
    try:
        img = Image.open(io.BytesIO(img_bytes)).convert('RGB')
        img_array = np.array(img)
        # Resize for performance
        img_resized = resize(img_array, (256, 256), anti_aliasing=True)
        img_gray = rgb2gray(img_resized)
        return img_gray.astype(np.float64)
    except Exception as e:
        return None

def get_default_image():
    img = data.camera()
    return resize(img, (256, 256), anti_aliasing=True).astype(np.float64) / 255.0

def perform_svd(image_data):
    U, s, V = np.linalg.svd(image_data, full_matrices=False)
    return {"U": U, "s": s, "V": V}

def approximate(U, s, V, k):
    k = int(k)
    reconstructed_matrix = U[:, :k] @ np.diag(s[:k]) @ V[:k, :]
    return np.clip(reconstructed_matrix, 0, 1)
`;
    await pyodide.runPythonAsync(pythonCode);

    const pyodideAPI = {
        process_uploaded_image: pyodide.globals.get('process_uploaded_image'),
        get_default_image: pyodide.globals.get('get_default_image'),
        perform_svd: pyodide.globals.get('perform_svd'),
        approximate: pyodide.globals.get('approximate')
    };

    // --- WIDGET LAYOUT ---
    container.innerHTML = `
        <div class="widget-container">
            <div class="widget-controls">
                 <div class="widget-control-group" style="flex: 1;">
                    <label class="widget-label">Source Image</label>
                    <div style="display: flex; gap: 8px;">
                        <label class="widget-btn primary" style="cursor: pointer;">
                            Upload Image <input type="file" id="image-upload" accept="image/*" style="display: none;">
                        </label>
                        <button class="widget-btn" id="reset-btn">Reset Default</button>
                    </div>
                </div>
                <div class="widget-control-group" style="flex: 2;">
                    <label class="widget-label">Singular Values (k): <span id="k-value" class="widget-value-display">1</span></label>
                    <input type="range" id="k-slider" min="1" max="256" value="1" class="widget-slider">
                </div>
            </div>

            <div id="output-stats" class="widget-output" style="display: flex; justify-content: space-between; font-size: 0.85rem;"></div>

            <div style="padding: 16px; background: var(--color-background);">
                <div id="singular-values-chart" style="width: 100%; height: 100px; margin-bottom: 16px;"></div>
                <div class="canvases" style="display: flex; flex-wrap: wrap; gap: 24px; justify-content: center;">
                    <div style="text-align: center;">
                        <h4 style="color: var(--color-text-muted); font-size: 0.9rem; margin-bottom: 8px;">Original</h4>
                        <canvas id="original-canvas" width="256" height="256" style="border: 1px solid var(--color-border); border-radius: 4px;"></canvas>
                    </div>
                    <div style="text-align: center;">
                        <h4 style="color: var(--color-text-muted); font-size: 0.9rem; margin-bottom: 8px;">Approximation (Rank-k)</h4>
                        <canvas id="approximated-canvas" width="256" height="256" style="border: 1px solid var(--color-border); border-radius: 4px;"></canvas>
                    </div>
                </div>
            </div>

            <div id="loading-overlay" class="widget-loading" style="display: none;">
                 <div class="widget-loading-spinner"></div>
                 <div id="loading-text">Processing...</div>
            </div>
        </div>
    `;

    const imageUpload = container.querySelector("#image-upload");
    const resetBtn = container.querySelector("#reset-btn");
    const kSlider = container.querySelector("#k-slider");
    const kValueSpan = container.querySelector("#k-value");
    const infoOutput = container.querySelector("#output-stats");
    const originalCanvas = container.querySelector("#original-canvas");
    const approximatedCanvas = container.querySelector("#approximated-canvas");
    const chartContainer = container.querySelector("#singular-values-chart");
    const loadingOverlay = container.querySelector("#loading-overlay");
    const loadingText = container.querySelector("#loading-text");

    const originalCtx = originalCanvas.getContext('2d');
    const approximatedCtx = approximatedCanvas.getContext('2d');

    let U_py, s_py, V_py;
    const IMG_SIZE = 256;

    function displayGrayscale(grayDataPy, context) {
        const grayData = grayDataPy.toJs({ depth: 2 });
        const imageData = context.createImageData(IMG_SIZE, IMG_SIZE);
        for (let i = 0; i < IMG_SIZE * IMG_SIZE; i++) {
            const val = grayData.flat()[i] * 255;
            imageData.data[i * 4] = val;
            imageData.data[i * 4 + 1] = val;
            imageData.data[i * 4 + 2] = val;
            imageData.data[i * 4 + 3] = 255;
        }
        context.putImageData(imageData, 0, 0);
    }

    async function handleSVD(imageDataPy) {
        loadingText.textContent = "Computing SVD...";
        loadingOverlay.style.display = 'flex';

        // Short delay to allow UI to update
        await new Promise(r => setTimeout(r, 10));

        displayGrayscale(imageDataPy, originalCtx);

        const svd_result = await pyodideAPI.perform_svd(imageDataPy);

        if (U_py) U_py.destroy();
        if (s_py) s_py.destroy();
        if (V_py) V_py.destroy();

        U_py = svd_result.get("U");
        s_py = svd_result.get("s");
        V_py = svd_result.get("V");
        svd_result.destroy();

        kSlider.max = s_py.toJs().length;

        // Reset slider somewhat intelligently - e.g. 10% of rank or 10, whichever larger
        const defaultK = Math.min(20, Math.floor(kSlider.max / 5));
        kSlider.value = defaultK;

        drawSingularValuesChart(s_py.toJs());
        await updateApproximation();
        loadingOverlay.style.display = 'none';
    }

    async function updateApproximation() {
        if (!U_py) return;
        const k = parseInt(kSlider.value, 10);
        kValueSpan.textContent = k;

        const resultPy = await pyodideAPI.approximate(U_py, s_py, V_py, k);
        displayGrayscale(resultPy, approximatedCtx);
        resultPy.destroy();

        const original_size = IMG_SIZE * IMG_SIZE; // Just pixel count proxy
        // SVD storage: U[:, :k] (256*k) + s[:k] (k) + V[:k, :] (k*256)
        const compressed_size = k * (IMG_SIZE + 1 + IMG_SIZE);
        const ratio = (compressed_size / original_size) * 100;

        infoOutput.innerHTML = `
            <div><strong>Compression Ratio:</strong> <span style="color: var(--color-primary);">${ratio.toFixed(1)}%</span></div>
            <div><strong>Pixels:</strong> 65,536</div>
            <div><strong>Params (k=${k}):</strong> ${compressed_size.toLocaleString()}</div>
        `;
        updateChartHighlight(k);
    }

    let chartSvg;
    function drawSingularValuesChart(s) {
        chartContainer.innerHTML = '';
        // Use full width of container
        const margin = { top: 5, right: 10, bottom: 20, left: 40 };
        const width = chartContainer.clientWidth - margin.left - margin.right;
        const height = chartContainer.clientHeight - margin.top - margin.bottom;

        chartSvg = d3.select(chartContainer).append("svg")
            .attr("class", "widget-svg")
            .attr("width", "100%").attr("height", "100%")
            .attr("viewBox", `0 0 ${chartContainer.clientWidth} ${chartContainer.clientHeight}`)
            .append("g").attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3.scaleLinear().domain([1, s.length]).range([0, width]);
        // Log scale for y is better for singular values
        const y = d3.scaleLog().domain([Math.max(1e-10, s[s.length-1]), d3.max(s)]).range([height, 0]);

        chartSvg.append("g").attr("class", "axis").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x).ticks(10));
        chartSvg.append("g").attr("class", "axis").call(d3.axisLeft(y).ticks(3, ".0e"));

        // Bars
        chartSvg.selectAll("rect")
            .data(s)
            .enter().append("rect")
            .attr("class", "sv-bar")
            .attr("x", (d, i) => x(i + 1))
            .attr("y", d => y(d))
            .attr("width", Math.max(1, width / s.length))
            .attr("height", d => height - y(d))
            .attr("fill", "var(--color-surface-2)");
    }

    function updateChartHighlight(k) {
        if (!chartSvg) return;
        chartSvg.selectAll("rect.sv-bar")
            .attr("fill", (d, i) => i < k ? "var(--color-accent)" : "var(--color-surface-2)");
    }

    async function handleImageFile(file) {
        try {
            const buffer = await file.arrayBuffer();
            const img_gray_py = await pyodideAPI.process_uploaded_image(buffer);
            if(!img_gray_py) throw new Error("Processing failed");
            await handleSVD(img_gray_py);
            img_gray_py.destroy();
        } catch (error) {
            console.error(error);
            loadingOverlay.style.display = 'none';
            alert("Error processing image. Please try a valid image file.");
        }
    }

    // --- EVENT LISTENERS ---
    imageUpload.addEventListener("change", (e) => {
        if (e.target.files && e.target.files[0]) handleImageFile(e.target.files[0]);
    });

    resetBtn.addEventListener("click", async () => {
         loadingText.textContent = "Loading default...";
         loadingOverlay.style.display = 'flex';
         const img_gray_py = await pyodideAPI.get_default_image();
         await handleSVD(img_gray_py);
         img_gray_py.destroy();
    });

    kSlider.addEventListener("input", updateApproximation);

    // --- INITIALIZATION ---
    (async () => {
        loadingText.textContent = "Loading default image...";
        loadingOverlay.style.display = 'flex';
        const img_gray_py = await pyodideAPI.get_default_image();
        await handleSVD(img_gray_py);
        img_gray_py.destroy();
    })();
}
