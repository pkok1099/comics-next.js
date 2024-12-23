import { NextApiRequest, NextApiResponse } from 'next';
import fetchKomikPage from 'lib/komikindo/fetchKomikPage';
import { validateUser } from 'utils/validateUser';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    validateUser(req);
    const data = await fetchKomikPage();
    res.status(200).json(data);
  } catch (error) {
    console.error('Homepage API Error:', error);
    res.status(500).json({ message: 'Error fetching homepage data' });
  }
}
