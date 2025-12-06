
import asyncio
from playwright.async_api import async_playwright
import os

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Verify L03 Quasi-convexity operations
        await page.goto("http://localhost:8000/topics/03-convex-functions/index.html")

        # Scroll to section 8
        # Using a more robust selector that doesn't rely on exact text match which might fail with whitespace
        element = page.locator("h3:has-text('8.5 Operations Preserving Quasi-Convexity')").first

        # Wait for element to be attached
        try:
            await element.wait_for(state="attached", timeout=5000)
            await element.scroll_into_view_if_needed()
            # Screenshot the viewport
            await page.screenshot(path="/home/jules/verification/L03_QuasiOps.png")
            print("Captured L03_QuasiOps.png")
        except Exception as e:
            print(f"Element not found or error: {e}")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
