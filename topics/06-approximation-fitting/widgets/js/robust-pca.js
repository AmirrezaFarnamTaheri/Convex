
async function initRobustPca(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const originalCanvas = container.querySelector('#original-canvas');
    const pcaCanvas = container.querySelector('#pca-canvas');
    const rpcaCanvas = container.querySelector('#rpca-canvas');

    const statusDiv = document.createElement('div');
    container.prepend(statusDiv);
    statusDiv.innerText = "Pyodide loading...";

    const pyodide = await loadPyodide();
    await pyodide.loadPackage(["numpy", "scikit-learn"]);
    statusDiv.innerText = "Ready.";

    const rpca_code = `
import numpy as np
from sklearn.decomposition import PCA, TruncatedSVD

def run_rpca():
    # Create a low-rank matrix
    L = np.random.randn(100, 10) @ np.random.randn(10, 100)
    # Add sparse corruption
    S = np.zeros((100, 100))
    S[np.random.randint(0, 100, 50), np.random.randint(0, 100, 50)] = 100
    M = L + S

    # Standard PCA
    pca = PCA(n_components=10)
    L_pca = pca.fit_transform(M)
    L_pca = pca.inverse_transform(L_pca)

    # Robust PCA (via TruncatedSVD on corrupted matrix) - a simplification for visualization
    svd = TruncatedSVD(n_components=10)
    L_rpca = svd.fit_transform(M)
    L_rpca = svd.inverse_transform(L_rpca)

    return M, L_pca, L_rpca

M, L_pca, L_rpca = run_rpca()
`;

    pyodide.runPython(rpca_code);
    const M = pyodide.globals.get("M").toJs();
    const L_pca = pyodide.globals.get("L_pca").toJs();
    const L_rpca = pyodide.globals.get("L_rpca").toJs();

    function drawMatrix(canvas, data) {
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        const imageData = ctx.createImageData(width, height);
        const min = Math.min(...data.flat());
        const max = Math.max(...data.flat());

        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[0].length; j++) {
                const value = (data[i][j] - min) / (max - min) * 255;
                const index = (i * width + j) * 4;
                imageData.data[index] = value;
                imageData.data[index + 1] = value;
                imageData.data[index + 2] = value;
                imageData.data[index + 3] = 255;
            }
        }
        ctx.putImageData(imageData, 0, 0);
    }

    drawMatrix(originalCanvas, M);
    drawMatrix(pcaCanvas, L_pca);
    drawMatrix(rpcaCanvas, L_rpca);
}

initRobustPca('robust-pca-container');
