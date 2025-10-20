# Pre-Launch Checklist

Before publishing the first lecture, ensure you have:

## Technical Setup
- [ ] **Git repository initialized, pushed to GitHub**
  - *Verification:* The remote URL is set (`git remote -v`) and the main branch is pushed.
- [ ] **GitHub Pages / Netlify configured and working**
  - *Verification:* The site is live at the expected URL and updates when you push to the `main` branch.
- [ ] **Local server running (`python -m http.server 8010`) for testing**
  - *Verification:* You can access `http://localhost:8010` in your browser and see the `index.html` page without errors.
- [ ] **Pyodide loading correctly**
  - *Verification:* Go to a lecture with a Python widget, open the browser console (F12), verify there are no JavaScript errors related to Pyodide, and confirm the widget's Python-powered output appears correctly.
- [ ] **KaTeX rendering LaTeX equations in lectures**
  - *Verification:* Visit a page with LaTeX (e.g., `$$x^2$$`) and confirm it renders as a formatted equation, not plain text.
- [ ] **All relative paths working (no hardcoded URLs)**
  - *Verification:* Click through the site navigation and check the browser console for 404 errors for images, CSS, or JS files.

## Content Structure
- [ ] **All 11 lectures.json entries complete**
  - *Verification:* `content/lectures.json` is valid JSON and contains entries for all 11 core lectures, each with a title, date, slug, tags, and prerequisites.
- [ ] **Lecture 0 (LA Primer) outline drafted**
  - *Verification:* `topics/00-linear-algebra-primer/index.html` contains at least section headers for the primer content.
- [ ] **All 11 topic folders created with skeleton `index.html`**
  - *Verification:* The `/topics` directory contains folders `01-introduction` through `11-interior-point-methods`, each with a non-empty `index.html`.
- [ ] **Placeholder images/ and widgets/ directories in place**
  - *Verification:* Each lecture folder inside `/topics` contains `images/diagrams/` and `widgets/js/` subdirectories.

## Design & Branding
- [ ] **Dark theme CSS applied consistently**
  - *Verification:* All pages share the same background, text, and link colors. Check that cards, headers, and footers are styled uniformly.
- [ ] **Logo SVG in place and sized correctly**
  - *Verification:* The site logo is visible in the header and does not appear distorted or pixelated.
- [ ] **Responsive design tested on mobile, tablet, desktop**
  - *Verification:* Use browser developer tools to check layouts on different screen sizes. Ensure text is readable and no elements overflow.
- [ ] **Accessibility checked**
  - *Verification:* Color contrast ratios are above 4.5:1 (use a browser extension to check). All images have `alt` tags. HTML is semantic (uses `<header>`, `<section>`, etc.).

## Documentation
- [ ] **README.md updated with setup instructions**
  - *Verification:* A new developer could clone the repo and get the site running locally by following only the `README.md`.
- [ ] **WIDGET-GUIDE.md written**
  - *Verification:* The guide contains a clear template and lifecycle explanation for creating a new widget.
- [ ] **CONTRIBUTING.md drafted**
  - *Verification:* The file explains the preferred code style and the process for submitting a pull request.

## Initial Diagrams (at minimum)
- [ ] **Core diagrams are created and linked**
  - *Verification:* Check that the following diagrams are present in their respective lecture folders and render correctly on the page: Optimization schematic (L01), Convex vs nonconvex (L01), Jensen's inequality (L03), Gradient descent trajectory (L09).

## First 2–3 Widgets
- [ ] **Core widgets are fully functional**
  - *Verification:* The "Convex vs Nonconvex Explorer," "Gradient Descent Visualizer," and "Jensen Inequality Visualizer" all load, are interactive, and produce correct output.
- [ ] **Widgets are cross-browser tested**
  - *Verification:* Test the core widgets on the latest versions of Chrome, Firefox, and Safari.
- [ ] **Widgets are mobile-responsive**
  - *Verification:* Interact with the widgets on a mobile device or emulator to ensure controls are usable and the layout is not broken.

## Readings & Resources
- [ ] **External links are validated**
  - *Verification:* Click on all major external links (Boyd & Vandenberghe book, CVXPY docs, solver sites) and confirm they are not broken.

## Analytics & Tracking (Optional)
- [ ] **Analytics are correctly configured**
  - *Verification:* If using analytics, check the service's dashboard to confirm that page views from your machine are being recorded.
