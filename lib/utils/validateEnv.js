const isValidUrl = require('./isValidUrl');

function validateEnv(key) {
  const envValue = process.env[key];

  if (!envValue) {
    throw new Error(
      `Missing environment variable: ${key}. Ensure this is set before running the application.`,
    );
  }

  return envValue;
}

module.exports = validateEnv;
