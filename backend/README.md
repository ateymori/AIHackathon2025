# Chatter Box

## Description
TODO: Add description

## Setup

Create a virtual environment and install the dependencies.

```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```
Create a `.env` file with your Google AI Studio API key. You can copy from `.env.sample`.

```bash
cp chatter_box/.env.sample chatter_box/.env
```

Then open `chatter_box/.env` and fill in your key or vertex ai api key:

```bash
GOOGLE_API_KEY=your_gemini_api_key_here
```

Run the agent.

```bash
adk web
```
