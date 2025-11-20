/**
 * Widget: Problem Gallery
 *
 * Description: A filterable gallery of real-world optimization problems.
 * Version: 2.1.0
 */

const problems = [
    {
        title: "Portfolio Optimization",
        type: "QP",
        category: "Finance",
        description: "Maximize expected return for a given level of risk (variance). The risk constraint is quadratic (xᵀΣx ≤ γ), making this a QP or SOCP.",
        icon: "📈"
    },
    {
        title: "Resource Allocation",
        type: "LP",
        category: "Operations",
        description: "Allocate scarce resources (raw materials, labor) to maximize profit. Constraints are linear inequalities, objective is linear.",
        icon: "🏭"
    },
    {
        title: "Support Vector Machine",
        type: "QP",
        category: "Machine Learning",
        description: "Find the hyperplane that separates classes with maximum margin. The margin maximization is a convex quadratic objective.",
        icon: "🤖"
    },
    {
        title: "Robust Antenna Design",
        type: "SOCP",
        category: "Engineering",
        description: "Design antenna array weights to minimize side lobes while maintaining gain. Robustness against errors adds norm constraints.",
        icon: "📡"
    },
    {
        title: "Network Flow",
        type: "LP",
        category: "Logistics",
        description: "Route traffic or goods through a network to minimize cost or latency, subject to capacity constraints on edges.",
        icon: "🚚"
    },
    {
        title: "Matrix Completion",
        type: "SDP",
        category: "Data Science",
        description: "Recover a low-rank matrix (e.g., user ratings) from sparse observations. The nuclear norm relaxation leads to an SDP.",
        icon: "🧩"
    },
    {
        title: "Control System Design",
        type: "SDP",
        category: "Control",
        description: "Find a feedback controller that stabilizes a system. Stability conditions (Lyapunov inequalities) are linear matrix inequalities (LMIs).",
        icon: "🎮"
    },
    {
        title: "Truss Topology Design",
        type: "LP",
        category: "Structural Eng",
        description: "Determine the optimal layout of bars in a truss to support a load with minimum weight. Can often be formulated as a large LP.",
        icon: "🏗️"
    }
];

export function initProblemGallery(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // --- WIDGET LAYOUT ---
    container.innerHTML = `
        <div class="widget-container">
            <div class="widget-controls" style="background: var(--color-surface-2);">
                <div class="widget-control-group" style="flex: 1;">
                     <input type="text" id="gallery-search" class="widget-input" placeholder="Search problems (e.g., 'Finance', 'QP')..." style="width: 100%;">
                </div>
                <div class="widget-control-group">
                    <select id="type-filter" class="widget-select">
                        <option value="All">All Types</option>
                        <option value="LP">LP</option>
                        <option value="QP">QP</option>
                        <option value="SOCP">SOCP</option>
                        <option value="SDP">SDP</option>
                    </select>
                </div>
            </div>

            <div id="gallery-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 16px; padding: 16px; max-height: 500px; overflow-y: auto; background: var(--color-surface-1);">
                <!-- Cards go here -->
            </div>

            <div class="widget-output" style="text-align: right; font-size: 0.8rem; color: var(--color-text-muted);">
                Showing <span id="count-display">0</span> problems
            </div>
        </div>
    `;

    const grid = container.querySelector('#gallery-grid');
    const searchInput = container.querySelector('#gallery-search');
    const typeSelect = container.querySelector('#type-filter');
    const countDisplay = container.querySelector('#count-display');

    function renderGallery() {
        const searchTerm = searchInput.value.toLowerCase();
        const typeFilter = typeSelect.value;

        grid.innerHTML = '';

        const filteredProblems = problems.filter(p => {
            const matchesSearch =
                p.title.toLowerCase().includes(searchTerm) ||
                p.category.toLowerCase().includes(searchTerm) ||
                p.description.toLowerCase().includes(searchTerm);

            const matchesType = typeFilter === "All" || p.type === typeFilter;

            return matchesSearch && matchesType;
        });

        countDisplay.textContent = filteredProblems.length;

        if (filteredProblems.length === 0) {
            grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--color-text-muted); padding: 40px;">No matching problems found.</div>`;
            return;
        }

        filteredProblems.forEach(problem => {
            const card = document.createElement('div');
            // Inline styles for card within grid
            card.style.cssText = `
                background: var(--color-surface-2);
                border: 1px solid var(--color-border);
                border-radius: 8px;
                padding: 16px;
                display: flex;
                flex-direction: column;
                gap: 8px;
                transition: transform 0.2s, border-color 0.2s;
            `;
            card.onmouseenter = () => {
                card.style.transform = "translateY(-2px)";
                card.style.borderColor = "var(--color-primary)";
            };
            card.onmouseleave = () => {
                card.style.transform = "translateY(0)";
                card.style.borderColor = "var(--color-border)";
            };

            // Type Badge Color
            let badgeColor = "var(--color-text-muted)";
            if (problem.type === "LP") badgeColor = "var(--color-success)";
            if (problem.type === "QP") badgeColor = "var(--color-primary)";
            if (problem.type === "SOCP") badgeColor = "var(--color-accent)";
            if (problem.type === "SDP") badgeColor = "#fbbf24";

            card.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="font-size: 1.5rem;">${problem.icon}</div>
                    <div style="background: ${badgeColor}; color: #000; font-size: 0.75rem; font-weight: bold; padding: 2px 6px; border-radius: 4px;">${problem.type}</div>
                </div>
                <h3 style="font-size: 1.1rem; margin: 0; color: var(--color-text-main);">${problem.title}</h3>
                <div style="font-size: 0.85rem; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.5px;">${problem.category}</div>
                <p style="font-size: 0.9rem; color: var(--color-text-secondary); line-height: 1.4; flex-grow: 1;">${problem.description}</p>
            `;
            grid.appendChild(card);
        });
    }

    searchInput.addEventListener('input', renderGallery);
    typeSelect.addEventListener('change', renderGallery);

    renderGallery();
}
