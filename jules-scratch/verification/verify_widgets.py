from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()

    base_url = "http://localhost:8010/topics"
    lectures = [
        "00-linear-algebra-primer",
        "01-introduction",
        "02-convex-sets",
        "03-convex-functions",
        "04-convex-opt-problems",
        "05-duality",
        "07-statistical-estimation",
        "08-geometric-problems",
        "09-unconstrained-minimization",
        "10-equality-constrained-minimization",
        "11-interior-point-methods",
    ]

    for i, lecture in enumerate(lectures):
        page.goto(f"{base_url}/{lecture}/index.html")
        page.screenshot(path=f"jules-scratch/verification/screenshot-{i}.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
