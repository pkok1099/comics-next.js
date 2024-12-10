export function validateUser(req) {
  const cookies = req.headers.cookie;
  const userCookie =
    cookies &&
    cookies.split(';').find((cookie) => cookie.trim().startsWith('user='));
  if (!userCookie) {
    throw new Error('User is not logged in');
  }
  return userCookie.split('=')[1]; // Mendapatkan nilai cookie 'user'
}