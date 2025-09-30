# app/agent.py
import os
from dotenv import load_dotenv
from adk import Agent, Runner
from adk.models import GeminiModel 

load_dotenv()
MODEL_NAME = os.getenv("GEMINI_MODEL", "gemini-1.5-pro")
API_KEY = os.getenv("GOOGLE_API_KEY")

def build_agent() -> Agent:
    model = GeminiModel(model=MODEL_NAME, api_key=API_KEY)
    return Agent(
        model=model,
        system_prompt="You are a concise, helpful chat agent for our website."
    )

# Runner manages executing the agent (single call or streaming)
runner = Runner(agent=build_agent())
