from playwright.sync_api import sync_playwright, Page, expect
import time

def verify_lectures():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        # --- LECTURE 00 VERIFICATION ---
        page0 = browser.new_page()
        page0.goto("http://localhost:8000/topics/00-linear-algebra-primer/")

        # Screenshot Trace Linearity Section (Section 2.3)
        # We scroll to "Linearity of Trace"
        trace_element = page0.get_by_text("Linearity of Trace").first
        trace_element.scroll_into_view_if_needed()
        # Wait a bit for layout
        time.sleep(1)
        page0.screenshot(path="verification_lecture00_trace.png")
        print("Captured Lecture 00 Trace Linearity")

        # --- LECTURE 03 VERIFICATION ---
        page3 = browser.new_page()
        page3.goto("http://localhost:8000/topics/03-convex-functions/")

        # Screenshot Restriction to Line (Section 1.5)
        restriction_element = page3.get_by_text("1.5 Restriction to a Line").first
        restriction_element.scroll_into_view_if_needed()
        time.sleep(1)
        page3.screenshot(path="verification_lecture03_restriction.png")
        print("Captured Lecture 03 Restriction to Line")

        # Screenshot Log-Det Proof (Section 4)
        # Search for "Detailed Proof: Concavity of Log-Determinant"
        logdet_element = page3.get_by_text("Detailed Proof: Concavity of Log-Determinant").first
        logdet_element.scroll_into_view_if_needed()
        time.sleep(1)
        page3.screenshot(path="verification_lecture03_logdet.png")
        print("Captured Lecture 03 Log-Det Proof")

        browser.close()

if __name__ == "__main__":
    verify_lectures()
