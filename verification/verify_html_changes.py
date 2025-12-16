from playwright.sync_api import sync_playwright
import os

def capture_screenshots():
    base_dir = os.getcwd()
    file_path_00 = f"file://{base_dir}/topics/00-linear-algebra-basics/index.html"
    file_path_09 = f"file://{base_dir}/topics/09-duality/index.html"

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Screenshot 00-linear-algebra-basics
        print(f"Navigating to {file_path_00}")
        page.goto(file_path_00)

        # Section 1: Notation
        page.locator("#section-notation").scroll_into_view_if_needed()
        page.screenshot(path="verification/00_section_notation.png")

        # Section 2: Subspaces
        page.locator("#section-subspaces").scroll_into_view_if_needed()
        page.screenshot(path="verification/00_section_subspaces.png")

        # Section 4: Norms (This is section-norms in ID, but let's check if ID matches)
        # Checking source of 00 showed ID "section-norms"
        page.locator("#section-norms").scroll_into_view_if_needed()
        page.screenshot(path="verification/00_section_norms.png")


        # Screenshot 09-duality
        print(f"Navigating to {file_path_09}")
        page.goto(file_path_09)

        # Section 1: Conjugates
        page.locator("#section-1").scroll_into_view_if_needed()
        page.screenshot(path="verification/09_section_1.png")

        # Section 3: Strong Duality
        page.locator("#section-3").scroll_into_view_if_needed()
        page.screenshot(path="verification/09_section_3.png")

        # Section 5: Sensitivity
        page.locator("#section-5").scroll_into_view_if_needed()
        page.screenshot(path="verification/09_section_5.png")

        # Section 6: Conic
        page.locator("#section-6").scroll_into_view_if_needed()
        page.screenshot(path="verification/09_section_6.png")

        # Section 9: Exercises
        page.locator("#section-9").scroll_into_view_if_needed()
        page.screenshot(path="verification/09_section_9.png")

        browser.close()

if __name__ == "__main__":
    capture_screenshots()
