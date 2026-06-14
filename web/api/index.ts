import { createApp } from "../server/app";

// Vercel serverless function — wraps the Express app
const app = createApp();

export default app;
