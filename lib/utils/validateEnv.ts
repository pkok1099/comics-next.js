function validateEnv(key: string): string {
  const envValue = process.env[key];

  if (!envValue) {
    throw new Error(
      `Missing environment variable: ${key}. Ensure this is set before running the application.`,
    );
  }

  return envValue;
}

export default validateEnv;
