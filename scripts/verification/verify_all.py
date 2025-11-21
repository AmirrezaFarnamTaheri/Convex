
from playwright.sync_api import sync_playwright
import time
import os

def verify_lectures():
    with sync_playwright() as p:
        # Launch browser
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1280, "height": 1000})
        page = context.new_page()

        lectures = [
            "00-linear-algebra-primer",
            "01-introduction",
            "02-convex-sets",
            "03-convex-functions"
        ]

        for lecture in lectures:
            url = f"http://localhost:8000/topics/{lecture}/index.html"
            print(f"Verifying {lecture} at {url}...")

            try:
                page.goto(url)
                # Wait for MathJax/Katex or widgets
                time.sleep(2)

                # Screenshot full page top
                page.screenshot(path=f"scripts/verification/verify_{lecture}_top.png")

                # Look for a widget and screenshot it
                widget = page.locator(".widget-container").first
                if widget.count() > 0:
                    widget.scroll_into_view_if_needed()
                    time.sleep(1)
                    page.screenshot(path=f"scripts/verification/verify_{lecture}_widget.png", clip=widget.bounding_box())
                    print(f"  - Widget screenshot taken for {lecture}")
                else:
                    print(f"  - No widget found for {lecture}")

            except Exception as e:
                print(f"  - Error verifying {lecture}: {e}")

        browser.close()

if __name__ == "__main__":
    verify_lectures()
