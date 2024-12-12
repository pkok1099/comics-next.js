import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    // Hapus cookie 'user' untuk logout
    res.setHeader(
      'Set-Cookie',
      'user=; HttpOnly; Path=/; Max-Age=0; Secure; SameSite=Strict',
    );
    res.status(200).json({ message: 'Logout successful' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
