from playwright.sync_api import sync_playwright

def verify_lectures():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Verify L00
        page.goto("http://localhost:8000/topics/00-linear-algebra-primer/index.html")
        page.wait_for_selector("h1:has-text('00. A Primer on Linear Algebra')")
        page.screenshot(path="/home/jules/verification/L00.png")

        # Verify L01
        page.goto("http://localhost:8000/topics/01-introduction/index.html")
        page.wait_for_selector("h1:has-text('01. Introduction: What Makes a Problem Convex?')")
        page.screenshot(path="/home/jules/verification/L01.png")

        # Verify L02
        page.goto("http://localhost:8000/topics/02-convex-sets/index.html")
        page.wait_for_selector("h1:has-text('02. The Geometry of Feasibility: Convex Sets')")
        page.screenshot(path="/home/jules/verification/L02.png")

        # Verify L03
        page.goto("http://localhost:8000/topics/03-convex-functions/index.html")
        page.wait_for_selector("h1:has-text('03. Convex Functions: Definitions, Characterizations, and Operations')")
        page.screenshot(path="/home/jules/verification/L03.png")

        # Verify L04
        page.goto("http://localhost:8000/topics/04-convex-opt-problems/index.html")
        page.wait_for_selector("h1:has-text('04. Convex Optimization Problems: Standard Forms')")
        page.screenshot(path="/home/jules/verification/L04.png")

        # Verify L05
        page.goto("http://localhost:8000/topics/05-duality/index.html")
        page.wait_for_selector("h1:has-text('05. Duality: Lagrangian, KKT, Strong Duality')")
        page.screenshot(path="/home/jules/verification/L05.png")

        browser.close()

if __name__ == "__main__":
    verify_lectures()
