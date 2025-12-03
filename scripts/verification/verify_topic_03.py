from playwright.sync_api import sync_playwright

def verify_convex_functions(page):
    # Navigate to the lecture page
    page.goto("http://localhost:8000/topics/03-convex-functions/index.html")

    # Wait for the main content to load
    page.wait_for_selector("h1")

    # Scroll to Section 7 (The Convex Conjugate)
    section7 = page.locator("#section-7")
    section7.scroll_into_view_if_needed()

    # Wait for images to load
    page.wait_for_selector("#section-7 img")

    # Take a screenshot of the entire section 7
    # Since the section might be tall, we might need multiple screenshots or a full page one cropped.
    # Let's take a screenshot of the viewport focused on Section 7
    page.screenshot(path="scripts/verification/section7_view.png")

    # Take screenshots of specific images to verify they loaded
    images = [
        "conjugate_definition_gap.png",
        "conjugate_supporting_line.png",
        "conjugate_convexity_affine.png",
        "conjugate_epigraph_intersection.png",
        "conjugate_fenchel_young.png",
        "conjugate_indicator_support.png",
        "conjugate_dual_norm_ball.png",
        "conjugate_biconjugate.png"
    ]

    # Just check if images are visible
    for img_name in images:
        img_locator = page.locator(f"img[src='assets/{img_name}']")
        if img_locator.count() > 0:
            img_locator.scroll_into_view_if_needed()
            print(f"Found image: {img_name}")
        else:
            print(f"MISSING image: {img_name}")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_convex_functions(page)
        finally:
            browser.close()
