import logging
from typing import AsyncGenerator
from typing_extensions import override
import asyncio
import sys
import time
import os
import uuid
from dotenv import load_dotenv

from google.adk.agents import LlmAgent, BaseAgent, LoopAgent, SequentialAgent
from google.adk.agents.invocation_context import InvocationContext
from google.genai import types
from google.adk.sessions import InMemorySessionService
from google.adk.runners import Runner
from google.adk.events import Event
from pydantic import BaseModel, Field
from google.adk.events import Event, EventActions
from utils import check_environment_variables

# --- Load environment and constants ---
load_dotenv()
check_environment_variables()

# --- Constants ---
APP_NAME = "story_app"
USER_ID = "12345"
SESSION_ID = "123344"
GEMINI_2_FLASH = "gemini-2.0-flash"
MAX_MESSAGES = 10
MAX_MESSAGES_BEFORE_SUMMARY = 1

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
    fact_checker: LlmAgent
    decider: LlmAgent

    # model_config allows setting Pydantic configurations if needed, e.g., arbitrary_types_allowed
    model_config = {"arbitrary_types_allowed": True}

    def __init__(
        self,
        name: str,
        summarizer: LlmAgent,
        fact_checker: LlmAgent,
        decider: LlmAgent,
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
            fact_checker,
            decider,
        ]

        # Pydantic will validate and assign them based on the class annotations.
        super().__init__(
            name=name,
            summarizer=summarizer,
            fact_checker=fact_checker,
            decider=decider,
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
            # Persist final summary into session state
            if event.is_final_response() and event.content and event.content.parts:
                final_text = event.content.parts[0].text
                state_delta = {"summary": final_text, "messages_since_last_summary": 0}
                update_event = Event(
                    invocation_id=uuid.uuid4().hex,
                    author=self.name,
                    timestamp=time.time(),
                    actions=EventActions(state_delta=state_delta),
                )
                yield update_event
                logger.info(
                    f"[{self.name}] Updated session state 'summary' and reset counter."
                )

        logger.info(f"[{self.name}] Workflow finished.")

        decider
        async for event in self.decider.run_async(ctx):

            yield event
            # Persist final fact check into session state
            if event.is_final_response() and event.content and event.content.parts:
                final_text = event.content.parts[0].text
                state_delta = {"decider": final_text, "messages_since_last_fact_check": 0}
                update_event = Event(
                    invocation_id=uuid.uuid4().hex,
                    author=self.name,
                    timestamp=time.time(),
                    actions=EventActions(state_delta=state_delta),
                )
                yield update_event
                logger.info(
                    f"[{self.name}] Updated session state 'decider' and reset counter."
                )

        logger.info(f"[{self.name}] Workflow finished.")

        async for event in self.fact_checker.run_async(ctx):
            logger.info(
                f"[{self.name}] Event from StoryGenerator: {event.model_dump_json(indent=2, exclude_none=True)}"
            )
            yield event
            # Persist final fact check into session state
            if event.is_final_response() and event.content and event.content.parts:
                final_text = event.content.parts[0].text
                state_delta = {"fact_check": final_text, "messages_since_last_fact_check": 0}
                update_event = Event(
                    invocation_id=uuid.uuid4().hex,
                    author=self.name,
                    timestamp=time.time(),
                    actions=EventActions(state_delta=state_delta),
                )
                yield update_event
                logger.info(
                    f"[{self.name}] Updated session state 'fact_check' and reset counter."
                )

        logger.info(f"[{self.name}] Workflow finished.")


# --- Define the individual LLM agents ---
summarizer = LlmAgent(
    name="Summerizer",
    model=GEMINI_2_FLASH,
    instruction="""You are a summarizer for group chat conversations.""",
    input_schema=None,
    output_key="summary",
)

fact_checker = LlmAgent(
    name="FactChecker",
    model=GEMINI_2_FLASH,
    instruction="""You are a fact checker for group chat conversations. If something is not factually correct, you should say so. if it is correct or nothing wrong don't say anything.""",
    input_schema=None,
    output_key="fact_check",
)

decider = LlmAgent(
    name="Decider",
    model=GEMINI_2_FLASH,
    instruction="""Given the conversation history, decide what the next action should be.
    You can either send a message or do nothing.
    If you want to send a message, return a string with the message.
    Just return the message, no other text.
    """,
    input_schema=None,
    output_key="decider",
)

# --- Create the custom agent instance ---
chatter_box_agent = StoryFlowAgent(
    name="ChatterBox",
    summarizer=summarizer,
    fact_checker=fact_checker,
    decider=decider,
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


async def append_message_to_state(session, msg: dict):
    # state_changes is a dict of key → new_value you want to inject
    state_changes = {
        "messages": (session.state["messages"] + [msg])[-MAX_MESSAGES:],
        "messages_since_last_summary": session.state.get(
            "messages_since_last_summary", 0
        )
        + 1,
    }
    actions = EventActions(state_delta=state_changes)
    evt = Event(
        invocation_id=uuid.uuid4().hex,
        author="system",
        actions=actions,
        timestamp=time.time(),
    )
    await global_session_service.append_event(session=session, event=evt)


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

    await append_message_to_state(current_session, new_msg)
    logger.info(f"Added this message to state: {new_msg}")

    messages_since = current_session.state["messages_since_last_summary"]
    if messages_since >= MAX_MESSAGES_BEFORE_SUMMARY:
        previous_summary = current_session.state["summary"]
        new_messages = current_session.state["messages"][-messages_since:]
        prompt_text = f"""Previous summary: {previous_summary if previous_summary else "None"}

                        New messages:
                        {' '.join([f"{m['user']}: {m['msg']}" for m in new_messages])}

                        Please provide an updated summary of the entire conversation, incorporating the new messages."""
        content = types.Content(
            role="user",
            parts=[
                types.Part(text=prompt_text),
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
    else:
        final_response = current_session.state["summary"]
        logger.info("No summary needed yet.")

    print("\n--- Agent Interaction Result ---")
    print("Agent Final Response: ", final_response)

    final_session = await global_session_service.get_session(
        app_name=APP_NAME, user_id=USER_ID, session_id=SESSION_ID
    )
    print("Final Session State:")
    import json

    print(json.dumps(final_session.state, indent=2))
    print("-------------------------------\n")


if __name__ == "__main__":

    async def main():
        await setup_session_and_runner()
        # await call_agent_async("Amin F.", "By the way 2 + 2 is 5")
        await call_agent_async("Amin B.", "Playing tennis this weekend!")
        await call_agent_async("Amin F.", "Lets do it!")
        await call_agent_async("Amin Sh.", "We should picnix instead.")
        await call_agent_async("Sanaz", "It's not a good idea.")
        await call_agent_async("Amin F.", "By the way 2 + 2 is 5")
        

    asyncio.run(main())
