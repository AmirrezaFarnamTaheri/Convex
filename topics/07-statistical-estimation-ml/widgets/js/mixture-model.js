
import * as d3 from "https://cdn.skypack.dev/d3@7";

function initMixtureModel(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const vizContainer = container.querySelector('#mixture-model-visualization');
    const svg = d3.select(vizContainer).append("svg")
        .attr("width", "100%")
        .attr("height", "100%");

    const width = 600;
    const height = 400;

    // Generate some data
    const data = d3.range(100).map(() => ({
        x: Math.random() * width,
        y: Math.random() * height
    }));

    // Initial centroids
    let centroids = [
        { x: Math.random() * width, y: Math.random() * height },
        { x: Math.random() * width, y: Math.random() * height }
    ];

    function update() {
        // Assign points to closest centroid
        const clusters = data.map(d => {
            let minDist = Infinity;
            let cluster = 0;
            centroids.forEach((c, i) => {
                const dist = Math.sqrt((d.x - c.x)**2 + (d.y - c.y)**2);
                if (dist < minDist) {
                    minDist = dist;
                    cluster = i;
                }
            });
            return { ...d, cluster };
        });

        // Update centroids
        centroids = centroids.map((c, i) => {
            const clusterPoints = clusters.filter(d => d.cluster === i);
            if (clusterPoints.length === 0) return c;
            const newX = d3.mean(clusterPoints, d => d.x);
            const newY = d3.mean(clusterPoints, d => d.y);
            return { x: newX, y: newY };
        });

        // Update visualization
        svg.selectAll("circle.point").data(clusters)
            .join("circle")
            .attr("class", "point")
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
            .attr("r", 5)
            .style("fill", d => d.cluster === 0 ? "var(--color-primary)" : "var(--color-accent)");

        svg.selectAll("circle.centroid").data(centroids)
            .join("circle")
            .attr("class", "centroid")
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
            .attr("r", 10)
            .style("fill", (d, i) => i === 0 ? "var(--color-primary)" : "var(--color-accent)")
            .style("stroke", "white");
    }

    setInterval(update, 1000);
    update();
}

initMixtureModel('mixture-model-container');
