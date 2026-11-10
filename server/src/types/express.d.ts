import type { UserRole } from '../modules/auth/user.model.js';

declare global {
  namespace Express {
    interface Request {
      user?: { _id: { toString(): string }; name: string; email: string; role: UserRole };
    }
  }
}

export {};
