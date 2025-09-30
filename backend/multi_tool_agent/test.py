from google import genai
from google.genai.types import HttpOptions
import os

client = genai.Client(http_options=HttpOptions(api_version="v1"), api_key=os.getenv("API_KEY"), vertexai=True)
response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="Hi"
)
print(response.text)
# Example response:
# Okay, let's break down how AI works. It's a broad field, so I'll focus on the ...
#
# Here's a simplified overview:
# ...