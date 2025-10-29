import * as d3 from "https://cdn.skypack.dev/d3@7";
// This widget uses a global THREE variable from the HTML script tag.
// This is not ideal, but it's how the original was structured.

function initConeGeometry(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const select = container.querySelector('#cone-type-select');
    const vizContainer = container.querySelector('#cone-visualization');

    const margin = {top: 20, right: 20, bottom: 30, left: 40};
    const width = 500 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    let animationFrameId = null;

    function clearContainer() {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
        vizContainer.innerHTML = '';
    }

    function drawNormCone() {
        clearContainer();
        const svg = d3.select(vizContainer)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3.scaleLinear().range([0, width]).domain([-5, 5]);
        const y = d3.scaleLinear().range([height, 0]).domain([0, 5]);

        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x));

        svg.append("g")
            .call(d3.axisLeft(y));

        svg.append("path")
            .datum([{x: -5, y: 5}, {x: 0, y: 0}, {x: 5, y: 5}])
            .attr("fill", "rgba(124, 197, 255, 0.5)")
            .attr("stroke", "rgba(124, 197, 255, 1)")
            .attr("stroke-width", 2)
            .attr("d", d3.line()
                .x(d => x(d.x))
                .y(d => y(d.y))
            );
    }

    function drawPsdCone() {
        clearContainer();

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        vizContainer.appendChild(renderer.domElement);

        const geometry = new THREE.ConeGeometry(1, 2, 32);
        const material = new THREE.MeshBasicMaterial({ color: 0x80ffb0, wireframe: true });
        const cone = new THREE.Mesh(geometry, material);
        scene.add(cone);

        camera.position.z = 5;

        function animate() {
            animationFrameId = requestAnimationFrame(animate);
            cone.rotation.x += 0.01;
            cone.rotation.y += 0.01;
            renderer.render(scene, camera);
        }

        animate();
    }

    select.addEventListener('change', (e) => {
        if (e.target.value === 'norm-cone') {
            drawNormCone();
        } else {
            drawPsdCone();
        }
    });

    drawNormCone();
}

initConeGeometry('cone-geometry-container');
