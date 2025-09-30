# Chatter Box

## Description
TODO: Add description

## Setup

Run all commands from within the `agent` directory.
Create a virtual environment and install the dependencies.

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```
Create a `.env` file with your Google AI Studio API key. You can copy from `.env.sample`.

```bash
cp .env.sample .env
```

Then update the `.env` file and either fill in your Google AI Studio API key or Vertex AI config:


```bash
# Content of .env for Google AI Studio API
GOOGLE_GENAI_USE_VERTEXAI=FALSE
GOOGLE_API_KEY=your_gemini_api_key_here
```

Or alternatively use Vertex AI:
```bash
gcloud auth application-default login
```

```bash
# Content of .env for Vertex AI
GOOGLE_GENAI_USE_VERTEXAI=TRUE
GOOGLE_CLOUD_PROJECT=YOUR_PROJECT_ID
GOOGLE_CLOUD_LOCATION=LOCATION
```

Run the sample run of the agent.

```bash
python -m chatter_box.agent
```

Run the server.

```bash
python -m chatter_box.server.server
```
