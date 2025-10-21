/**
 * Widget: Convergence Rate
 *
 * Description: Plots the convergence rates of different first-order methods.
 */
import * as Chart from "https://cdn.jsdelivr.net/npm/chart.js/+esm";

export function initConvergenceRate(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container #${containerId} not found.`);
        return;
    }

    const canvas = document.createElement("canvas");
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    // Simulate objective values over iterations for different methods
    const iterations = Array.from({length: 50}, (_, i) => i);
    const gd_values = iterations.map(i => 100 / (i + 1));
    const momentum_values = iterations.map(i => 100 / ((i + 1)**1.5));
    const nesterov_values = iterations.map(i => 100 / ((i + 1)**2));


    const data = {
        labels: iterations,
        datasets: [{
            label: 'Gradient Descent',
            data: gd_values,
            borderColor: 'rgba(255, 99, 132, 1)',
            fill: false,
        }, {
            label: 'Momentum',
            data: momentum_values,
            borderColor: 'rgba(54, 162, 235, 1)',
            fill: false,
        }, {
            label: 'Nesterov Accelerated Gradient',
            data: nesterov_values,
            borderColor: 'rgba(75, 192, 192, 1)',
            fill: false,
        }]
    };

    const chart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Iteration'
                    }
                },
                y: {
                    type: 'logarithmic',
                    title: {
                        display: true,
                        text: 'Objective Value (log scale)'
                    }
                }
            }
        }
    });
}
