import asyncio
from aiohttp import web
from chatter_box.agent import call_agent_async, setup_session_and_runner


async def handle_message(request):
    try:
        data = await request.json()
    except Exception as e:
        return web.Response(status=400, text="Invalid JSON")

    user = data.get("user")
    message = data.get("message")
    if not user or not message:
        return web.Response(status=400, text="Missing user or message")

    response = await call_agent_async(user, message)
    return web.json_response({"response": response})


if __name__ == "__main__":

    async def start_server():
        await setup_session_and_runner()
        app = web.Application()
        app.router.add_post("/message", handle_message)
        runner = web.AppRunner(app)
        await runner.setup()
        site = web.TCPSite(runner, "localhost", 5000)
        await site.start()
        print("Server started at http://localhost:5000/message")
        await asyncio.Event().wait()  # Run forever

    asyncio.run(start_server())
