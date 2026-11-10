import { ApiError } from '../../utils/ApiError.js';
import type { LoginInput } from './auth.schemas.js';
import { MISSING_USER_PASSWORD_HASH, verifyPassword } from './password.js';
import { signToken } from './token.js';
import { type User, UserModel } from './user.model.js';

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  role: User['role'];
}

type UserLike = Pick<User, 'name' | 'email' | 'role'> & { _id: { toString(): string } };

export const toPublicUser = (user: UserLike): PublicUser => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role,
});

const INVALID_CREDENTIALS_MESSAGE = 'Invalid email or password';

export const login = async ({
  email,
  password,
}: LoginInput): Promise<{ token: string; user: PublicUser }> => {
  const user = await UserModel.findOne({ email }).select('+password');
  const passwordMatches = await verifyPassword(
    password,
    user?.password ?? MISSING_USER_PASSWORD_HASH,
  );
  if (!user || !passwordMatches) throw ApiError.unauthorized(INVALID_CREDENTIALS_MESSAGE);

  return { token: signToken(user._id.toString(), user.role), user: toPublicUser(user) };
};
