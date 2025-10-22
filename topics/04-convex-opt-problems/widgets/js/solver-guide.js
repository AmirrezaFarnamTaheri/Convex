const recommendations = {
    lp: "For Linear Programs, consider using solvers like Simplex or Interior-Point Methods. Popular open-source options include GLPK and CLP.",
    qp: "For Quadratic Programs, solvers like OSQP or Gurobi are excellent choices. The best choice depends on the problem structure (convex vs. non-convex).",
    socp: "For Second-Order Cone Programs, solvers like ECOS or SCS are designed to handle this type of problem efficiently.",
    sdp: "For Semidefinite Programs, high-performance solvers like MOSEK or SeDuMi are recommended."
};

function initSolverGuide(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const select = container.querySelector('#problem-type');
    const recommendationDiv = container.querySelector('#solver-recommendation');

    function updateRecommendation() {
        recommendationDiv.innerText = recommendations[select.value];
    }

    select.addEventListener('change', updateRecommendation);

    updateRecommendation();
}

initSolverGuide('solver-guide-container');
