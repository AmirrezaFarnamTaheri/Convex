/**
 * Widget: SVD Image Approximator
 *
 * Description: Allows users to upload an image, performs SVD, and shows the
 *              low-rank approximation by adjusting the number of singular values (k).
 *              Includes visualizations of the error image and energy retention.
 * Version: 3.1.0 (Styled)
 */
import { getPyodide } from "../../../../static/js/pyodide-manager.js";
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export async function initSvdApproximator(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Initial load state
    container.innerHTML = `
        <div class="widget-container" style="height: 600px;">
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
        img_resized = resize(img_array, (256, 256), anti_aliasing=True)
        img_gray = rgb2gray(img_resized)
        return img_gray.astype(np.float64)
    except: return None

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
                 <div class="control-group" style="flex: 1;">
                    <label style="font-size:var(--text-xs); color:var(--text-tertiary);">Source Image</label>
                    <div style="display: flex; gap: 8px;">
                        <label class="btn btn-primary btn-sm" style="cursor: pointer;">
                            <i data-feather="upload" style="width:14px; margin-right:4px;"></i> Upload
                            <input type="file" id="image-upload" accept="image/*" style="display: none;">
                        </label>
                        <button class="btn btn-ghost btn-sm" id="reset-btn">Default</button>
                    </div>
                </div>
                <div class="control-group" style="flex: 2;">
                    <label style="display:flex; justify-content:space-between; font-size:var(--text-xs); color:var(--text-tertiary);">
                        Rank Approximation ($k$) <span id="k-value" style="font-weight:600; color:var(--primary-400);">1</span>
                    </label>
                    <input type="range" id="k-slider" min="1" max="256" value="1" style="width:100%;">
                </div>
            </div>

            <div id="output-stats" class="widget-output" style="display: flex; justify-content: space-around; font-size: 0.85rem; padding: 12px; background: var(--bg-surface-2); border-bottom:1px solid var(--border-subtle);">
                 <!-- Stats injected here -->
            </div>

            <div style="padding: 16px; background: var(--bg-surface-1); display: flex; flex-direction: column; gap: 24px;">

                <!-- Visualization Row -->
                <div class="canvases" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; justify-items: center;">
                    <div style="text-align: center;">
                        <h4 style="color: var(--text-tertiary); font-size: 0.7rem; margin-bottom: 6px; text-transform: uppercase; letter-spacing:1px;">Original</h4>
                        <canvas id="original-canvas" width="200" height="200" style="width:100%; max-width:200px; border: 1px solid var(--border-subtle); border-radius: 4px; image-rendering: pixelated;"></canvas>
                    </div>
                    <div style="text-align: center;">
                        <h4 style="color: var(--primary-400); font-size: 0.7rem; margin-bottom: 6px; text-transform: uppercase; letter-spacing:1px;">Rank-$k$ Approx</h4>
                        <canvas id="approximated-canvas" width="200" height="200" style="width:100%; max-width:200px; border: 1px solid var(--border-subtle); border-radius: 4px; image-rendering: pixelated;"></canvas>
                    </div>
                    <div style="text-align: center;">
                        <h4 style="color: var(--error); font-size: 0.7rem; margin-bottom: 6px; text-transform: uppercase; letter-spacing:1px;">Residual (Error)</h4>
                        <canvas id="error-canvas" width="200" height="200" style="width:100%; max-width:200px; border: 1px solid var(--border-subtle); border-radius: 4px; image-rendering: pixelated;"></canvas>
                    </div>
                </div>

                <!-- Chart -->
                <div style="position: relative; width: 100%; height: 120px;">
                    <div id="singular-values-chart" style="width: 100%; height: 100%;"></div>
                    <div style="position: absolute; top: 0; right: 10px; font-size: 0.65rem; color: var(--text-tertiary); background:var(--bg-surface-1); padding:2px 4px;">Singular Value Spectrum (log scale)</div>
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
    const errorCanvas = container.querySelector("#error-canvas");
    const chartContainer = container.querySelector("#singular-values-chart");
    const loadingOverlay = container.querySelector("#loading-overlay");
    const loadingText = container.querySelector("#loading-text");

    const originalCtx = originalCanvas.getContext('2d');
    const approximatedCtx = approximatedCanvas.getContext('2d');
    const errorCtx = errorCanvas.getContext('2d');

    let U_py, s_py, V_py, originalDataJs;
    const IMG_SIZE = 256;

    if (typeof feather !== 'undefined') feather.replace();

    function drawToCanvas(dataArr, context, isError = false) {
        const imageData = context.createImageData(IMG_SIZE, IMG_SIZE);
        const pixels = imageData.data;
        for (let i = 0; i < IMG_SIZE * IMG_SIZE; i++) {
            let val = dataArr[i];
            let r, g, b;

            if (isError) {
                const absErr = Math.abs(val);
                const intensity = Math.min(255, Math.floor(absErr * 5 * 255));
                r = intensity; g = Math.floor(intensity * 0.2); b = Math.floor(intensity * 0.2);
            } else {
                const v = Math.min(255, Math.max(0, Math.floor(val * 255)));
                r = v; g = v; b = v;
            }

            pixels[i * 4] = r; pixels[i * 4 + 1] = g; pixels[i * 4 + 2] = b; pixels[i * 4 + 3] = 255;
        }
        if (context.canvas.width !== IMG_SIZE) {
            context.canvas.width = IMG_SIZE; context.canvas.height = IMG_SIZE;
        }
        context.putImageData(imageData, 0, 0);
    }

    async function handleSVD(imageDataPy) {
        loadingText.textContent = "Computing SVD...";
        loadingOverlay.style.display = 'flex';
        await new Promise(r => setTimeout(r, 10));

        originalDataJs = imageDataPy.toJs({depth: 2}).flat();
        drawToCanvas(originalDataJs, originalCtx);

        const svd_result = await pyodideAPI.perform_svd(imageDataPy);

        if (U_py) U_py.destroy();
        if (s_py) s_py.destroy();
        if (V_py) V_py.destroy();

        U_py = svd_result.get("U");
        s_py = svd_result.get("s");
        V_py = svd_result.get("V");
        svd_result.destroy();

        kSlider.max = s_py.toJs().length;
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
        const approxDataJs = resultPy.toJs({depth: 2}).flat();
        resultPy.destroy();

        drawToCanvas(approxDataJs, approximatedCtx);

        const errorData = new Float64Array(originalDataJs.length);
        for(let i=0; i<originalDataJs.length; i++) errorData[i] = originalDataJs[i] - approxDataJs[i];
        drawToCanvas(errorData, errorCtx, true);

        const s = s_py.toJs();
        const totalEnergy = s.reduce((acc, val) => acc + val*val, 0);
        const currentEnergy = s.slice(0, k).reduce((acc, val) => acc + val*val, 0);
        const energyPercent = (currentEnergy / totalEnergy) * 100;
        const ratio = (k * (IMG_SIZE + 1 + IMG_SIZE) / (IMG_SIZE * IMG_SIZE)) * 100;

        infoOutput.innerHTML = `
            <div style="text-align: center;">
                <div style="color: var(--text-tertiary); font-size: 0.65rem; text-transform:uppercase; letter-spacing:0.5px;">Energy Retained</div>
                <div style="color: var(--success); font-weight: 700; font-size: 1.25rem;">${energyPercent.toFixed(1)}%</div>
            </div>
            <div style="text-align: center;">
                <div style="color: var(--text-tertiary); font-size: 0.65rem; text-transform:uppercase; letter-spacing:0.5px;">Compression Size</div>
                <div style="color: var(--primary-400); font-weight: 700; font-size: 1.25rem;">${ratio.toFixed(1)}%</div>
            </div>
        `;

        updateChartHighlight(k);
    }

    let chartSvg;
    function drawSingularValuesChart(s) {
        chartContainer.innerHTML = '';
        const margin = { top: 10, right: 10, bottom: 20, left: 40 };
        const width = chartContainer.clientWidth - margin.left - margin.right;
        const height = chartContainer.clientHeight - margin.top - margin.bottom;

        chartSvg = d3.select(chartContainer).append("svg")
            .attr("class", "widget-svg")
            .attr("width", "100%").attr("height", "100%")
            .attr("viewBox", `0 0 ${chartContainer.clientWidth} ${chartContainer.clientHeight}`)
            .append("g").attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3.scaleLinear().domain([0, s.length]).range([0, width]);
        const y = d3.scaleLog().domain([Math.max(1e-5, s[s.length-1]), d3.max(s)]).range([height, 0]);

        chartSvg.append("g").attr("class", "axis").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x).ticks(5));
        chartSvg.append("g").attr("class", "axis").call(d3.axisLeft(y).ticks(3, ".0e"));

        const area = d3.area().x((d, i) => x(i)).y0(height).y1(d => y(d));
        chartSvg.append("path").datum(s).attr("class", "spectrum-area")
            .attr("fill", "var(--bg-surface-3)").attr("stroke", "var(--border-strong)").attr("stroke-width", 1).attr("d", area);

        chartSvg.append("line").attr("class", "k-line")
            .attr("y1", 0).attr("y2", height).attr("stroke", "var(--accent-400)").attr("stroke-width", 2).attr("stroke-dasharray", "4 4");
    }

    function updateChartHighlight(k) {
        if (!chartSvg) return;
        const width = chartContainer.clientWidth - 50; 
        const x = d3.scaleLinear().domain([0, kSlider.max]).range([0, width]);
        chartSvg.select(".k-line").transition().duration(100).attr("x1", x(k)).attr("x2", x(k));
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
            alert("Error processing image.");
        }
    }

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

    (async () => {
        loadingText.textContent = "Loading default image...";
        loadingOverlay.style.display = 'flex';
        const img_gray_py = await pyodideAPI.get_default_image();
        await handleSVD(img_gray_py);
        img_gray_py.destroy();
    })();
}
