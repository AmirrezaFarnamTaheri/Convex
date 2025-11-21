
from playwright.sync_api import sync_playwright
import time

def verify_lecture_00():
    with sync_playwright() as p:
        # Launch browser
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1280, "height": 800})
        page = context.new_page()

        # Use local server
        url = "http://localhost:8000/topics/00-linear-algebra-primer/index.html"

        print(f"Navigating to {url}")
        page.goto(url)

        # Wait for content to load (widgets load dynamically)
        # Wait specifically for the widget to have some content
        try:
            page.wait_for_selector("#widget-orthogonality svg", timeout=10000)
            print("Widget SVG found.")
        except:
            print("Widget SVG not found immediately, waiting a bit more...")
            time.sleep(3)

        time.sleep(2) # Extra buffer

        # Verify Orthogonality Widget specifically
        widget = page.locator("#widget-orthogonality")
        if widget.count() > 0:
            widget.scroll_into_view_if_needed()
            time.sleep(1)
            page.screenshot(path="scripts/verification/widget_orthogonality.png", clip=widget.bounding_box())
            print("Orthogonality widget screenshot taken.")
        else:
            print("Orthogonality widget not found.")

        browser.close()

if __name__ == "__main__":
    verify_lecture_00()
