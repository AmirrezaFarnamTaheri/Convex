const problems = [
    {
        title: "Portfolio Optimization",
        category: "Finance",
        description: "Selecting a portfolio of assets to maximize expected return for a given level of risk (variance)."
    },
    {
        title: "Optimal Resource Allocation",
        category: "Operations Research",
        description: "Determining the allocation of scarce resources to tasks in a way that minimizes cost or maximizes profit."
    },
    {
        title: "Medical Imaging",
        category: "Healthcare",
        description: "Reconstructing a clear image from noisy or incomplete sensor data, such as in MRI or CT scans."
    },
    {
        title: "Machine Learning (SVM)",
        category: "Machine Learning",
        description: "Finding the optimal hyperplane that separates data points of different classes with the maximum margin."
    },
    {
        title: "Energy Management",
        category: "Energy",
        description: "Optimizing the generation, storage, and consumption of energy in a smart grid to reduce costs and meet demand."
    },
    {
        title: "Robotics Path Planning",
        category: "Robotics",
        description: "Finding the shortest or most efficient path for a robot to take while avoiding obstacles."
    }
];

function initProblemGallery(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const grid = container.querySelector('#gallery-grid');
    const searchInput = container.querySelector('#gallery-search');

    function renderGallery(filter = '') {
        grid.innerHTML = '';
        const filteredProblems = problems.filter(p =>
            p.title.toLowerCase().includes(filter) ||
            p.category.toLowerCase().includes(filter) ||
            p.description.toLowerCase().includes(filter)
        );

        filteredProblems.forEach(problem => {
            const card = document.createElement('div');
            card.className = 'gallery-card';
            card.innerHTML = `
                <h3>${problem.title}</h3>
                <div class="category">${problem.category}</div>
                <p>${problem.description}</p>
            `;
            grid.appendChild(card);
        });
    }

    searchInput.addEventListener('input', (e) => {
        renderGallery(e.target.value.toLowerCase());
    });

    renderGallery();
}

initProblemGallery('problem-gallery-container');
