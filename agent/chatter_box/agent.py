import logging
from typing import AsyncGenerator
from typing_extensions import override
import asyncio
import sys
import os
from dotenv import load_dotenv

from google.adk.agents import LlmAgent, BaseAgent, LoopAgent, SequentialAgent
from google.adk.agents.invocation_context import InvocationContext
from google.genai import types
from google.adk.sessions import InMemorySessionService
from google.adk.runners import Runner
from google.adk.events import Event
from pydantic import BaseModel, Field
from utils import check_environment_variables

# --- Load environment and constants ---
load_dotenv()
check_environment_variables()

# --- Constants ---
APP_NAME = "story_app"
USER_ID = "12345"
SESSION_ID = "123344"
GEMINI_2_FLASH = "gemini-2.0-flash"

# --- Configure Logging ---
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# --- Custom Orchestrator Agent ---
class StoryFlowAgent(BaseAgent):
    """
    Custom agent for a story generation and refinement workflow.

    This agent orchestrates a sequence of LLM agents to generate a story,
    critique it, revise it, check grammar and tone, and potentially
    regenerate the story if the tone is negative.
    """

    # --- Field Declarations for Pydantic ---
    # Declare the agents passed during initialization as class attributes with type hints
    summarizer: LlmAgent

    # model_config allows setting Pydantic configurations if needed, e.g., arbitrary_types_allowed
    model_config = {"arbitrary_types_allowed": True}

    def __init__(
        self,
        name: str,
        summarizer: LlmAgent,
    ):
        """
        Initializes the StoryFlowAgent.

        Args:
            name: The name of the agent.
            story_generator: An LlmAgent to generate the initial story.
            critic: An LlmAgent to critique the story.
            reviser: An LlmAgent to revise the story based on criticism.
            grammar_check: An LlmAgent to check the grammar.
            tone_check: An LlmAgent to analyze the tone.
        """

        # Define the sub_agents list for the framework
        sub_agents_list = [
            summarizer,
        ]

        # Pydantic will validate and assign them based on the class annotations.
        super().__init__(
            name=name,
            summarizer=summarizer,
            sub_agents=sub_agents_list,  # Pass the sub_agents list directly
        )

    @override
    async def _run_async_impl(
        self, ctx: InvocationContext
    ) -> AsyncGenerator[Event, None]:
        """
        Implements the custom orchestration logic for the story workflow.
        Uses the instance attributes assigned by Pydantic (e.g., self.story_generator).
        """
        logger.info(f"[{self.name}] Starting story generation workflow.")

        # 1. Initial Story Generation
        logger.info(f"[{self.name}] Running StoryGenerator...")
        async for event in self.summarizer.run_async(ctx):
            logger.info(
                f"[{self.name}] Event from StoryGenerator: {event.model_dump_json(indent=2, exclude_none=True)}"
            )
            yield event

        # Check if story was generated before proceeding
        if not ctx.session.state.get("summary"):
            logger.error(
                f"[{self.name}] Failed to generate initial story. Aborting workflow."
            )
            return  # Stop processing if initial story failed

        logger.info(
            f"[{self.name}] Story state after generator: {ctx.session.state.get('current_story')}"
        )

        logger.info(f"[{self.name}] Workflow finished.")


# --- Define the individual LLM agents ---
summarizer = LlmAgent(
    name="Summerizer",
    model=GEMINI_2_FLASH,
    instruction="""You are supposed to summarize a list of messages of a group chat.""",
    input_schema=None,
    output_key="summary",
)

# --- Create the custom agent instance ---
chatter_box_agent = StoryFlowAgent(
    name="ChatterBox",
    summarizer=summarizer,
)

INITIAL_STATE = {
    "messages": [
        {"user": "amin@gmail.com", "msg": "Tennis tomorrow?"},
        {"user": "ali@gmail.com", "msg": "Sure."},
    ],
    "summary": "",
    "messages_since_last_summary": 0,
}
global_session_service = None
global_runner = None


# --- Setup Runner and Session ---
async def setup_session_and_runner():
    global global_session_service, global_runner

    session_service = InMemorySessionService()
    session = await session_service.create_session(
        app_name=APP_NAME, user_id=USER_ID, session_id=SESSION_ID, state=INITIAL_STATE
    )
    logger.info(f"Initial session state: {session.state}")
    runner = Runner(
        agent=chatter_box_agent,  # Pass the custom orchestrator agent
        app_name=APP_NAME,
        session_service=session_service,
    )
    global_session_service = session_service
    global_runner = runner


# --- Function to Interact with the Agent ---
async def call_agent_async(user: str, message: str):
    """
    Sends a new topic to the agent (overwriting the initial one if needed)
    and runs the workflow.
    """
    new_msg = {"user": user, "msg": message}

    current_session = await global_session_service.get_session(
        app_name=APP_NAME, user_id=USER_ID, session_id=SESSION_ID
    )
    if not current_session:
        logger.error("Session not found!")
        return

    current_session.state["messages"].append(new_msg)
    logger.info(f"Added this message to state: {new_msg}")

    content = types.Content(
        role="user",
        parts=[
            types.Part(text=new_msg["user"]),
            types.Part(text=new_msg["msg"]),
        ],
    )
    events = global_runner.run_async(
        user_id=USER_ID, session_id=SESSION_ID, new_message=content
    )

    final_response = "No final response captured."
    async for event in events:
        if event.is_final_response() and event.content and event.content.parts:
            logger.info(
                f"Potential final response from [{event.author}]: {event.content.parts[0].text}"
            )
            final_response = event.content.parts[0].text

    print("\n--- Agent Interaction Result ---")
    print("Agent Final Response: ", final_response)

    final_session = await global_session_service.get_session(
        app_name=APP_NAME, user_id=USER_ID, session_id=SESSION_ID
    )
    print("Final Session State:")
    import json

    print(json.dumps(final_session.state, indent=2))
    print("-------------------------------\n")


# # --- Function to Interact with the Agent ---
# async def call_agent_async(user_input_topic: str):
#     """
#     Sends a new topic to the agent (overwriting the initial one if needed)
#     and runs the workflow.
#     """

#     session_service, runner = await setup_session_and_runner()

#     current_session = await session_service.get_session(
#         app_name=APP_NAME, user_id=USER_ID, session_id=SESSION_ID
#     )
#     if not current_session:
#         logger.error("Session not found!")
#         return

#     current_session.state["topic"] = user_input_topic
#     logger.info(f"Updated session state topic to: {user_input_topic}")

#     content = types.Content(
#         role="user",
#         parts=[types.Part(text=f"Generate a story about: {user_input_topic}")],
#     )
#     events = runner.run_async(
#         user_id=USER_ID, session_id=SESSION_ID, new_message=content
#     )

#     final_response = "No final response captured."
#     async for event in events:
#         if event.is_final_response() and event.content and event.content.parts:
#             logger.info(
#                 f"Potential final response from [{event.author}]: {event.content.parts[0].text}"
#             )
#             final_response = event.content.parts[0].text

#     print("\n--- Agent Interaction Result ---")
#     print("Agent Final Response: ", final_response)

#     final_session = await session_service.get_session(
#         app_name=APP_NAME, user_id=USER_ID, session_id=SESSION_ID
#     )
#     print("Final Session State:")
#     import json

#     print(json.dumps(final_session.state, indent=2))
#     print("-------------------------------\n")


if __name__ == "__main__":
    # --- Run the Agent ---
    # Note: In Colab, you can directly use 'await' at the top level.
    # If running this code as a standalone Python script, you'll need to use asyncio.run() or manage the event loop.
    # await call_agent_async("a lonely robot finding a friend in a junkyard")
    async def main():
        await setup_session_and_runner()
        await call_agent_async("Amin", "Playing tennis this weekend!")

    asyncio.run(main())
