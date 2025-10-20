## Deployment Options

### GitHub Pages (Recommended for course sites)

1. Create a GitHub repository: `convex-optimization-course`
2. Push to `main` branch
3. In repository settings → Pages, select "Deploy from a branch"
4. Choose branch: `main`, folder: `/ (root)`
5. Custom domain (optional): Add your domain in settings
6. SSL is automatic via GitHub

Site will be live at: `https://yourusername.github.io/convex-optimization-course`

### Netlify (Faster builds, better performance)

1. Connect your GitHub repo to Netlify
2. Build command: (none, it's static HTML)
3. Publish directory: `.` (root)
4. Site will be live at: `https://yoursite.netlify.app`

### Vercel (Similar to Netlify)

1. Import project from GitHub
2. Framework: None (static)
3. Root Directory: `.`
4. Deploy

## Version Control

Create a `.gitignore` file:

node_modules/
.DS_Store
*.log
dist/
build/
.vscode/local.settings
.env.local

Never commit:
- Generated files
- Local configuration
- Sensitive API keys (none needed for this project)

## CI/CD (Optional)

Consider adding GitHub Actions for:
- Link checking (broken links in documentation)
- HTML validation
- Performance budgets (lighthouse scores)
