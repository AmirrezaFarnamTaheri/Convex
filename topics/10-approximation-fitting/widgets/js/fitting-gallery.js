import * as d3 from "https://cdn.skypack.dev/d3@7";

const galleryItems = [
    { name: "Polynomial", func: (x) => x**2 - 2*x + 1 },
    { name: "Spline", func: (x) => (x > 0 ? x**2 : 0) },
    { name: "Fourier Series", func: (x) => Math.sin(x) + Math.sin(2*x)/2 }
];

function initFittingGallery(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const margin = {top: 20, right: 20, bottom: 30, left: 40};
    const width = 500 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    galleryItems.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'gallery-item';

        const title = document.createElement('h3');
        title.innerText = item.name;
        itemDiv.appendChild(title);

        const svg = d3.select(itemDiv).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3.scaleLinear().range([0, width]).domain([-5, 5]);
        const y = d3.scaleLinear().range([height, 0]).domain([-5, 5]);

        svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));
        svg.append("g").call(d3.axisLeft(y));

        const data = d3.range(-5, 5.1, 0.1).map(d => ({x: d, y: item.func(d)}));

        svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "var(--color-primary)")
            .attr("stroke-width", 2)
            .attr("d", d3.line().x(d => x(d.x)).y(d => y(d.y)));

        container.appendChild(itemDiv);
    });
}

initFittingGallery('fitting-gallery-container');
