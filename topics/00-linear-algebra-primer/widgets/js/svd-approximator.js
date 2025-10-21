/**
 * Widget: SVD Image Approximator
 *
 * Description: Allows users to upload an image, performs SVD, and shows the
 *              low-rank approximation by adjusting the number of singular values (k).
 *              Includes a visualization of the singular value spectrum.
 * Version: 2.0.0
 */
import { getPyodide } from "../../../../static/js/pyodide-manager.js";
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export async function initSvdApproximator(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container #${containerId} not found.`);
        return;
    }

    // --- WIDGET LAYOUT ---
    container.innerHTML = `
        <div class="svd-approximator-widget">
            <div class="widget-controls" style="margin-bottom: 15px;">
                <p>Upload a square image or use the default. Drag & drop is supported.</p>
                <input type="file" id="image-upload" accept="image/*">
                <div id="drag-drop-area" style="border: 2px dashed var(--color-surface-1); padding: 20px; text-align: center; margin-top: 10px;">
                    Drop image here
                </div>
                <div class="slider-control" style="margin-top: 15px;">
                    <label for="k-slider">Rank (k): <span id="k-value">1</span></label>
                    <input type="range" id="k-slider" min="1" max="256" value="1" style="width: 100%;">
                </div>
            </div>
            <div id="info-output" class="widget-output" style="margin-bottom: 15px; min-height: 60px;"></div>
            <div id="singular-values-chart" style="width: 100%; height: 150px; margin-bottom: 15px;"></div>
            <div class="canvases" style="display: flex; flex-wrap: wrap; gap: 15px; justify-content: center;">
                <div><h4>Original</h4><canvas id="original-canvas" width="256" height="256"></canvas></div>
                <div><h4>Approximation</h4><canvas id="approximated-canvas" width="256" height="256"></canvas></div>
            </div>
            <div id="loading-overlay" class="widget-loading-indicator" style="display: flex;">Loading Pyodide & scikit-image...</div>
        </div>
    `;

    const imageUpload = container.querySelector("#image-upload");
    const kSlider = container.querySelector("#k-slider");
    const kValueSpan = container.querySelector("#k-value");
    const infoOutput = container.querySelector("#info-output");
    const originalCanvas = container.querySelector("#original-canvas");
    const approximatedCanvas = container.querySelector("#approximated-canvas");
    const chartContainer = container.querySelector("#singular-values-chart");
    const loadingOverlay = container.querySelector("#loading-overlay");
    const dragDropArea = container.querySelector("#drag-drop-area");

    const originalCtx = originalCanvas.getContext('2d');
    const approximatedCtx = approximatedCanvas.getContext('2d');

    let U_py, s_py, V_py;
    const IMG_SIZE = 256;

    const pyodide = await getPyodide();
    loadingOverlay.textContent = "Loading scikit-image...";
    await pyodide.loadPackage("scikit-image");

    const pythonCode = `
import numpy as np
from skimage.color import rgb2gray
from skimage.transform import resize
from skimage import data
import io
from PIL import Image

def process_uploaded_image(img_bytes):
    img = Image.open(io.BytesIO(img_bytes)).convert('RGB')
    img_array = np.array(img)
    # Resize to a standard square size for consistent SVD
    img_resized = resize(img_array, (${IMG_SIZE}, ${IMG_SIZE}), anti_aliasing=True)
    img_gray = rgb2gray(img_resized)
    return img_gray.astype(np.float64)

def get_default_image():
    # Using a built-in, already grayscale image
    img = data.camera()
    return resize(img, (${IMG_SIZE}, ${IMG_SIZE}), anti_aliasing=True).astype(np.float64) / 255.0

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
        loadingOverlay.textContent = "Performing SVD...";
        loadingOverlay.style.display = 'flex';

        displayGrayscale(imageDataPy, originalCtx);

        const svd_result = await pyodideAPI.perform_svd(imageDataPy);
        U_py = svd_result.get("U");
        s_py = svd_result.get("s");
        V_py = svd_result.get("V");
        svd_result.destroy();

        kSlider.max = s_py.toJs().length;

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

        const original_size = IMG_SIZE * IMG_SIZE;
        const compressed_size = k * (1 + IMG_SIZE + IMG_SIZE);
        const ratio = (compressed_size / original_size) * 100;
        infoOutput.innerHTML = `
            <p><strong>Rank k = ${k}</strong></p>
            <p>Storage: ~${(compressed_size * 4 / 1024).toFixed(1)} KB vs. Original: ${(original_size * 4 / 1024).toFixed(1)} KB</p>
            <p><strong>Compression Ratio: ${ratio.toFixed(2)}%</strong> of original size</p>
        `;
        updateChartHighlight(k);
    }

    let chartSvg;
    function drawSingularValuesChart(s) {
        chartContainer.innerHTML = '';
        const margin = { top: 20, right: 20, bottom: 40, left: 50 };
        const width = chartContainer.clientWidth - margin.left - margin.right;
        const height = chartContainer.clientHeight - margin.top - margin.bottom;

        chartSvg = d3.select(chartContainer).append("svg")
            .attr("width", "100%").attr("height", "100%")
            .attr("viewBox", `0 0 ${chartContainer.clientWidth} ${chartContainer.clientHeight}`)
            .append("g").attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3.scaleLinear().domain([1, s.length]).range([0, width]);
        const y = d3.scaleLog().domain([1, d3.max(s)]).range([height, 0]);

        chartSvg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));
        chartSvg.append("g").call(d3.axisLeft(y).ticks(5, ".0e"));

        chartSvg.append("text").attr("x", width/2).attr("y", height + 35).text("Singular Value Index (i)").style("text-anchor", "middle");
        chartSvg.append("text").attr("transform", "rotate(-90)").attr("y", -margin.left+15).attr("x", -height/2).text("Magnitude (σᵢ)").style("text-anchor", "middle");

        chartSvg.selectAll("rect")
            .data(s)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", (d, i) => x(i + 1) - (width / s.length / 2))
            .attr("y", d => y(d))
            .attr("width", Math.max(1, width / s.length))
            .attr("height", d => height - y(d))
            .attr("fill", "var(--color-surface-1)");
    }

    function updateChartHighlight(k) {
        if (!chartSvg) return;
        chartSvg.selectAll("rect.bar")
            .attr("fill", (d, i) => i < k ? "var(--color-primary)" : "var(--color-surface-1)");
    }

    async function handleImageFile(file) {
        try {
            const buffer = await file.arrayBuffer();
            const img_gray_py = await pyodideAPI.process_uploaded_image(buffer);
            await handleSVD(img_gray_py);
            img_gray_py.destroy();
        } catch (error) {
            infoOutput.innerHTML = `<p style="color: #ff6b6b;">Error processing image. Please try another file.</p>`;
            console.error(error);
            loadingOverlay.style.display = 'none';
        }
    }

    // --- EVENT LISTENERS ---
    imageUpload.addEventListener("change", (e) => {
        if (e.target.files && e.target.files[0]) handleImageFile(e.target.files[0]);
    });
    kSlider.addEventListener("input", updateApproximation);

    dragDropArea.addEventListener('dragover', (e) => e.preventDefault());
    dragDropArea.addEventListener('drop', (e) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) handleImageFile(e.dataTransfer.files[0]);
    });

    // --- INITIALIZATION ---
    (async () => {
        loadingOverlay.textContent = "Loading default image...";
        const img_gray_py = await pyodideAPI.get_default_image();
        await handleSVD(img_gray_py);
        img_gray_py.destroy();
    })();
}
