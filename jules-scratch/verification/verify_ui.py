import re
from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()

    # 1. Navigate to the lecture page
    page.goto("http://localhost:8000/topics/00-linear-algebra-primer/index.html")

    # 2. Wait for UI scripts to initialize (widgets, toggles)
    page.wait_for_load_state("networkidle")

    # 3. Verify Logo (should be the SVG we created)
    logo = page.locator(".brand img")
    expect(logo).to_be_visible()

    # 4. Verify Theme Switcher
    theme_btn = page.locator("#theme-dropdown-trigger")
    expect(theme_btn).to_be_visible()

    # 5. Verify Notes Widget
    notes_toggle = page.locator(".notes-toggle")
    expect(notes_toggle).to_be_visible()

    # 6. Verify Pomodoro Widget
    pomodoro = page.locator(".pomodoro-widget")
    expect(pomodoro).to_be_visible()

    # 7. Verify Collapsible Environment (Proof should be collapsed by default)
    proof_box = page.locator(".proof-enhanced").first
    # Check if it has the collapsed class
    expect(proof_box).to_have_class(re.compile(r"env-collapsed"))

    # 8. Verify Sidebar Toggle
    sidebar_toggle = page.locator("#sidebar-toggle")
    expect(sidebar_toggle).to_be_visible()

    # 9. Verify Recap Box in Exercises
    recap_box = page.locator(".recap-box").first
    expect(recap_box).to_be_visible()

    # Take screenshot of the top of the page (Header, Logo, Sidebar)
    page.screenshot(path="jules-scratch/verification/ui_top.png")

    # Scroll down to see widgets and exercise recap
    page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
    page.wait_for_timeout(500) # Wait for scroll
    page.screenshot(path="jules-scratch/verification/ui_bottom.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
