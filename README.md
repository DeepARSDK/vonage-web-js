# Vonage Video & DeepAR Web integration demo

This sample application demonstrates how to use the DeepAR Web to add face filters and masks to your video call using the [Vonage Video(formerly OpenTok) Web SDK](https://tokbox.com/developer/sdks/js/).

To run the sample:

1. Sign up at [DeepAR](https://developer.deepar.ai) and create a web project.
2. Copy the license key and paste it to `src/index.js` (instead of your_license_key_here string).
3. Sign up on https://www.vonage.com/communications-apis/video and either create a new project or use an existing project.
4. Go to your project page and scroll down to the Project Tools section. From there, you can generate a session ID and token manually. Use the project's API key along with the session ID and token you generated.
5. To quickly test the demo go to https://tokbox.com/developer/tools/playground/ on another device (e.g. desktop) to create a conversation room where you can see the feed from test app:
	- On the playground choose "Create new session"
	- Enter your API key
	- Choose latest JS SDK and leave other options unchanged
	- Click "Create" and on the next screen select Connect
	- Now in your session playground screen select "Publish stream" and "Continue" in the next dialog (you don't need to set any options)
6. In `src/index.js` enter `apiKey`, `sessionId` and `token`.
7. Start the development server by running `npm install` and then `npm run dev`.
	- If the browser doesn't open automatically, open http://localhost:8888

## Changing tabs
Changing tabs usually pauses DeepAR rendering since requestAnimationFrame() will not be called by browsers.
To bypass this behaviour, you can call `deepAR.setOffscreenRenderingEnabled(true)`.
It will force rendering even when tab is not focused by using it's internal timer.
This is not recommended so we turn it off as soon as tab gets focus back.