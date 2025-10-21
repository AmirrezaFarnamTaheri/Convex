import { getPyodide } from "../../../../static/js/pyodide-manager.js";

async function initSvdApproximator(containerId) {
    const pyodide = await getPyodide();
    await pyodide.loadPackage("scikit-image");
    const container = document.querySelector(containerId);

    const imageUpload = container.querySelector("#image-upload");
    const kSlider = container.querySelector("#k-slider");
    const originalCanvas = container.querySelector("#original-canvas");
    const approximatedCanvas = container.querySelector("#approximated-canvas");
    const originalCtx = originalCanvas.getContext('2d');
    const approximatedCtx = approximatedCanvas.getContext('2d');

    let U, s, V;

    const pythonCode = `
import numpy as np
from skimage.color import rgb2gray
from skimage.transform import resize

def process_image(img_data_js):
    img_array = np.array(img_data_js).reshape(256, 256, 4)
    img_gray = rgb2gray(img_array[:, :, :3])

    U, s, V = np.linalg.svd(img_gray, full_matrices=False)

    return {"U": U, "s": s, "V": V, "gray_image": img_gray}

def approximate(U, s, V, k):
    k = int(k)
    reconstructed_matrix = U[:, :k] @ np.diag(s[:k]) @ V[:k, :]
    # Clip values to be in [0, 1] range for image display
    reconstructed_matrix = np.clip(reconstructed_matrix, 0, 1)
    return reconstructed_matrix
`;
    await pyodide.runPythonAsync(pythonCode);
    const process_image = pyodide.globals.get('process_image');
    const approximate = pyodide.globals.get('approximate');

    async function handleImage(file) {
        const img = new Image();
        const url = URL.createObjectURL(file);
        img.src = url;
        img.onload = async () => {
            originalCtx.drawImage(img, 0, 0, 256, 256);
            URL.revokeObjectURL(url);

            const imageData = originalCtx.getImageData(0, 0, 256, 256);
            const result = await process_image(imageData.data);

            const grayImage = result.get("gray_image").toJs();
            displayGrayscale(grayImage);

            U = result.get("U");
            s = result.get("s");
            V = result.get("V");

            result.destroy();
            updateApproximation();
        };
    }

    function displayGrayscale(grayData) {
        const imageData = originalCtx.createImageData(256, 256);
        for(let i=0; i < grayData.length; i++) {
            for(let j=0; j < grayData[0].length; j++) {
                const val = grayData[i][j] * 255;
                const index = (i * 256 + j) * 4;
                imageData.data[index] = val;
                imageData.data[index + 1] = val;
                imageData.data[index + 2] = val;
                imageData.data[index + 3] = 255;
            }
        }
        originalCtx.putImageData(imageData, 0, 0);
    }

    async function updateApproximation() {
        if (!U) return;
        const k = +kSlider.value;
        const resultPy = await approximate(U, s, V, k);
        const reconstructedData = resultPy.toJs();
        resultPy.destroy();

        const imageData = approximatedCtx.createImageData(256, 256);
        for(let i=0; i < reconstructedData.length; i++) {
            for(let j=0; j < reconstructedData[0].length; j++) {
                const val = reconstructedData[i][j] * 255;
                const index = (i * 256 + j) * 4;
                imageData.data[index] = val;
                imageData.data[index + 1] = val;
                imageData.data[index + 2] = val;
                imageData.data[index + 3] = 255;
            }
        }
        approximatedCtx.putImageData(imageData, 0, 0);
    }

    imageUpload.addEventListener("change", (e) => {
        if (e.target.files && e.target.files[0]) {
            handleImage(e.target.files[0]);
        }
    });

    kSlider.addEventListener("input", updateApproximation);
}

initSvdApproximator(".widget-container");
