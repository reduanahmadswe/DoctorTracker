// Vercel function that serves every /api/* request through the compiled Express app
// (the build step `npm run build` creates ../dist).
import handler from '../dist/handler.js';

export default handler;
