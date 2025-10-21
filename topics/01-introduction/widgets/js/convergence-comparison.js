/**
 * Widget: Convergence Comparison
 *
 * Description: A simple animated plot comparing the convergence rates of a convex solver vs. a generic nonconvex solver on a sample problem.
 */

import * as Chart from "https://cdn.jsdelivr.net/npm/chart.js/+esm";

export function initConvergenceComparison(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container #${containerId} not found.`);
        return;
    }

    const canvas = document.createElement("canvas");
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    const data = {
        labels: [],
        datasets: [{
            label: 'Convex Solver',
            data: [],
            borderColor: 'rgba(54, 162, 235, 1)',
            fill: false,
            tension: 0.1
        }, {
            label: 'Non-convex Solver',
            data: [],
            borderColor: 'rgba(255, 99, 132, 1)',
            fill: false,
            tension: 0.4
        }]
    };

    const chart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            animation: {
                duration: 1000
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Iteration'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Objective Value'
                    }
                }
            }
        }
    });

    let iteration = 0;
    const interval = setInterval(() => {
        if (iteration > 20) {
            clearInterval(interval);
            return;
        }

        // Simulate convergence
        const convexValue = 10 / (iteration + 1);
        const nonconvexValue = 10 / (iteration + 1) + Math.sin(iteration) * 2 + 2; // Add some noise and offset

        chart.data.labels.push(iteration);
        chart.data.datasets[0].data.push(convexValue);
        chart.data.datasets[1].data.push(nonconvexValue);
        chart.update();

        iteration++;
    }, 500);
}
