/**
 * Widget: Polyhedron Visualizer
 *
 * Description: Interactively define a polyhedron by adding and manipulating
 *              linear inequality constraints (a₁x₁ + a₂x₂ ≤ b).
 * Version: 2.1.0 (Refined)
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { polygonClip } from "https://cdn.jsdelivr.net/npm/d3-polygon@3/+esm";

export function initPolyhedronVisualizer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="polyhedron-visualizer-widget">
            <div id="plot-area" class="plot-area"></div>
            <div class="controls-area">
                <h4>Constraints (a₁x₁ + a₂x₂ ≤ b)</h4>
                <div id="constraints-list"></div>
                <div class="add-constraint-form">
                    <input type="number" id="a1" value="1.0" step="0.1">
                    <input type="number" id="a2" value="1.0" step="0.1">
                    <span>x ≤</span>
                    <input type="number" id="b" value="2.0" step="0.1">
                    <button id="add-btn" class="widget-button">Add</button>
                </div>
            </div>
        </div>
    `;

    const plotArea = container.querySelector("#plot-area");
    const constraintsList = container.querySelector("#constraints-list");
    const addBtn = container.querySelector("#add-btn");
    let constraints = [];
    let svg, x, y;
    const domain = 10;

    function setupChart() {
        plotArea.innerHTML = '';
        const margin = { top: 20, right: 20, bottom: 20, left: 20 };
        const width = plotArea.clientWidth - margin.left - margin.right;
        const height = plotArea.clientHeight - margin.top - margin.bottom;

        svg = d3.select(plotArea).append("svg")
            .attr("width", "100%").attr("height", "100%")
            .attr("viewBox", `0 0 ${plotArea.clientWidth} ${plotArea.clientHeight}`)
            .append("g").attr("transform", `translate(${margin.left},${margin.top})`);

        x = d3.scaleLinear().domain([-domain, domain]).range([0, width]);
        y = d3.scaleLinear().domain([-domain, domain]).range([height, 0]);

        svg.append("g").attr("class", "grid").call(d3.axisBottom(x).ticks(10).tickSize(-height).tickFormat(""));
        svg.append("g").attr("class", "grid").call(d3.axisLeft(y).ticks(10).tickSize(-width).tickFormat(""));
        svg.append("g").attr("class", "axis x-axis").attr("transform",`translate(0,${y(0)})`).call(d3.axisBottom(x).ticks(5));
        svg.append("g").attr("class", "axis y-axis").attr("transform",`translate(${x(0)},0)`).call(d3.axisLeft(y).ticks(5));

        svg.append("path").attr("class", "feasible-region");
        svg.append("g").attr("class", "constraint-elements");
    }

    function update() {
        renderConstraintsList();
        renderFeasibleRegion();
    }

    function renderConstraintsList() {
        constraintsList.innerHTML = '';
        constraints.forEach((c, i) => {
            const div = document.createElement("div");
            div.className = 'constraint-item';
            div.innerHTML = `
                <code>${c.a[0].toFixed(2)}x₁ + ${c.a[1].toFixed(2)}x₂ ≤ ${c.b.toFixed(2)}</code>
                <button data-index="${i}" class="delete-btn">×</button>
            `;
            div.addEventListener('mouseenter', () => highlightHalfSpace(i));
            div.addEventListener('mouseleave', () => svg.select(".half-space-highlight").remove());
            div.querySelector('.delete-btn').onclick = () => {
                constraints.splice(i, 1);
                update();
            };
            constraintsList.appendChild(div);
        });
    }

    function renderFeasibleRegion() {
        const fullBounds = [[-domain, -domain], [domain, -domain], [domain, domain], [-domain, domain]];
        let subjectPolygon = fullBounds;

        constraints.forEach(c => {
            const clipPolygon = halfPlaneToPolygon(c);
            subjectPolygon = polygonClip(clipPolygon, subjectPolygon);
        });

        const line = d3.line().x(d => x(d[0])).y(d => y(d[1]));

        if (subjectPolygon && subjectPolygon.length > 0) {
            svg.select(".feasible-region").attr("d", line(subjectPolygon) + "Z");
        } else {
            svg.select(".feasible-region").attr("d", null);
        }
    }

    function halfPlaneToPolygon({a, b}) {
        const norm_a = Math.sqrt(a[0]**2 + a[1]**2);
        if (norm_a < 1e-9) return [[-domain,-domain], [domain,-domain], [domain,domain], [-domain,domain]];

        const p0 = [a[0]*b/norm_a**2, a[1]*b/norm_a**2];
        const v = [a[1]/norm_a, -a[0]/norm_a];

        const p1 = [p0[0] + domain * 2 * v[0], p0[1] + domain * 2 * v[1]];
        const p2 = [p0[0] - domain * 2 * v[0], p0[1] - domain * 2 * v[1]];

        const p3 = [p2[0] - domain * 2 * a[0]/norm_a, p2[1] - domain * 2 * a[1]/norm_a];
        const p4 = [p1[0] - domain * 2 * a[0]/norm_a, p1[1] - domain * 2 * a[1]/norm_a];

        return [p1, p2, p3, p4];
    }

    function highlightHalfSpace(index) {
        svg.select(".half-space-highlight").remove();
        const polygon = halfPlaneToPolygon(constraints[index]);
        svg.insert("path", ":first-child")
            .attr("class", "half-space-highlight")
            .attr("d", d3.line().x(d => x(d[0])).y(d => y(d[1]))(polygon) + "Z");
    }

    addBtn.onclick = () => {
        const a1 = parseFloat(container.querySelector("#a1").value);
        const a2 = parseFloat(container.querySelector("#a2").value);
        const b = parseFloat(container.querySelector("#b").value);
        if (!isNaN(a1) && !isNaN(a2) && !isNaN(b)) {
            constraints.push({ a: [a1, a2], b: b });
            update();
        }
    };

    new ResizeObserver(setupChart).observe(plotArea);
    setupChart();
    // Add default constraints
    constraints = [ { a: [-1, 0], b: 0 }, { a: [0, -1], b: 0 }, { a: [1, 1], b: 4 } ];
    update();
}

const style = document.createElement('style');
style.textContent = `
.polyhedron-visualizer-widget { display: flex; height: 100%; background: var(--color-background); border-radius: var(--border-radius-lg); overflow: hidden; }
.plot-area { flex: 2; position: relative; }
.controls-area { flex: 1; padding: 1rem; border-left: 1px solid var(--color-border); background: var(--color-surface-1); display: flex; flex-direction: column; }
.controls-area h4 { margin-top: 0; }
#constraints-list { flex-grow: 1; overflow-y: auto; }
.constraint-item { display: flex; justify-content: space-between; align-items: center; padding: 0.5rem; border-radius: 4px; transition: background-color 0.2s; }
.constraint-item:hover { background-color: var(--color-surface-2); }
.delete-btn { background: none; border: none; color: var(--color-error); cursor: pointer; font-size: 1.2rem; }
.add-constraint-form { display: grid; grid-template-columns: 1fr 1fr auto 1fr auto; gap: 0.5rem; align-items: center; margin-top: 1rem; }
.add-constraint-form input { width: 100%; }
.feasible-region { fill: var(--color-primary); fill-opacity: 0.5; stroke: var(--color-primary); stroke-width: 2; }
.half-space-highlight { fill: var(--color-accent); fill-opacity: 0.2; }
`;
document.head.appendChild(style);
