import * as bcrypt from 'bcrypt';

export const hashString = (plainText?: string, salt = 10): Promise<string | undefined> => {
  if (plainText?.trim()) {
    return bcrypt.hash(plainText, salt);
  }
  return Promise.resolve(undefined);
};
export const compareHashedString = (plainText: string, hashedStr: string): Promise<boolean> => {
  return bcrypt.compare(plainText, hashedStr);
};
