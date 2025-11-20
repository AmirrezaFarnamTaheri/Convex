
from playwright.sync_api import Page, expect, sync_playwright
import os
import time

def verify_widgets(page: Page):
    # Increase default timeout
    page.set_default_timeout(60000)

    # Verify Mod 00 - Matrix Geometry
    print("Verifying Matrix Geometry...")
    page.goto("http://localhost:8000/topics/00-linear-algebra-primer/index.html")
    # Wait for loading to finish if present
    try:
        page.wait_for_selector(".widget-loading", state="detached", timeout=60000)
    except:
        print("Loading indicator did not disappear or wasn't found")

    page.wait_for_selector("#widget-matrix-geometry svg", timeout=60000)
    time.sleep(2)
    page.screenshot(path="scripts/verification/mod00_matrix.png")

    # Verify Mod 01 - Convex Combination
    print("Verifying Convex Combination...")
    page.goto("http://localhost:8000/topics/01-introduction/index.html")
    page.wait_for_selector("#widget-convex-combination svg", timeout=30000)
    time.sleep(1)
    page.screenshot(path="scripts/verification/mod01_convex_combo.png")

    # Verify Mod 02 - Operations Builder
    print("Verifying Operations Builder...")
    page.goto("http://localhost:8000/topics/02-convex-sets/index.html")
    page.wait_for_selector("#widget-operations-builder svg", timeout=30000)
    time.sleep(1)
    page.screenshot(path="scripts/verification/mod02_operations.png")

    # Verify Mod 03 - Jensen
    print("Verifying Jensen...")
    page.goto("http://localhost:8000/topics/03-convex-functions/index.html")
    page.wait_for_selector("#widget-jensen-visualizer svg", timeout=30000)
    time.sleep(1)
    page.screenshot(path="scripts/verification/mod03_jensen.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        print("Launching browser...")
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_widgets(page)
            print("Verification complete!")
        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()
