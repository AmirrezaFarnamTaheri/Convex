
import * as d3 from "https://cdn.skypack.dev/d3@7";

function initAdaptiveMethods(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const vizContainer = container.querySelector('#adaptive-methods-visualization');
    const svg = d3.select(vizContainer).append("svg")
        .attr("width", "100%")
        .attr("height", "100%");

    const width = 600;
    const height = 400;

    const x = d3.scaleLinear().range([0, width]).domain([-2, 2]);
    const y = d3.scaleLinear().range([height, 0]).domain([-1, 3]);

    svg.append("g").attr("transform", `translate(0,${height/2})`).call(d3.axisBottom(x));
    svg.append("g").call(d3.axisLeft(y));

    // Simple quadratic function
    const func = (x) => x**2;
    const grad = (x) => 2*x;

    let adam_x = -2;
    let rmsprop_x = -2;

    let adam_m = 0;
    let adam_v = 0;

    let rmsprop_g = 0;

    function update() {
        // Adam
        const adam_grad = grad(adam_x);
        adam_m = 0.9 * adam_m + 0.1 * adam_grad;
        adam_v = 0.999 * adam_v + 0.001 * adam_grad**2;
        const adam_m_hat = adam_m / (1 - 0.9);
        const adam_v_hat = adam_v / (1 - 0.999);
        adam_x -= 0.1 * adam_m_hat / (Math.sqrt(adam_v_hat) + 1e-8);

        // RMSprop
        const rmsprop_grad = grad(rmsprop_x);
        rmsprop_g = 0.9 * rmsprop_g + 0.1 * rmsprop_grad**2;
        rmsprop_x -= 0.1 * rmsprop_grad / (Math.sqrt(rmsprop_g) + 1e-8);

        svg.append("circle")
            .attr("cx", x(adam_x))
            .attr("cy", y(func(adam_x)))
            .attr("r", 3)
            .style("fill", "var(--color-primary)");

        svg.append("circle")
            .attr("cx", x(rmsprop_x))
            .attr("cy", y(func(rmsprop_x)))
            .attr("r", 3)
            .style("fill", "var(--color-accent)");
    }

    d3.interval(update, 100);
}

initAdaptiveMethods('adaptive-methods-container');
