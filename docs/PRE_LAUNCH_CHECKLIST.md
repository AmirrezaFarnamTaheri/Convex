# Pre-Launch Checklist

Before publishing the first lecture, ensure you have:

## Technical Setup
- [ ] Git repository initialized, pushed to GitHub
- [ ] GitHub Pages / Netlify configured and working
- [ ] Local server running (`python -m http.server 8010`) for testing
- [ ] Pyodide loading correctly; test with simple Python widget
- [ ] KaTeX rendering LaTeX equations in lectures
- [ ] All relative paths working (no hardcoded URLs)

## Content Structure
- [ ] All 11 lectures.json entries complete (title, date, slug, tags, prerequisites)
- [ ] Lecture 0 (LA Primer) outline drafted
- [ ] All 11 topic folders created with skeleton `index.html`
- [ ] Placeholder images/ and widgets/ directories in place
- [ ] Shared `/widgets/` folder structure set up

## Design & Branding
- [ ] Dark theme CSS applied consistently (colors, fonts, spacing)
- [ ] Logo SVG in place and sized correctly
- [ ] Responsive design tested on mobile, tablet, desktop
- [ ] Accessibility: color contrast ratios > 4.5:1, proper semantic HTML

## Documentation
- [ ] README.md updated with setup instructions
- [ ] WIDGET-GUIDE.md written (template for new widgets)
- [ ] CONTRIBUTING.md drafted (code style, PR process)
- [ ] SETUP.md with local dev instructions

## Initial Diagrams (at minimum)
- [ ] Optimization problem schematic (Lecture 01)
- [ ] Convex vs nonconvex visualization (Lecture 01)
- [ ] Affine vs convex sets (Lecture 02)
- [ ] Jensen's inequality (Lecture 03)
- [ ] Standard form summary (Lecture 04)
- [ ] Gradient descent trajectory (Lecture 09)
- [ ] Interior-point trajectory (Lecture 11)

## First 2–3 Widgets
- [ ] Convex vs nonconvex explorer fully functional
- [ ] Gradient descent visualizer working (2D, animating)
- [ ] Jensen inequality visualizer interactive
- [ ] All tested on Chrome, Firefox, Safari
- [ ] Mobile-responsive; touch-friendly controls

## Readings & Resources
- [ ] Link to Boyd & Vandenberghe book working
- [ ] CVXPY documentation link live
- [ ] Solver links (SCS, Mosek, etc.) curated
- [ ] Optional: embed or link video lectures (if you have them)

## Analytics & Tracking (Optional)
- [ ] Plausible or Fathom analytics set up (or skip initially)
- [ ] Google Search Console verified
- [ ] Sitemap.xml generated
