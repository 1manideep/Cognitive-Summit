import asyncio
from playwright.async_api import async_playwright
import os
from visual_extractor import extract_brand_from_logo

class ConferenceScraper:
    def __init__(self):
        self.browser = None
        self.context = None
        self.page = None

    async def start_browser(self):
        self.playwright = await async_playwright().start()
        self.browser = await self.playwright.chromium.launch(headless=True)
        self.context = await self.browser.new_context(
            viewport={"width": 1920, "height": 1080},
            user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        )
        # STEALTH: Mask the webdriver property to avoid basic bot detection
        await self.context.add_init_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
        
        self.page = await self.context.new_page()

    async def stop_browser(self):
        if self.browser:
            await self.browser.close()
        if self.playwright:
            await self.playwright.stop()

    async def scroll_to_bottom(self):
        """Scrolls to the bottom of the page to handle infinite loading."""
        previous_height = await self.page.evaluate("document.body.scrollHeight")
        while True:
            await self.page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
            await asyncio.sleep(2)  # Wait for content to load
            new_height = await self.page.evaluate("document.body.scrollHeight")
            if new_height == previous_height:
                break
            previous_height = new_height

    async def extract_sponsors(self, url):
        results = []
        try:
            await self.page.goto(url, timeout=60000)
            await self.page.wait_for_load_state("networkidle")
            
            # Scroll to load all images
            await self.scroll_to_bottom()
            
            # Heuristic: Look for images in likely sponsor containers
            # This is generic; we might need to adjust for specific site
            # Common patterns: 'img' inside links, grids
            
            # Find all images that might be logos
            # We filter small images (likely icons)
            images = await self.page.locator("img").all()
            
            print(f"Found {len(images)} images. Processing...")
            
            unique_companies = set()

            for i, img in enumerate(images):
                # Filter out small icons or 1x1 pixels
                box = await img.bounding_box()
                if not box or box['width'] < 50 or box['height'] < 20:
                    continue
                
                # Check for alt text first
                alt_text = await img.get_attribute("alt")
                src = await img.get_attribute("src")

                # If we have alt text that looks real, use it
                company_name = "Unknown"
                if alt_text and len(alt_text) > 2:
                    company_name = alt_text
                else:
                    # Capture screenshot for Vision API
                    screenshot_path = f"logo_{i}.png"
                    try:
                        await img.screenshot(path=screenshot_path)
                        # Call Vision API
                        company_name = extract_brand_from_logo(screenshot_path)
                        # Clean up
                        if os.path.exists(screenshot_path):
                            os.remove(screenshot_path)
                    except Exception as e:
                        print(f"Failed to process image {i}: {e}")
                        continue
                
                if company_name and company_name != "Unknown" and company_name not in unique_companies:
                    unique_companies.add(company_name)
                    results.append({"Company": company_name, "Source": "Sponsor Page", "Logo_Url": src})
                    print(f"Identified: {company_name}")

        except Exception as e:
            print(f"Error scraping sponsors: {e}")
        
        return results

    async def extract_agenda(self, url):
        # Placeholder for agenda extraction
        # We would navigate to the agenda page and scrape speakers
        return []

async def run_scrape(url):
    scraper = ConferenceScraper()
    await scraper.start_browser()
    sponsors = await scraper.extract_sponsors(url)
    await scraper.stop_browser()
    return sponsors

if __name__ == "__main__":
    # Test
    url = "https://fieldserviceusa.wbresearch.com/sponsors"
    sponsors = asyncio.run(run_scrape(url))
    print(sponsors)
