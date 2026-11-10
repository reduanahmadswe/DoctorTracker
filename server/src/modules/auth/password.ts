import bcrypt from 'bcryptjs';

const BCRYPT_COST = 12;

export const hashPassword = (plain: string): Promise<string> => bcrypt.hash(plain, BCRYPT_COST);

export const verifyPassword = (plain: string, hash: string): Promise<boolean> =>
  bcrypt.compare(plain, hash);

// Compared against when the email is unknown, so a missing account and a wrong password take the
// same time and the response does not reveal which emails exist.
export const MISSING_USER_PASSWORD_HASH =
  '$2b$12$FY8pFVycHL73qdVWv3dYE.srECYnccUaoRmuuLh2FLgH9mbGk7cci';
