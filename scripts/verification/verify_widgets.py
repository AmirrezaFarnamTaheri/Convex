
from playwright.sync_api import sync_playwright
import os
import time

def verify_changes():
    """
    Verifies the frontend widgets by taking screenshots.

    IMPORTANT: This script requires the local development server to be running
    at http://localhost:8000. Run `python3 -m http.server 8000 &` before
    executing this script.

    Output:
    - scripts/verification/l01_widget.png: Screenshot of Convex Combination widget
    - scripts/verification/l02_widget.png: Screenshot of Polyhedron widget
    """
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Verify Lecture 01 Widget
        try:
            page.goto("http://localhost:8000/topics/01-introduction/index.html")
            # Wait for widget to load
            page.wait_for_selector("#widget-convex-combination svg", timeout=5000)
            # Take screenshot of the widget
            page.screenshot(path="scripts/verification/l01_widget.png")
            print("Successfully captured L01 widget.")
        except Exception as e:
            print(f"Failed to capture L01 widget: {e}")

        # Verify Lecture 02 Widget
        try:
            page.goto("http://localhost:8000/topics/02-convex-sets/index.html")
            # Wait for widget
            page.wait_for_selector("#widget-polyhedron-visualizer svg", timeout=5000)
            # Take screenshot
            page.screenshot(path="scripts/verification/l02_widget.png")
            print("Successfully captured L02 widget.")
        except Exception as e:
             print(f"Failed to capture L02 widget: {e}")

        browser.close()

if __name__ == "__main__":
    verify_changes()
