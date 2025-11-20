from playwright.sync_api import sync_playwright
import os

def verify_lecture_pages():
    if not os.path.exists("jules-scratch"):
        os.makedirs("jules-scratch")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            print("Navigating to Lecture 01...")
            # Go to the page
            page.goto("http://localhost:8000/topics/01-introduction/", timeout=60000, wait_until="domcontentloaded")

            # Just wait a fixed short time for things to settle, since networkidle is flaky with Pyodide
            page.wait_for_timeout(2000)

            # Take a viewport screenshot
            page.screenshot(path="jules-scratch/verification_01.png")
            print("Captured Lecture 01 viewport.")
        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_lecture_pages()
