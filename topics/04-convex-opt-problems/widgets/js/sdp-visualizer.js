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
                <p>Visualizing the set of 2x2 symmetric positive semidefinite matrices.</p>
                <div class="widget-output">
                    <p>A matrix M = [[x, z], [z, y]] is PSD if and only if:</p>
                    <ul>
                        <li>x ≥ 0</li>
                        <li>y ≥ 0</li>
                        <li>xy - z² ≥ 0 (determinant is non-negative)</li>
                    </ul>
                </div>
            </div>
        </div>
    `;
    const sceneContainer = container.querySelector("#sdp-scene-container");

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

    animate();
}
