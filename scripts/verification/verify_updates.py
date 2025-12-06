from playwright.sync_api import sync_playwright, expect

def verify_changes():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Verify L00 P0.13
        page.goto("http://localhost:8000/topics/00-linear-algebra-primer/index.html")
        page.wait_for_selector(".problem:has-text('P0.13')")
        # Scroll to P0.13 and take screenshot
        element = page.locator(".problem:has-text('P0.13')")
        element.scroll_into_view_if_needed()
        page.screenshot(path="/home/jules/verification/l00_p0_13.png", clip=element.bounding_box())

        # Verify L03 Section 5.4 Matrix Fractional (Deep Dive)
        page.goto("http://localhost:8000/topics/03-convex-functions/index.html")
        page.wait_for_selector("text=Determinant Identity")
        element = page.locator("text=Determinant Identity").locator("xpath=..")
        element.scroll_into_view_if_needed()
        page.screenshot(path="/home/jules/verification/l03_sec5_4.png", clip=element.bounding_box())

        # Verify L03 Section 8.6 Simple 1D Examples
        page.wait_for_selector("h4:has-text('Simple 1D Examples')")
        element = page.locator("h4:has-text('Simple 1D Examples')").locator("xpath=..")
        element.scroll_into_view_if_needed()
        page.screenshot(path="/home/jules/verification/l03_sec8_6.png", clip=element.bounding_box())

        browser.close()

if __name__ == "__main__":
    verify_changes()
