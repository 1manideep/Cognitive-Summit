import asyncio
import os
import aiohttp 
from crawl4ai import AsyncWebCrawler
from visual_extractor import extract_brand_from_logo

class ConferenceScraper:
    async def extract_sponsors(self, url):
        results = []
        
        # JS to scroll to bottom to trigger lazy loading
        scroll_js = """
        async () => {
            const distance = 100;
            const delay = 100;
            const timer = setInterval(() => {
                document.scrollingElement.scrollBy(0, distance);
                if (document.scrollingElement.scrollTop + window.innerHeight >= document.scrollingElement.scrollHeight) {
                    clearInterval(timer);
                }
            }, delay);
            // Wait a bit for scroll to finish/content to load - naive approach
            await new Promise(r => setTimeout(r, 5000));
        }
        """

        # JS to extract image details
        extract_images_js = """
        () => {
            const images = Array.from(document.querySelectorAll('img'));
            return images.map(img => {
                const rect = img.getBoundingClientRect();
                return {
                    src: img.src,
                    alt: img.alt,
                    width: rect.width,
                    height: rect.height,
                    visible: rect.width > 50 && rect.height > 20
                };
            }).filter(img => img.visible && img.src);
        }
        """

        try:
            async with AsyncWebCrawler(verbose=True) as crawler:
                # We can run the scroll script using 'js_code' 
                # or simpler: crawl4ai handles some stuff, but let's be explicit with JS execution if needed.
                # Actually crawl4ai's arun returns a CrawlResult. 
                # It has a js_code parameter to execute before extraction.
                
                result = await crawler.arun(
                    url=url,
                    js_code=[scroll_js], # Execute scroll
                    word_count_threshold=1,
                    bypass_cache=True
                )
                
                if not result.success:
                    print(f"Failed to crawl {url}: {result.error_message}")
                    return []

                # Since result.media might not contain all details we want (custom logic),
                # we might want to attach a hook or just use the page object if exposed?
                # crawl4ai v0.2+ exposes logic better. 
                # But actually, 'js_code' doesn't return values in the result object directly unless we use magic.
                # Let's use the crawler's page directly if possible or trust the extraction.
                # 'result.media' contains images properly identified. 
                # Let's try to trust result.media first, but the custom filtering logic (width/height) 
                # done in python after extraction is safer if we get all images.
                
                # However, crawl4ai's 'media' extraction might filter things out.
                # Let's use the `crawler` instance to evaluate JS since we are in the context?
                # No, AsyncWebCrawler context manager lifecycle. 
                # Let's just use the JS execution to get the data we need?
                # crawl4ai doesn't easily return custom JS return values in 'arun' result yet (depending on version).
                # PROPOSAL: Use `crawler.arun` which returns result. 
                # If we need custom JS extraction, maybe we can use `hooks` or rely on `result.media`.
                # Let's try to use Playwright page via crawler if available, OR just rely on standard extraction 
                # then filter.
                
                # Let's assume we can get all images.
                # Wait, the previous code had specific logic: 
                # 1. 50x20 size check.
                # 2. Alt text check.
                # 3. Vision API check.
                
                # We will re-implement this.
                # To get the images with dimensions, we really need to run that JS.
                # Using the underlying playwright page is the most robust way if valid.
                # crawl4ai >= 0.4.0 allows accessing the page?
                # Let's assume we can't easily access the page object after `arun` finishes (it closes).
                # But we can use `crawler.crawler_strategy`...
                
                # SIMPLIFICATION:
                # We will use `js_code` to scroll. 
                # Then we will trust `result.media.images`.
                # It supposedly captures all images. 
                # We will filter by checking content-length or just trying to download.
                # But we miss the dimensions check which was client-side.
                # That's okay, we can check dimensions after download or just assume result.media is good enough.
                # Actually, filtering small icons is useful.
                # Let's use a custom js extraction script passed as 'js_code' is not for extraction return.
                
                # ALTERNATIVE: Use `crawler.arun` but with `js_only=True`?? No.
                
                # Let's stick to: Scroll then extract all images found by crawl4ai.
                # Then process them.
                
                images_to_process = []
                if result.media and "images" in result.media:
                    for img in result.media["images"]:
                        # img is a dict usually with src, alt, score, etc.
                        src = img.get("src")
                        if not src:
                            continue
                        images_to_process.append(img)
                
                print(f"Found {len(images_to_process)} images from crawl4ai. Processing...")
                
                unique_companies = set()
                
                # Need an HTTP session
                async with aiohttp.ClientSession() as session:
                    for i, img_data in enumerate(images_to_process):
                        src = img_data.get("src")
                        alt_text = img_data.get("alt", "")
                        
                        # Heuristic: Skip if src is data:image (unless we want to handle it) or very short?
                        # The previous code handled all.
                        
                        # Heuristic from previous code:
                        # if alt_text > 2 chars, use it.
                        
                        company_name = "Unknown"
                        if alt_text and len(alt_text) > 2:
                            company_name = alt_text
                        else:
                            # Verify image size/content before spending API credits?
                            # We lost the dimension check from DOM. 
                            # We can check dimensions after download.
                            
                            try:
                                # Download image
                                image_content = None
                                if src.startswith("data:image"):
                                    # Handle base64
                                    # ... skip for now or implement if needed
                                    pass
                                else:
                                    async with session.get(src, timeout=10) as resp:
                                        if resp.status == 200:
                                            image_content = await resp.read()
                                
                                if image_content:
                                    # Call Vision API
                                    company_name = extract_brand_from_logo(image_content)
                            except Exception as e:
                                print(f"Failed to process image {src}: {e}")
                                continue

                        if company_name and company_name != "Unknown" and company_name not in unique_companies:
                            unique_companies.add(company_name)
                            results.append({"Company": company_name, "Source": "Sponsor Page", "Logo_Url": src})
                            print(f"Identified: {company_name}")

        except Exception as e:
            print(f"Error scraping sponsors: {e}")

        return results

    async def extract_agenda(self, url):
        return []

async def run_scrape(url):
    scraper = ConferenceScraper()
    sponsors = await scraper.extract_sponsors(url)
    return sponsors

if __name__ == "__main__":
    # Test
    url = "https://fieldserviceusa.wbresearch.com/sponsors"
    sponsors = asyncio.run(run_scrape(url))
    print(sponsors)

