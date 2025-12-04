from playwright.sync_api import sync_playwright
import time

def verify_changes():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Verify Lecture 00 - Schur Complement
        print("Verifying Lecture 00...")
        page.goto("http://localhost:8000/topics/00-linear-algebra-primer/index.html")
        page.wait_for_load_state("networkidle")

        # Scroll to the Schur Complement section using h3 tag to avoid ambiguity
        schur_section = page.locator("h3:has-text('5.4 The Schur Complement Lemma')").first
        if schur_section.count() > 0:
            schur_section.scroll_into_view_if_needed()
            # Wait a bit for any lazy loading
            time.sleep(1)
            # Take screenshot of the section
            page.screenshot(path="scripts/verification/lecture_00_schur.png", clip={
                "x": 0,
                "y": 0,
                "width": 1000,
                "height": 3000
            })

            # Locate the Numerical Example
            example_div = page.locator("div.example:has-text('Numerical Example')").first
            if example_div.count() > 0:
                example_div.scroll_into_view_if_needed()
                example_div.screenshot(path="scripts/verification/lecture_00_example.png")
                print("Captured Lecture 00 example.")
            else:
                print("Could not find Numerical Example div in Lecture 00")
        else:
            print("Could not find Schur Complement section in Lecture 00")

        # Verify Lecture 03 - Log Concavity & Quasiconvexity
        print("Verifying Lecture 03...")
        page.goto("http://localhost:8000/topics/03-convex-functions/index.html")
        page.wait_for_load_state("networkidle")

        # Log Concavity - Hessian Condition
        log_section = page.locator("h4:has-text('4.4.2 Hessian Condition')").first
        if log_section.count() > 0:
            log_section.scroll_into_view_if_needed()
            page.screenshot(path="scripts/verification/lecture_03_log_concavity.png")
            print("Captured Lecture 03 Log Concavity.")
        else:
            print("Could not find Hessian Condition section in Lecture 03")

        # Quasiconvexity - Examples
        quasi_section = page.locator("h3:has-text('8.4 Examples in Detail')").first
        if quasi_section.count() > 0:
            quasi_section.scroll_into_view_if_needed()
            # Capture the examples section. Use a clip instead of full_page to avoid timeout.
            # Assuming standard width, and a reasonable height for the examples.
            page.screenshot(path="scripts/verification/lecture_03_quasiconvex_examples.png", clip={
                "x": 0,
                "y": 0, # Relative to viewport, but scroll_into_view handles position
                "width": 1000,
                "height": 4000 # Enough to capture examples
            }, full_page=False)
            print("Captured Lecture 03 Quasiconvex examples.")
        else:
            print("Could not find Examples in Detail section in Lecture 03")

        browser.close()

if __name__ == "__main__":
    verify_changes()
