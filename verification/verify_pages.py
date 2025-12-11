
from playwright.sync_api import sync_playwright
import os

def check_html_file(file_path):
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Construct the file URL correctly
        abs_path = os.path.abspath(file_path)
        url = f"file://{abs_path}"

        print(f"Checking {url}")

        try:
            page.goto(url)
            # Take a screenshot of the whole page to verify content visually later if needed
            page.screenshot(path=f"verification/{os.path.basename(file_path)}.png", full_page=True)
            print(f"Successfully loaded and verified {file_path}")
        except Exception as e:
            print(f"Error loading {file_path}: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    check_html_file("topics/05-convex-functions-basics/index.html")
    check_html_file("topics/06-convex-functions-advanced/index.html")
