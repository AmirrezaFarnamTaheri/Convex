import { getPyodide } from "../../../../static/js/pyodide-manager.js";

export async function initSvdApproximator(containerId) {
    const container = document.querySelector(containerId);
    if (!container) return;

    container.querySelector('.widget-loading-indicator')?.remove();

    const imageUpload = container.querySelector("#image-upload");
    const kSlider = container.querySelector("#k-slider");
    const kValueSpan = container.querySelector("#k-value");
    const infoOutput = container.querySelector("#info-output");
    const originalCanvas = container.querySelector("#original-canvas");
    const approximatedCanvas = container.querySelector("#approximated-canvas");
    const originalCtx = originalCanvas.getContext('2d');
    const approximatedCtx = approximatedCanvas.getContext('2d');

    let U_py, s_py, V_py, img_gray_py;
    const IMG_SIZE = 256;

    const pyodide = await getPyodide();
    await pyodide.loadPackage("scikit-image");

    const pythonCode = `
import numpy as np
from skimage.color import rgb2gray
from skimage import data

def get_default_image():
    # Using a built-in image from scikit-image
    img = data.camera()
    return img.astype(np.float64) / 255.0

def process_image(img_data_js):
    # This function is for user-uploaded images
    img_array = np.array(img_data_js).reshape(${IMG_SIZE}, ${IMG_SIZE}, 4)
    img_gray = rgb2gray(img_array[:, :, :3])
    return img_gray

def perform_svd(image_data):
    U, s, V = np.linalg.svd(image_data, full_matrices=False)
    return {"U": U, "s": s, "V": V}

def approximate(U, s, V, k):
    k = int(k)
    reconstructed_matrix = U[:, :k] @ np.diag(s[:k]) @ V[:k, :]
    return np.clip(reconstructed_matrix, 0, 1)
`;
    await pyodide.runPythonAsync(pythonCode);
    const get_default_image = pyodide.globals.get('get_default_image');
    const process_image = pyodide.globals.get('process_image');
    const perform_svd = pyodide.globals.get('perform_svd');
    const approximate = pyodide.globals.get('approximate');

    async function handleSVD(imageDataPy) {
        const svd_result = await perform_svd(imageDataPy);
        U_py = svd_result.get("U");
        s_py = svd_result.get("s");
        V_py = svd_result.get("V");
        svd_result.destroy();
        updateApproximation();
    }

    function displayGrayscale(grayDataPy, context) {
        const grayData = grayDataPy.toJs();
        const imageData = context.createImageData(IMG_SIZE, IMG_SIZE);
        for(let i=0; i < IMG_SIZE; i++) {
            for(let j=0; j < IMG_SIZE; j++) {
                const val = grayData[i][j] * 255;
                const index = (i * IMG_SIZE + j) * 4;
                imageData.data.set([val, val, val, 255], index);
            }
        }
        context.putImageData(imageData, 0, 0);
    }

    async function updateApproximation() {
        if (!U_py) return;
        const k = +kSlider.value;
        kValueSpan.textContent = k;

        const resultPy = await approximate(U_py, s_py, V_py, k);
        displayGrayscale(resultPy, approximatedCtx);
        resultPy.destroy();

        const original_size = IMG_SIZE * IMG_SIZE;
        const compressed_size = k * (1 + IMG_SIZE + IMG_SIZE);
        const ratio = (compressed_size / original_size) * 100;
        infoOutput.innerHTML = `
            <strong>Rank k = ${k}</strong><br>
            Storage needed: ~${(compressed_size * 4 / 1024).toFixed(1)} KB<br>
            Compression ratio: ${ratio.toFixed(2)}%
        `;
    }

    async function handleImageFile(file) {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = async () => {
            originalCtx.drawImage(img, 0, 0, IMG_SIZE, IMG_SIZE);
            URL.revokeObjectURL(img.src);
            const imageData = originalCtx.getImageData(0, 0, IMG_SIZE, IMG_SIZE);

            img_gray_py = await process_image(imageData.data);
            displayGrayscale(img_gray_py, originalCtx);
            await handleSVD(img_gray_py);
        };
    }

    async function loadDefaultImage() {
        img_gray_py = await get_default_image();
        displayGrayscale(img_gray_py, originalCtx);
        await handleSVD(img_gray_py);
    }

    imageUpload.addEventListener("change", (e) => {
        if (e.target.files && e.target.files[0]) {
            handleImageFile(e.target.files[0]);
        }
    });

    kSlider.addEventListener("input", updateApproximation);

    loadDefaultImage();
}
