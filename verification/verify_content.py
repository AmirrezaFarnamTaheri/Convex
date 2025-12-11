from playwright.sync_api import sync_playwright
import os

def check_html_integrity():
    # Read the file
    filepath = 'topics/06-convex-functions-advanced/index.html'
    if not os.path.exists(filepath):
        print(f"Error: {filepath} not found.")
        return

    with open(filepath, 'r') as f:
        content = f.read()

    # Simple check for balanced tags (basic)
    tags = ['div', 'p', 'span', 'h1', 'h2', 'h3', 'h4', 'ul', 'li', 'section', 'article', 'main', 'header', 'footer']

    # Check MathJax delimiters
    dollars = content.count('$')
    if dollars % 2 != 0:
        print("Warning: Odd number of '$' characters. MathJax might be broken.")
    else:
        print("MathJax delimiter check passed (even number of '$').")

    # Check for specific new content
    new_content_snippets = [
        "c_{\min}(y) = \sup_x (y^\top x - f(x))",
        "Supporting Hyperplane Viewpoint",
        "Algebra Rules for Conjugates",
        "Affine Precomposition",
        "Legendre Transform: Smooth Case",
        "Linear-Fractional:",
        "Distance Ratio",
        "Internal Rate of Return (IRR)",
        "Sufficient Condition",
        "Integration Rules",
        "Hölder's Inequality",
        "Prékopa-Leindler",
        "Hitting a Convex Set with Log-Concave Noise",
        "Cumulative Distribution Function (CDF)"
    ]

    print("\nChecking for presence of new content:")
    for snippet in new_content_snippets:
        if snippet in content:
            print(f"  [OK] Found: {snippet[:30]}...")
        else:
            print(f"  [MISSING] Could not find: {snippet}")

def capture_screenshots():
    filepath = os.path.abspath('topics/06-convex-functions-advanced/index.html')
    url = f'file://{filepath}'

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        print(f"\nNavigating to {url}")
        page.goto(url)

        # Take screenshots of sections
        sections = ['section-1', 'section-2', 'section-3']
        for sec in sections:
            element = page.locator(f'#{sec}')
            if element.count() > 0:
                print(f"Taking screenshot of {sec}...")
                element.screenshot(path=f'verification/{sec}.png')
            else:
                print(f"Warning: Element #{sec} not found.")

        # Full page screenshot
        page.screenshot(path='verification/full_page.png', full_page=True)

        browser.close()

if __name__ == "__main__":
    check_html_integrity()
    capture_screenshots()
