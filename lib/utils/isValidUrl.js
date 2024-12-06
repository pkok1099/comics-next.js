const { URL } = require('url');

function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
}

module.exports = isValidUrl;
