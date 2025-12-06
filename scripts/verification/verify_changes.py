from playwright.sync_api import sync_playwright, Page, expect
import os

def verify_changes():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Verify L00 - Frobenius Norm and Schur Complement
        print("Verifying L00...")
        page.goto("http://localhost:8000/topics/00-linear-algebra-primer/index.html")

        # Take screenshot of Frobenius Norm section
        try:
            # Locate the section. We'll search for the text "Hilbert-Schmidt inner product"
            norm_section = page.locator("text=Hilbert-Schmidt inner product").first
            norm_section.scroll_into_view_if_needed()
            page.screenshot(path="/home/jules/verification/L00_Frobenius.png")
            print("Captured L00_Frobenius.png")
        except Exception as e:
            print(f"Failed to capture L00 Frobenius: {e}")
            # Fallback
            page.screenshot(path="/home/jules/verification/L00_Full.png")

        # Take screenshot of Schur Complement Triangle
        try:
            schur_section = page.locator("text=The Triangle of Equivalence").first
            schur_section.scroll_into_view_if_needed()
            page.screenshot(path="/home/jules/verification/L00_Schur.png")
            print("Captured L00_Schur.png")
        except Exception as e:
            print(f"Failed to capture L00 Schur: {e}")

        # Verify L03 - Integral Characterization, Matrix Fractional, Conjugate
        print("Verifying L03...")
        page.goto("http://localhost:8000/topics/03-convex-functions/index.html")

        # Take screenshot of Integral Characterization
        try:
            integral_section = page.locator("text=Integral Characterization of Convexity").first
            integral_section.scroll_into_view_if_needed()
            page.screenshot(path="/home/jules/verification/L03_Integral.png")
            print("Captured L03_Integral.png")
        except Exception as e:
            print(f"Failed to capture L03 Integral: {e}")

        # Take screenshot of Matrix Fractional Function
        try:
            matrix_frac_section = page.locator("text=Matrix-Fractional Function").first
            matrix_frac_section.scroll_into_view_if_needed()
            page.screenshot(path="/home/jules/verification/L03_MatrixFrac.png")
            print("Captured L03_MatrixFrac.png")
        except Exception as e:
            print(f"Failed to capture L03 Matrix Frac: {e}")

        # Take screenshot of Indicator Conjugate
        try:
            indicator_section = page.locator("text=Indicator of a Set").first
            indicator_section.scroll_into_view_if_needed()
            page.screenshot(path="/home/jules/verification/L03_Indicator.png")
            print("Captured L03_Indicator.png")
        except Exception as e:
            print(f"Failed to capture L03 Indicator: {e}")

        browser.close()

if __name__ == "__main__":
    verify_changes()
