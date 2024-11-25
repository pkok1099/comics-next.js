// pages/api/hello.js

export default function handler(req, res) {
  // Jika request method adalah GET, kembalikan response ini
  if (req.method === 'GET') {
    res.status(200).json({ message: 'Hello, this is your API!' });
  } else {
    // Jika method selain GET, kembalikan error
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
