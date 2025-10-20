# Setup

## Quick-Start Commands

Copy-paste these commands to get started:

```bash
# Create project directory
mkdir convex-optimization-course
cd convex-optimization-course

# Initialize Git
git init
git remote add origin https://github.com/[YOUR-GITHUB]/convex-optimization-course.git

# Create directory structure
mkdir -p {content,topics,static/{css,js,img},lib,data,docs,widgets/{js,py}}

# Topics: Create skeleton for all 11 lectures
for i in {00..11}; do
  mkdir -p "topics/$i-slug/images/{diagrams,examples}"
  mkdir -p "topics/$i-slug/widgets/{js,py}"
done

# Start local server
python -m http.server 8010
# Open http://localhost:8010 in browser

# Create initial content files (copy templates above)
# Copy lecture template to each topics/NN-slug/index.html
# Create content/lectures.json from template
# Create static/css/styles.css and static/js/app.js

# Test setup
# Open localhost:8010 in browser
# Check console for errors

# Commit initial structure
git add .
git commit -m "Initial project structure: 11 lectures, templates, styling"
git push -u origin main

# Deploy to GitHub Pages (if using)
# Push to gh-pages branch or configure Pages in repo settings
```

## Technical Setup

Before publishing the first lecture, ensure you have:

- [ ] Git repository initialized, pushed to GitHub
- [ ] GitHub Pages / Netlify configured and working
- [ ] Local server running (`python -m http.server 8010`) for testing
- [ ] Pyodide loading correctly; test with simple Python widget
- [ ] KaTeX rendering LaTeX equations in lectures
- [ ] All relative paths working (no hardcoded URLs)
