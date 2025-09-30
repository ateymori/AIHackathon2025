import json
import os
from typing import Any, Dict, List, Optional

from dotenv import load_dotenv
load_dotenv()

def _load_messages() -> List[Dict[str, Any]]:
    candidates = [
        os.path.join(os.path.dirname(__file__), "..", "..", "backend", "messages.json"),
        os.path.join(os.path.dirname(__file__), "..", "..", "backend", "message.json"),
    ]
    for path in candidates:
        abs_path = os.path.abspath(path)
        if os.path.exists(abs_path):
            with open(abs_path, "r", encoding="utf-8") as handle:
                raw = handle.read().strip()
                if not raw:
                    return []
                string = json.loads(raw)
                return string
    return []


def _init_vertex_ai() -> Optional[object]:
    from google.oauth2 import service_account
    import vertexai
    project_id = os.environ.get("GOOGLE_CLOUD_PROJECT")
    location = os.environ.get("GOOGLE_CLOUD_LOCATION", "global")
    return vertexai.init(project=project_id, location=location)


def _call_model(system_instruction: str, content: str) -> Dict[str, Any]:
    vertexai = _init_vertex_ai()
    print("Vertex AI initialized", vertexai)
    if vertexai is None:
        return {"act": "none", "text": ""}

    try:
        from vertexai.generative_models import GenerativeModel, Part, Content
    except Exception:
        return {"act": "none", "text": ""}

    model_name = os.environ.get("VERTEX_MODEL", "gemini-1.5-flash")

    try:
        model = GenerativeModel(model_name)

        prompt = (
            f"{system_instruction}\n\n"
            "Return ONLY a strict JSON object with keys 'act' and 'text'.\n"
            "- 'act' must be either 'send_message' or 'none'.\n"
            "- If 'act' == 'send_message', set 'text' to your reply string.\n"
            "- If 'act' == 'none', set 'text' to ''.\n"
        )

        inputs = [
            Content(role="user", parts=[Part.from_text(prompt)]),
            Content(role="user", parts=[Part.from_text(content)]),
        ]

        response = model.generate_content(
            inputs,
            generation_config={
                "temperature": 0.4,
                "max_output_tokens": 256,
                "response_mime_type": "application/json",
            },
        )

        text = getattr(response, "text", None)
        if not text:
            # Some SDK versions return candidates with JSON
            candidates = getattr(response, "candidates", None)
            if candidates and len(candidates) > 0:
                text = getattr(candidates[0], "content", None)
                if hasattr(text, "parts") and text.parts:
                    part_texts = [getattr(p, "text", "") for p in text.parts]
                    text = "\n".join([t for t in part_texts if t])

        if not text:
            return {"act": "none", "text": ""}

        text = text.strip()
        try:
            data = json.loads(text)
            act = data.get("act")
            msg_text = data.get("text", "")
            if act in ("send_message", "none") and isinstance(msg_text, str):
                if act == "none":
                    msg_text = ""
                return {"act": act, "text": msg_text}
        except Exception:
            pass

        return {"act": "none", "text": ""}
    except Exception:
        return {"act": "none", "text": ""}


def decide_action() -> Dict[str, str]:
    messages = _load_messages()
    if not isinstance(messages, list) or not messages:
        return {"act": "none", "text": ""}

    try:
        messages_sorted = sorted(messages, key=lambda m: m.get("timestamp", 0))
    except Exception:
        messages_sorted = messages

    conversation_text_lines: List[str] = []
    for m in messages_sorted:
        name = str(m.get("name", "user"))
        text = str(m.get("text", ""))
        conversation_text_lines.append(f"{name}: {text}")
    conversation_text = "\n".join(conversation_text_lines)

    system_instruction = (
        "You are an assistant participating in a group chat."
        " Consider the conversation and decide whether to reply."
        " Only reply if you can add helpful, concise value."
    )

    return _call_model(system_instruction, conversation_text)


if __name__ == "__main__":
    result = decide_action()
    print(json.dumps(result, ensure_ascii=False))


