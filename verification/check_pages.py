
from playwright.sync_api import sync_playwright
import os

def check_html_files():
    files = ["topics/05-convex-functions-basics/index.html", "topics/06-convex-functions-advanced/index.html"]

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        for file_path in files:
            abs_path = os.path.abspath(file_path)
            print(f"Checking {abs_path}...")
            page.goto(f"file://{abs_path}")

            # Basic sanity check - look for the main title
            try:
                title = page.title()
                print(f"  Title: {title}")
                # Screenshot just to be safe and have an artifact if needed
                screenshot_path = f"verification/{os.path.basename(file_path)}.png"
                page.screenshot(path=screenshot_path)
                print(f"  Screenshot saved to {screenshot_path}")

            except Exception as e:
                print(f"  Error checking {file_path}: {e}")

        browser.close()

if __name__ == "__main__":
    check_html_files()
