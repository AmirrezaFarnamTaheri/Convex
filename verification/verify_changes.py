from playwright.sync_api import sync_playwright

def verify_changes():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        # 1. Verify Index Page (Duplication Fix)
        page = browser.new_page()
        page.goto("http://localhost:8000/index.html")
        page.set_viewport_size({"width": 1280, "height": 2000}) # Tall enough to see bottom

        # Scroll to bottom to check for duplication
        page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        page.screenshot(path="verification/index_bottom.png")
        print("Screenshot of index.html bottom saved to verification/index_bottom.png")

        # 2. Verify Syllabus Page (Class update)
        page = browser.new_page()
        page.goto("http://localhost:8000/syllabus.html")
        page.set_viewport_size({"width": 1280, "height": 1000})
        page.screenshot(path="verification/syllabus.png")
        print("Screenshot of syllabus.html saved to verification/syllabus.png")

        # 3. Verify Widget (Convex Combination)
        page = browser.new_page()
        page.goto("http://localhost:8000/topics/02-introduction/index.html")
        page.set_viewport_size({"width": 1280, "height": 1500})

        # Scroll to widget (approximate location)
        # It's usually in section 1.6
        widget_loc = page.locator("#widget-convex-combination")
        widget_loc.scroll_into_view_if_needed()
        page.wait_for_timeout(1000) # Wait for D3 to render

        page.screenshot(path="verification/widget.png")
        print("Screenshot of widget saved to verification/widget.png")

        # 4. Verify Back to Top
        # Scroll down and check if button appears
        page.evaluate("window.scrollTo(0, 500)")
        page.wait_for_timeout(500)
        page.screenshot(path="verification/back_to_top.png")
        print("Screenshot of back-to-top button saved to verification/back_to_top.png")

        browser.close()

if __name__ == "__main__":
    verify_changes()
