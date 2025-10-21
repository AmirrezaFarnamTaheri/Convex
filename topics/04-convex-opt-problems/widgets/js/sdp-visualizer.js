/**
 * Widget: SDP Visualizer
 *
 * Description: Visualizes the cone of positive semidefinite 2x2 symmetric matrices.
 *              A matrix [[x, y], [y, z]] is PSD iff x>=0, z>=0, and xz - y² >= 0.
 */
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.128/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.128/examples/jsm/controls/OrbitControls.js";

export function initSDPVisualizer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `<div id="sdp-scene-container" style="height: 400px; position: relative;"></div>`;
    const sceneContainer = container.querySelector("#sdp-scene-container");

    // --- SCENE SETUP ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("hsl(225, 18%, 13%)");
    const camera = new THREE.PerspectiveCamera(60, sceneContainer.clientWidth / 400, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(sceneContainer.clientWidth, 400);
    sceneContainer.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    camera.position.set(5, 5, 5);
    controls.target.set(0, 0, 0);

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const light = new THREE.DirectionalLight(0xffffff, 0.8);
    light.position.set(5, 10, 7.5);
    scene.add(light);

    // --- AXES ---
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);
    // Add labels for axes
    const loader = new THREE.FontLoader();
    loader.load('https://cdn.jsdelivr.net/npm/three@0.128/examples/fonts/helvetiker_regular.typeface.json', function (font) {
        const createLabel = (text, position) => {
            const geo = new THREE.TextGeometry(text, { font: font, size: 0.5, height: 0.1 });
            const mat = new THREE.MeshStandardMaterial({ color: 0xffffff });
            const mesh = new THREE.Mesh(geo, mat);
            mesh.position.copy(position);
            scene.add(mesh);
        };
        createLabel('x', new THREE.Vector3(5.5, 0, 0));
        createLabel('y', new THREE.Vector3(0, 5.5, 0));
        createLabel('z', new THREE.Vector3(0, 0, 5.5));
    });


    // --- PSD CONE GEOMETRY ---
    const coneResolution = 50;
    const coneHeight = 4;
    const coneRadius = Math.sqrt(coneHeight * coneHeight); // Since xz=y^2, if x=z=H, y=H

    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const indices = [];

    // Parametric surface for xz = y^2
    for (let i = 0; i < coneResolution; i++) {
        for (let j = 0; j < coneResolution; j++) {
            const u = i / (coneResolution-1); // maps to radius
            const v = j / (coneResolution-1); // maps to angle

            const r = u * coneRadius;
            const theta = v * 2 * Math.PI;

            // We have x>=0, z>=0, xz-y^2 >= 0
            // Let x = r*cos(theta), y = ???, z=r*sin(theta) is not right
            // Let's use a different parameterization
            // x = s^2, z = t^2, y = s*t
            const s = (u-0.5) * 4;
            const t = (v-0.5) * 4;

            const x = s*s;
            const z = t*t;
            const y = s*t;

            if (x < coneHeight && z < coneHeight) {
                // Map to Three.js axes: x -> X, z -> Y, y -> Z
                vertices.push(x, z, y);
            }
        }
    }

    // We can't easily create indices for this, so we'll use a point cloud.
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    const material = new THREE.PointsMaterial({ color: 'cyan', size: 0.05 });
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Let's also try a mesh surface using a different parameterization that's easier to triangulate
    // x = r, z = y^2/r
    const mesh_geometry = new THREE.ParametricGeometry((u, v, target) => {
        const x = u * 4; // u in [0,1] -> x in [0,4]
        const y = (v-0.5) * 4; // v in [0,1] -> y in [-2,2]
        const z = (y*y) / x;
        if(z > 4) return;
        target.set(x, z, y);
    }, 40, 40);

    const mesh_material = new THREE.MeshStandardMaterial({ color: 'cyan', side: THREE.DoubleSide, transparent: true, opacity: 0.8 });
    const surface = new THREE.Mesh(mesh_geometry, mesh_material);
    scene.add(surface);


    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }
    animate();
}
