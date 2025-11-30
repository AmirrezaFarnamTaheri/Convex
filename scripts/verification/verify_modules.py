from playwright.sync_api import sync_playwright
import time

def verify_modules():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Modules to verify
        modules = [
            ("00-linear-algebra-primer", "topics/00-linear-algebra-primer/index.html"),
            ("01-introduction", "topics/01-introduction/index.html"),
            ("02-convex-sets", "topics/02-convex-sets/index.html"),
            ("03-convex-functions", "topics/03-convex-functions/index.html"),
            ("04-convex-opt-problems", "topics/04-convex-opt-problems/index.html"),
            ("05-duality", "topics/05-duality/index.html")
        ]

        for name, path in modules:
            print(f"Verifying {name}...")
            url = f"http://localhost:8000/{path}"
            page.goto(url)

            # Wait for content to load
            page.wait_for_load_state("networkidle")

            # Scroll to the bottom to see exercises
            page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
            time.sleep(1) # wait for smooth scroll if any

            # Take screenshot of the bottom part of the page
            # We can't take full page screenshots easily if they are too big, but we want to see the exercises.
            # Let's take a screenshot of the viewport at the bottom.
            screenshot_path = f"scripts/verification/verify_{name}.png"
            page.screenshot(path=screenshot_path)
            print(f"Screenshot saved to {screenshot_path}")

        browser.close()

if __name__ == "__main__":
    verify_modules()
