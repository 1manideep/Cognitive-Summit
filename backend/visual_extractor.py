import base64
import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

def extract_brand_from_logo(image_path_or_bytes):
    """
    Analyzes an image and extracts the brand name/company name.
    """
    try:
        # Check if input is a path or bytes
        if isinstance(image_path_or_bytes, str) and os.path.exists(image_path_or_bytes):
            base64_image = encode_image(image_path_or_bytes)
        else:
            # Assuming bytes if not a path
            # If it's pure bytes, we encode it
            base64_image = base64.b64encode(image_path_or_bytes).decode('utf-8')

        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful assistant that extracts company names from logos. Return ONLY the company name. If no company name is found or it's illegible, return 'Unknown'."
                },
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": "What is the company name in this logo?"},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{base64_image}"
                            },
                        },
                    ],
                }
            ],
            max_tokens=50
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"Error extracting logo: {e}")
        return "Error"
