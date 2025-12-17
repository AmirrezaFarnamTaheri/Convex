/**
 * Widget: Optimization Landscape Explorer
 *
 * Description: A unified widget combining 1D convexity theory (Jensen's Inequality)
 *              and 3D optimization landscapes (Global vs Local Minima).
 * Version: 1.1.0 (Styled)
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.128/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.128/examples/jsm/controls/OrbitControls.js";
import { getPyodide } from "../../../../static/js/pyodide-manager.js";

export async function initOptimizationLandscape(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // --- LAYOUT STRUCTURE ---
    container.innerHTML = `
        <div class="widget-container">
            <div class="widget-controls" style="border-bottom: 1px solid var(--border-subtle); padding: 0;">
                <div style="display: flex; background: var(--bg-surface-2);">
                    <button class="tab-btn active" data-tab="definition" style="flex: 1; padding: 12px; border: none; background: transparent; color: var(--text-secondary); cursor: pointer; border-bottom: 2px solid transparent;">
                        The Definition (1D)
                    </button>
                    <button class="tab-btn" data-tab="consequence" style="flex: 1; padding: 12px; border: none; background: transparent; color: var(--text-secondary); cursor: pointer; border-bottom: 2px solid transparent;">
                        The Consequence (3D)
                    </button>
                </div>
                <div style="padding: var(--space-4); display: flex; gap: 8px; justify-content: space-between; align-items: center; background: var(--bg-surface-1);">
                    <div id="control-panel-1d" class="control-panel" style="display: flex; gap: 8px; width: 100%;">
                        <select id="func-select-1d" style="flex-grow: 1; padding: 6px; border-radius: 4px; border: 1px solid var(--border-subtle); background: var(--bg-surface-2); color: var(--text-primary);"></select>
                        <button id="clear-1d" class="btn btn-sm btn-ghost">Clear</button>
                    </div>
                    <div id="control-panel-3d" class="control-panel" style="display: none; gap: 8px; width: 100%;">
                        <select id="func-select-3d" style="flex-grow: 1; padding: 6px; border-radius: 4px; border: 1px solid var(--border-subtle); background: var(--bg-surface-2); color: var(--text-primary);"></select>
                        <button id="drop-marble" class="btn btn-sm btn-primary">Drop Marble</button>
                        <button id="reset-marble" class="btn btn-sm btn-ghost" disabled>Reset</button>
                    </div>
                </div>
            </div>

            <div id="view-1d" class="view-section">
                <div class="widget-canvas-container" id="plot-container-1d" style="height: 400px; background: var(--bg-surface-1);"></div>
                <div id="result-display-1d" class="widget-output" style="min-height: 60px; font-size: 0.9rem; display: flex; align-items: center; justify-content: center;">
                    <span style="color: var(--text-secondary);">Click two points on the curve to visualize Jensen's Inequality.</span>
                </div>
            </div>

            <div id="view-3d" class="view-section" style="display: none;">
                <div class="widget-canvas-container" id="plot-container-3d" style="height: 400px; position: relative; background: var(--bg-surface-1);">
                    <div id="loading-3d" class="widget-loading" style="display: none;">
                         <div class="widget-loading-spinner"></div>
                         <div>Initializing Python...</div>
                    </div>
                </div>
                <div class="widget-output" style="text-align: center; font-size: 0.8rem; color: var(--text-tertiary);">
                    <span style="color: var(--accent-400);">Blue = Low Value (Minima)</span> • <span style="color: #ef4444;">Red = High Value (Maxima)</span> • Drag to Rotate
                </div>
            </div>
        </div>
    `;

    const state = {
        currentTab: 'definition',
        pyodideReady: false,
        pyodide: null,
        pyodideAPI: null
    };

    // --- 1D LOGIC ---
    const functions1D = {
        "x² (Convex)": { func: x => x**2, domain: [-2, 2] },
        "eˣ (Convex)": { func: x => Math.exp(x), domain: [-2, 1.5] },
        "|x| (Convex)": { func: x => Math.abs(x), domain: [-2, 2] },
        "x³ (Non-convex)": { func: x => x**3, domain: [-1.5, 1.5] },
        "log(x) (Concave)": { func: x => Math.log(x), domain: [0.2, 4] },
        "Double Well": { func: x => 0.2*x**4 - x**2, domain: [-2.5, 2.5] }
    };

    const plot1D = document.getElementById('plot-container-1d');
    const select1D = document.getElementById('func-select-1d');
    const result1D = document.getElementById('result-display-1d');
    let svg1D, xScale1D, yScale1D, points1D = [];

    function init1D() {
        Object.keys(functions1D).forEach(name => {
            const opt = document.createElement('option');
            opt.value = name; opt.textContent = name;
            select1D.appendChild(opt);
        });

        setupChart1D();
        draw1D();

        select1D.addEventListener('change', () => {
            points1D = []; draw1D();
            result1D.innerHTML = `<span style="color: var(--text-secondary);">Click two points on the curve to visualize Jensen's Inequality.</span>`;
        });

        document.getElementById('clear-1d').addEventListener('click', () => {
            points1D = []; draw1D();
            result1D.innerHTML = `<span style="color: var(--text-secondary);">Click two points on the curve to visualize Jensen's Inequality.</span>`;
        });

        window.addEventListener('resize', () => { if (state.currentTab === 'definition') { setupChart1D(); draw1D(); } });
    }

    function setupChart1D() {
        plot1D.innerHTML = '';
        const margin = { top: 20, right: 20, bottom: 30, left: 40 };
        const width = plot1D.clientWidth - margin.left - margin.right;
        const height = plot1D.clientHeight - margin.top - margin.bottom;

        svg1D = d3.select(plot1D).append("svg")
            .attr("width", "100%").attr("height", "100%")
            .attr("viewBox", `0 0 ${plot1D.clientWidth} ${plot1D.clientHeight}`)
            .append("g").attr("transform", `translate(${margin.left},${margin.top})`);

        svg1D.append("rect").attr("width", width).attr("height", height)
            .attr("fill", "transparent").style("cursor", "crosshair")
            .on("click", handleClick1D);

        xScale1D = d3.scaleLinear().range([0, width]);
        yScale1D = d3.scaleLinear().range([height, 0]);

        svg1D.append("g").attr("class", "x-axis").attr("transform", `translate(0,${height})`);
        svg1D.append("g").attr("class", "y-axis");
        svg1D.append("path").attr("class", "curve").attr("fill", "none").attr("stroke", "var(--primary-500)").attr("stroke-width", 3);
        svg1D.append("g").attr("class", "interaction");
    }

    function draw1D() {
        const spec = functions1D[select1D.value];
        xScale1D.domain(spec.domain);
        const step = (spec.domain[1] - spec.domain[0]) / 200;
        const data = d3.range(spec.domain[0], spec.domain[1] + step, step).map(x => ({ x, y: spec.func(x) }));
        const yExtent = d3.extent(data, d => d.y);
        const yPad = (yExtent[1] - yExtent[0]) * 0.1 || 1;
        yScale1D.domain([yExtent[0] - yPad, yExtent[1] + yPad]);

        const line = d3.line().x(d => xScale1D(d.x)).y(d => yScale1D(d.y));
        svg1D.select(".curve").datum(data).attr("d", line);

        svg1D.select(".x-axis").call(d3.axisBottom(xScale1D).ticks(5));
        svg1D.select(".y-axis").call(d3.axisLeft(yScale1D).ticks(5));

        const g = svg1D.select(".interaction");
        g.selectAll("*").remove();

        points1D.forEach(p => {
            g.append("circle").attr("cx", xScale1D(p.x)).attr("cy", yScale1D(p.y))
                .attr("r", 6).attr("fill", "var(--accent-500)").attr("stroke", "var(--bg-surface-1)").attr("stroke-width", 2);
        });

        if (points1D.length === 2) drawChord1D();
    }

    function handleClick1D(event) {
        if (points1D.length >= 2) points1D = [];
        const [mx] = d3.pointer(event);
        const xVal = xScale1D.invert(mx);
        const spec = functions1D[select1D.value];
        if (xVal < spec.domain[0] || xVal > spec.domain[1]) return;
        points1D.push({ x: xVal, y: spec.func(xVal) });
        points1D.sort((a, b) => a.x - b.x);
        draw1D();
    }

    function drawChord1D() {
        const [p1, p2] = points1D;
        const spec = functions1D[select1D.value];
        const g = svg1D.select(".interaction");

        g.append("line").attr("x1", xScale1D(p1.x)).attr("y1", yScale1D(p1.y))
            .attr("x2", xScale1D(p2.x)).attr("y2", yScale1D(p2.y))
            .attr("stroke", "var(--warning)").attr("stroke-width", 2).attr("stroke-dasharray", "5 5");

        let isConvex = true, isConcave = true;
        for (let t = 0; t <= 1; t += 0.05) {
            const xInter = (1-t)*p1.x + t*p2.x;
            const yChord = (1-t)*p1.y + t*p2.y;
            const yCurve = spec.func(xInter);
            if (yCurve > yChord + 1e-5) isConvex = false;
            if (yCurve < yChord - 1e-5) isConcave = false;
        }

        const areaData = d3.range(0, 1.02, 0.02).map(t => {
            const x = (1-t)*p1.x + t*p2.x;
            return { x, yChord: (1-t)*p1.y + t*p2.y, yCurve: spec.func(x) };
        });

        const area = d3.area().x(d => xScale1D(d.x)).y0(d => yScale1D(d.yChord)).y1(d => yScale1D(d.yCurve));
        let color = isConvex ? "var(--success)" : (isConcave ? "var(--warning)" : "var(--error)");
        let message = isConvex
            ? `<strong style="color: var(--success)">✓ Jensen's Inequality Holds:</strong> Chord is above curve.`
            : (isConcave ? `<strong style="color: var(--warning)">⚠ Locally Concave:</strong> Chord is below curve.`
                         : `<strong style="color: var(--error)">✕ Non-Convex:</strong> Chord crosses the curve.`);

        g.append("path").datum(areaData).attr("d", area).attr("fill", color).attr("fill-opacity", 0.2);
        result1D.innerHTML = message;
    }

    // --- 3D LOGIC ---
    const pythonCode = `
import numpy as np
FUNCTIONS = {
    "Convex Bowl": { "func": lambda x, y: 0.5*(x**2 + y**2), "grad": lambda x, y: np.array([x, y]), "domain": 3.0 },
    "Rosenbrock": { "func": lambda x, y: 0.1*((1 - x)**2 + 10 * (y - x**2)**2), "grad": lambda x, y: np.array([0.1*(-2*(1-x) - 40*x*(y-x**2)), 0.1*(20*(y-x**2))]), "domain": 2.0 },
    "Multi-Modal": { "func": lambda x, y: x**2 + y**2 - 2*np.cos(2*np.pi*x) - 2*np.cos(2*np.pi*y) + 4, "grad": lambda x, y: np.array([2*x + 4*np.pi*np.sin(2*np.pi*x), 2*y + 4*np.pi*np.sin(2*np.pi*y)]), "domain": 2.0 },
    "Saddle Point": { "func": lambda x, y: x**2 - y**2, "grad": lambda x, y: np.array([2*x, -2*y]), "domain": 2.0 }
}
def calculate_surface(name, n=60):
    spec = FUNCTIONS[name]
    d = float(spec['domain'])
    x = np.linspace(-d, d, n)
    y = np.linspace(-d, d, n)
    xx, yy = np.meshgrid(x, y)
    return {"z": spec['func'](xx, yy).tolist(), "domain": d}
def get_grad(name, x, y):
    spec = FUNCTIONS[name]
    return {"z": float(spec['func'](x, y)), "grad": spec['grad'](x, y).tolist()}
list(FUNCTIONS.keys())
`;

    let scene, camera, renderer, surfaceMesh, marbleMesh, controls, isAnimating = false, currentFunc3D;

    async function init3D() {
        const plot3D = document.getElementById('plot-container-3d');
        const loading = document.getElementById('loading-3d');
        loading.style.display = 'flex';

        if (!state.pyodideReady) {
            state.pyodide = await getPyodide();
            await state.pyodide.loadPackage("numpy");
            const keys = await state.pyodide.runPythonAsync(pythonCode);
            state.pyodideAPI = { calc: state.pyodide.globals.get('calculate_surface'), grad: state.pyodide.globals.get('get_grad') };
            const select3D = document.getElementById('func-select-3d');
            keys.toJs().forEach(k => {
                const opt = document.createElement('option');
                opt.value = k; opt.textContent = k; select3D.appendChild(opt);
            });
            state.pyodideReady = true;
            select3D.addEventListener('change', updateSurface3D);
            document.getElementById('drop-marble').addEventListener('click', startMarble);
            document.getElementById('reset-marble').addEventListener('click', resetMarble);
        }

        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0f172a); 

        camera = new THREE.PerspectiveCamera(45, plot3D.clientWidth / plot3D.clientHeight, 0.1, 100);
        camera.position.set(8, 8, 6); camera.up.set(0, 0, 1);

        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(plot3D.clientWidth, plot3D.clientHeight);
        plot3D.appendChild(renderer.domElement);

        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;

        scene.add(new THREE.AmbientLight(0xffffff, 0.6));
        const dl = new THREE.DirectionalLight(0xffffff, 0.7);
        dl.position.set(5, 5, 10); scene.add(dl);

        const geo = new THREE.PlaneGeometry(6, 6, 59, 59);
        const mat = new THREE.MeshStandardMaterial({ vertexColors: true, side: THREE.DoubleSide, flatShading: false });
        surfaceMesh = new THREE.Mesh(geo, mat);
        scene.add(surfaceMesh);

        loading.style.display = 'none';
        updateSurface3D();
        animate3D();
    }

    async function updateSurface3D() {
        const name = document.getElementById('func-select-3d').value;
        currentFunc3D = name;
        resetMarble();

        const res = state.pyodideAPI.calc(name);
        const zFlat = res.toJs().z.flat();
        const posAttr = surfaceMesh.geometry.attributes.position;
        const colors = new Float32Array(posAttr.count * 3);
        let minZ = Math.min(...zFlat), maxZ = Math.max(...zFlat), range = maxZ - minZ || 1;

        for(let i=0; i<posAttr.count; i++) {
            const z = zFlat[i];
            posAttr.setZ(i, z);
            const t = (z - minZ) / range;
            const color = new THREE.Color().setHSL(0.66 * (1 - t), 0.8, 0.5);
            colors[i*3] = color.r; colors[i*3+1] = color.g; colors[i*3+2] = color.b;
        }
        posAttr.needsUpdate = true;
        surfaceMesh.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        surfaceMesh.geometry.computeVertexNormals();
    }

    function animate3D() {
        if (!document.getElementById('plot-container-3d')) return;
        requestAnimationFrame(animate3D);
        controls.update();
        renderer.render(scene, camera);
    }

    async function startMarble() {
        if (isAnimating) return;
        isAnimating = true;
        document.getElementById('drop-marble').disabled = true;
        document.getElementById('reset-marble').disabled = false;

        marbleMesh = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), new THREE.MeshStandardMaterial({ color: 0xffffff }));
        scene.add(marbleMesh);

        let x = -1.8, y = -1.8, vx = 0, vy = 0;
        const loop = async () => {
            if (!isAnimating) return;
            const res = state.pyodideAPI.grad(currentFunc3D, x, y);
            const { z, grad } = res.toJs();
            vx = vx * 0.9 - grad[0] * 0.01;
            vy = vy * 0.9 - grad[1] * 0.01;
            x += vx; y += vy;
            const scale = 3.0 / 2.0; 
            marbleMesh.position.set(x * scale, y * scale, z + 0.15);

            if (Math.abs(x) < 3 && Math.abs(y) < 3 && (Math.abs(vx) > 0.001 || Math.abs(vy) > 0.001)) {
                requestAnimationFrame(loop);
            } else { isAnimating = false; }
        };
        loop();
    }

    function resetMarble() {
        isAnimating = false;
        if (marbleMesh) scene.remove(marbleMesh);
        document.getElementById('drop-marble').disabled = false;
        document.getElementById('reset-marble').disabled = true;
    }

    const tabs = container.querySelectorAll('.tab-btn');
    tabs.forEach(btn => {
        btn.addEventListener('click', () => {
            tabs.forEach(b => {
                b.classList.remove('active');
                b.style.borderBottomColor = 'transparent';
                b.style.color = 'var(--text-secondary)';
            });
            btn.classList.add('active');
            btn.style.borderBottomColor = 'var(--primary-500)';
            btn.style.color = 'var(--primary-500)';
            
            const tab = btn.dataset.tab;
            state.currentTab = tab;

            if (tab === 'definition') {
                document.getElementById('view-1d').style.display = 'block';
                document.getElementById('control-panel-1d').style.display = 'flex';
                document.getElementById('view-3d').style.display = 'none';
                document.getElementById('control-panel-3d').style.display = 'none';
            } else {
                document.getElementById('view-1d').style.display = 'none';
                document.getElementById('control-panel-1d').style.display = 'none';
                document.getElementById('view-3d').style.display = 'block';
                document.getElementById('control-panel-3d').style.display = 'flex';
                if (!state.pyodideReady) init3D();
            }
        });
    });

    init1D();
}
