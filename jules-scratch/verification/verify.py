from playwright.sync_api import sync_playwright

def verify_lecture_exercises():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to Lecture 02
        page.goto("http://localhost:8000/topics/02-convex-sets/index.html")

        # Helper to take screenshot of a section
        def snap(name, text):
            # Target the h3 heading specifically to avoid sidebar match
            locator = page.locator(f"h3:has-text('{text}')")
            locator.scroll_into_view_if_needed()
            # Screenshot the section (we can just screenshot the viewport)
            page.screenshot(path=f"jules-scratch/verification/{name}.png")

        snap("p2_11", "P2.11 — Convex Hull of Finite Points")
        snap("p2_12", "P2.12 — Minkowski Sum of Sets")
        snap("p2_14", "P2.14 — Closure of a Convex Set")
        snap("p2_15", "P2.15 — Product of Convex Sets")

        browser.close()

if __name__ == "__main__":
    verify_lecture_exercises()
