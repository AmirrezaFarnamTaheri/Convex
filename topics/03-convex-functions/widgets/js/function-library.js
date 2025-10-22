const functions = [
    {
        name: "Quadratic: f(x) = ax^2 + bx + c",
        properties: ["Convex for a > 0", "Differentiable"]
    },
    {
        name: "Exponential: f(x) = e^(ax)",
        properties: ["Convex", "Differentiable"]
    },
    {
        name: "Negative Logarithm: f(x) = -log(x)",
        properties: ["Convex for x > 0", "Differentiable"]
    },
    {
        name: "Absolute Value: f(x) = |x|",
        properties: ["Convex", "Not Differentiable at x=0"]
    }
];

function initFunctionLibrary(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    functions.forEach(func => {
        const card = document.createElement('div');
        card.className = 'function-card';

        let propertiesHtml = '';
        func.properties.forEach(prop => {
            propertiesHtml += `<span>${prop}</span>`;
        });

        card.innerHTML = `
            <h3>${func.name}</h3>
            <div class="function-properties">${propertiesHtml}</div>
        `;
        container.appendChild(card);
    });
}

initFunctionLibrary('function-library-container');
