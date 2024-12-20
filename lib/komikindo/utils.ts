import validateEnv from '../utils/validateEnv';

class CustomError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CustomError";
  }
}

const constructUrl = (path: string): string => {
  const baseUrl = validateEnv('URL_KOMIK');
  return `${baseUrl}${path}`;
};

export { CustomError, constructUrl };
