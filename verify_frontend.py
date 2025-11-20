from playwright.sync_api import sync_playwright
import time
import os

def verify_lecture_pages():
    # Ensure directory exists
    if not os.path.exists("jules-scratch"):
        os.makedirs("jules-scratch")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Allow time for server to be ready
        try:
            # Lecture 00
            print("Navigating to Lecture 00...")
            page.goto("http://localhost:8000/topics/00-linear-algebra-primer/", timeout=10000)
            page.wait_for_load_state("networkidle")
            # Wait for a widget to load (e.g., rank nullspace)
            page.wait_for_selector("#widget-rank-nullspace canvas, #widget-rank-nullspace .widget-loading-spinner", timeout=10000)
            # Take screenshot
            page.screenshot(path="jules-scratch/lecture_00_screenshot.png", full_page=True)
            print("Captured Lecture 00.")

            # Lecture 01
            print("Navigating to Lecture 01...")
            page.goto("http://localhost:8000/topics/01-introduction/", timeout=10000)
            page.wait_for_load_state("networkidle")
            # Wait for problem gallery (now static HTML)
            page.wait_for_selector(".gallery-grid", timeout=5000)
            page.screenshot(path="jules-scratch/lecture_01_screenshot.png", full_page=True)
            print("Captured Lecture 01.")

            # Lecture 02
            print("Navigating to Lecture 02...")
            page.goto("http://localhost:8000/topics/02-convex-sets/", timeout=10000)
            page.wait_for_load_state("networkidle")
            page.screenshot(path="jules-scratch/lecture_02_screenshot.png", full_page=True)
            print("Captured Lecture 02.")

            # Lecture 03
            print("Navigating to Lecture 03...")
            page.goto("http://localhost:8000/topics/03-convex-functions/", timeout=10000)
            page.wait_for_load_state("networkidle")
            page.screenshot(path="jules-scratch/lecture_03_screenshot.png", full_page=True)
            print("Captured Lecture 03.")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_lecture_pages()
