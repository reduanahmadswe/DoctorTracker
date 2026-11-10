// Optional demo login shown on the sign-in page. Both variables must be set for it to appear,
// so production deployments simply leave them out.
const email = process.env.NEXT_PUBLIC_DEMO_EMAIL;
const password = process.env.NEXT_PUBLIC_DEMO_PASSWORD;

export const DEMO_CREDENTIALS = email && password ? { email, password } : null;
