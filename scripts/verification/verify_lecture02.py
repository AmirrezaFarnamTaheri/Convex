from playwright.sync_api import sync_playwright

def verify_convex_sets_page():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the Lecture 02 page
        page.goto("http://localhost:8000/topics/02-convex-sets/index.html")

        # Wait for content to load
        page.wait_for_selector("header.lecture-header")

        # 1. Capture Section 1.3 (Carathéodory, Convex Hull of Non-Convex)
        # Scroll to section 1.3 or specific elements
        element_hull = page.locator("img[alt='Convex hull of a crescent shape']")
        if element_hull.count() > 0:
            element_hull.scroll_into_view_if_needed()
            page.screenshot(path="scripts/verification/01_convex_hull.png")
            print("Captured 01_convex_hull.png")
        else:
            print("Element 'Convex hull of a crescent shape' not found")

        # 2. Capture Section 3.2 (Affine Images)
        element_affine = page.locator("img[alt='Projection of a polyhedron onto 2D space']")
        if element_affine.count() > 0:
            element_affine.scroll_into_view_if_needed()
            page.screenshot(path="scripts/verification/02_affine_image.png")
            print("Captured 02_affine_image.png")
        else:
            print("Element 'Projection of a polyhedron' not found")

        # 3. Capture Section 3.3 (Perspective)
        element_perspective = page.locator("img[alt='Geometric intuition of perspective projection']")
        if element_perspective.count() > 0:
            element_perspective.scroll_into_view_if_needed()
            page.screenshot(path="scripts/verification/03_perspective.png")
            print("Captured 03_perspective.png")
        else:
             print("Element 'Perspective' not found")

        # 4. Capture Section 4 (Hyperplanes)
        element_hyperplane = page.locator("img[alt='Illustration of the Separating Hyperplane Theorem']")
        if element_hyperplane.count() > 0:
            element_hyperplane.scroll_into_view_if_needed()
            page.screenshot(path="scripts/verification/04_hyperplane.png")
            print("Captured 04_hyperplane.png")
        else:
            print("Element 'Separating Hyperplane' not found")

        # 5. Capture Section 5 (Cones - Cone Zoo)
        element_cone_zoo = page.locator("img[alt='Examples of proper and improper cones']")
        if element_cone_zoo.count() > 0:
            element_cone_zoo.scroll_into_view_if_needed()
            page.screenshot(path="scripts/verification/05_cone_zoo.png")
            print("Captured 05_cone_zoo.png")
        else:
             print("Element 'Cone Zoo' not found")

        # 6. Capture Section 5 (Cones - Generalized Inequality)
        element_gen_ineq = page.locator("img[alt='Visualizing generalized inequality']")
        if element_gen_ineq.count() > 0:
            element_gen_ineq.scroll_into_view_if_needed()
            page.screenshot(path="scripts/verification/06_generalized_inequality.png")
            print("Captured 06_generalized_inequality.png")
        else:
            print("Element 'Generalized Inequality' not found")

        browser.close()

if __name__ == "__main__":
    verify_convex_sets_page()
