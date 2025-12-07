/**
 * Widget: SDP Cone Visualizer
 *
 * Description: Visualizes the cone of positive semidefinite 2x2 symmetric matrices.
 *              A matrix [[x, z], [z, y]] is PSD iff x≥0, y≥0, and xy - z² ≥ 0.
 * Version: 2.0.0
 */
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.128/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.128/examples/jsm/controls/OrbitControls.js";

export function initSDPVisualizer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // --- WIDGET LAYOUT ---
    container.innerHTML = `
        <div class="sdp-visualizer-widget">
            <div id="sdp-scene-container" style="width: 100%; height: 400px; position: relative;"></div>
            <div class="widget-controls" style="padding: 15px;">
                <h4>Matrix Controls</h4>
                <div class="control-row">
                    <label for="x-slider">x (M₁₁):</label>
                    <input type="range" id="x-slider" min="0" max="4" step="0.1" value="2">
                </div>
                <div class="control-row">
                    <label for="y-slider">y (M₂₂):</label>
                    <input type="range" id="y-slider" min="0" max="4" step="0.1" value="2">
                </div>
                <div class="control-row">
                    <label for="z-slider">z (M₁₂):</label>
                    <input type="range" id="z-slider" min="-3" max="3" step="0.1" value="1">
                </div>
                <div id="matrix-display" class="widget-output" style="margin-top: 10px;"></div>
            </div>
        </div>
    `;
    const sceneContainer = container.querySelector("#sdp-scene-container");
    const xSlider = container.querySelector("#x-slider");
    const ySlider = container.querySelector("#y-slider");
    const zSlider = container.querySelector("#z-slider");
    const matrixDisplay = container.querySelector("#matrix-display");

    let pointSphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.15, 32, 32),
        new THREE.MeshBasicMaterial({ color: 'red' })
    );

    // --- SCENE SETUP ---
    const scene = new THREE.Scene();
    const bodyStyles = window.getComputedStyle(document.body);
    const bgColor = bodyStyles.getPropertyValue('--color-background') || '#0b0d12';
    scene.background = new THREE.Color(bgColor.trim());

    const camera = new THREE.PerspectiveCamera(60, sceneContainer.clientWidth / sceneContainer.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(sceneContainer.clientWidth, sceneContainer.clientHeight);
    sceneContainer.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    camera.position.set(3, 3, 3);
    controls.target.set(1.5, 1.5, 0);

    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const light = new THREE.DirectionalLight(0xffffff, 0.6);
    light.position.set(5, 10, 7.5);
    scene.add(light);

    // --- AXES ---
    const axesHelper = new THREE.AxesHelper(4);
    scene.add(axesHelper);

    const fontLoader = new THREE.FontLoader();
    fontLoader.load('https://cdn.jsdelivr.net/npm/three@0.128/examples/fonts/helvetiker_regular.typeface.json', (font) => {
        const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const createLabel = (text, position) => {
            const textGeo = new THREE.TextGeometry(text, { font: font, size: 0.2, height: 0.02 });
            const textMesh = new THREE.Mesh(textGeo, textMaterial);
            textMesh.position.copy(position);
            scene.add(textMesh);
        };
        createLabel('x (M₁₁)', new THREE.Vector3(4.1, 0, 0));
        createLabel('y (M₂₂)', new THREE.Vector3(0, 4.1, 0));
        createLabel('z (M₁₂)', new THREE.Vector3(0, 0, 3.1));
    });

    // --- PSD CONE GEOMETRY ---
    // The surface is xy = z², with x>=0, y>=0.
    const geometry = new THREE.ParametricGeometry((u, v, target) => {
        const s = u * 4; // s from 0 to 4
        const t = (v - 0.5) * 4; // t from -2 to 2

        const x = s*s;
        const y = t*t;
        const z = s*t;

        // Map to axes: M11 -> x, M22 -> y, M12 -> z
        target.set(x, y, z);
    }, 60, 60);

    const material = new THREE.MeshStandardMaterial({
        color: 'cyan',
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
    });
    const surface = new THREE.Mesh(geometry, material);
    scene.add(surface);
    scene.add(pointSphere);

    function updatePoint() {
        const x = +xSlider.value;
        const y = +ySlider.value;
        const z = +zSlider.value;
        pointSphere.position.set(x, y, z);
        const det = x * y - z * z;
        const isPSD = det >= 0;
        pointSphere.material.color.set(isPSD ? 'var(--color-success)' : 'var(--color-danger)');

        matrixDisplay.innerHTML = `
            <p>M = <span class="matrix">[[${x.toFixed(1)}, ${z.toFixed(1)}], [${z.toFixed(1)}, ${y.toFixed(1)}]]</span></p>
            <p>Determinant: <strong>${det.toFixed(2)}</strong></p>
            <p>Status: <strong style="color: ${isPSD ? 'var(--color-success)' : 'var(--color-danger)'}">${isPSD ? 'Positive Semidefinite' : 'Not PSD'}</strong></p>
        `;
    }

    xSlider.addEventListener('input', updatePoint);
    ySlider.addEventListener('input', updatePoint);
    zSlider.addEventListener('input', updatePoint);

    // --- ANIMATION & RESIZE ---
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }

    new ResizeObserver(() => {
        camera.aspect = sceneContainer.clientWidth / sceneContainer.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(sceneContainer.clientWidth, sceneContainer.clientHeight);
    }).observe(sceneContainer);

    updatePoint();
    animate();
}
