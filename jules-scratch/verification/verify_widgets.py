from playwright.sync_api import sync_playwright

def run_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        widget_paths = [
            '00-linear-algebra-primer/widgets/orthogonality',
            '00-linear-algebra-primer/widgets/hessian-landscape-visualizer',
            '00-linear-algebra-primer/widgets/norm-geometry-visualizer',
            '00-linear-algebra-primer/widgets/svd-approximator',
            '00-linear-algebra-primer/widgets/rank-nullspace',
            '00-linear-algebra-primer/widgets/eigen-psd',
            '00-linear-algebra-primer/widgets/condition-number',
            '00-linear-algebra-primer/widgets/matrix-explorer',
            '01-introduction/widgets/convex-combination',
            '01-introduction/widgets/problem-flowchart',
            '01-introduction/widgets/convex-vs-nonconvex',
            '01-introduction/widgets/convergence-comparison',
            '01-introduction/widgets/landscape-viewer',
            '02-convex-sets/widgets/convex-set-checker',
            '02-convex-sets/widgets/polyhedron-visualizer',
            '02-convex-sets/widgets/ellipsoid-explorer',
            '02-convex-sets/widgets/operations-builder',
            '02-convex-sets/widgets/separating-hyperplane',
            '03-convex-functions/widgets/tangent-line-explorer',
            '03-convex-functions/widgets/jensen-visualizer',
            '03-convex-functions/widgets/operations-preserving',
            '03-convex-functions/widgets/epigraph-visualizer',
            '03-convex-functions/widgets/hessian-heatmap',
            '04-convex-opt-problems/widgets/lp-visualizer',
            '04-convex-opt-problems/widgets/reformulation-tool',
            '04-convex-opt-problems/widgets/problem-form-recognizer',
            '04-convex-opt-problems/widgets/qp-sandbox',
            '04-convex-opt-problems/widgets/sdp-visualizer',
            '05-duality/widgets/kkt-checker',
            '05-duality/widgets/complementary-slackness',
            '05-duality/widgets/duality-visualizer',
            '05-duality/widgets/shadow-prices',
            '05-duality/widgets/duality-race',
            '05-duality/widgets/lagrangian-explainer',
            '06-approximation-fitting/widgets/matrix-completion',
            '06-approximation-fitting/widgets/sparse-recovery',
            '06-approximation-fitting/widgets/least-squares-regularization',
            '06-approximation-fitting/widgets/robust-regression',
        ]

        for path in widget_paths:
            widget_name = path.split('/')[-1]
            url = f'http://localhost:8010/topics/{path}.html'
            page.goto(url, wait_until='networkidle')
            page.screenshot(path=f'jules-scratch/verification/{widget_name}.png')
            print(f'Captured screenshot for {widget_name}')

        browser.close()

if __name__ == '__main__':
    run_verification()
