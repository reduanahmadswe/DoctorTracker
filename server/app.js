// Entry point for Vercel's Express detection: it needs a plain JavaScript file that imports
// `express` and default-exports the app, so the platform serves the compiled app from `dist`
// (created by `npm run build`) without re-compiling the TypeScript sources.
import 'express';

export { default } from './dist/app.js';
