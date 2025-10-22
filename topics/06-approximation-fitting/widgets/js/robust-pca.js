
function initRobustPca(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const originalCanvas = container.querySelector('#original-canvas');
    const pcaCanvas = container.querySelector('#pca-canvas');
    const rpcaCanvas = container.querySelector('#rpca-canvas');

    const ctx = originalCanvas.getContext('2d');
    const pctx = pcaCanvas.getContext('2d');
    const rpctx = rpcaCanvas.getContext('2d');

    // Create a simple corrupted image
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, 200, 200);
    ctx.fillStyle = 'black';
    for (let i = 0; i < 200; i += 20) {
        ctx.fillRect(i, 0, 10, 200);
    }
    for (let i = 0; i < 100; i++) {
        ctx.fillStyle = `rgba(255, 0, 0, ${Math.random()})`;
        ctx.fillRect(Math.random() * 200, Math.random() * 200, 5, 5);
    }

    // Standard PCA (for demonstration, just blurs the image)
    pctx.filter = 'blur(2px)';
    pctx.drawImage(originalCanvas, 0, 0);
    pctx.filter = 'none';

    // Robust PCA (for demonstration, removes the "noise")
    rpctx.fillStyle = 'white';
    rpctx.fillRect(0, 0, 200, 200);
    rpctx.fillStyle = 'black';
    for (let i = 0; i < 200; i += 20) {
        rpctx.fillRect(i, 0, 10, 200);
    }

    console.log("Robust PCA Visualizer Initialized");
}

initRobustPca('robust-pca-container');
