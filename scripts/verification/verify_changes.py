from playwright.sync_api import sync_playwright
import time

def verify_changes():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1280, 'height': 800})
        page = context.new_page()

        # Lecture 00 Verification
        print("Navigating to Lecture 00...")
        page.goto("http://localhost:8000/topics/00-linear-algebra-primer/index.html")
        page.wait_for_selector("h3:has-text('P0.9')")

        # Screenshot P0.9 (Trace)
        print("Screenshotting P0.9...")
        element = page.locator("h3:has-text('P0.9')").locator("..")
        element.screenshot(path="scripts/verification/p0_9_trace.png")

        # Screenshot P0.11 (Operator Norm)
        print("Screenshotting P0.11...")
        element = page.locator("h3:has-text('P0.11')").locator("..")
        element.screenshot(path="scripts/verification/p0_11_opnorm.png")

        # Screenshot P0.14 (Generalized IP)
        print("Screenshotting P0.14...")
        element = page.locator("h3:has-text('P0.14')").locator("..")
        element.screenshot(path="scripts/verification/p0_14_genip.png")

        # Lecture 02 Verification
        print("Navigating to Lecture 02...")
        page.goto("http://localhost:8000/topics/02-convex-sets/index.html")
        page.wait_for_selector("h3:has-text('P2.10')")

        # Screenshot P2.10 (Norm Cone)
        print("Screenshotting P2.10...")
        element = page.locator("h3:has-text('P2.10')").locator("..")
        element.screenshot(path="scripts/verification/p2_10_normcone.png")

        browser.close()

if __name__ == "__main__":
    verify_changes()
