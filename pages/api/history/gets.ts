import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/utils/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { db } = await connectToDatabase();
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const sort = req.query.sort === 'oldest' ? 1 : -1;
    const skip = (page - 1) * limit;

    const [items, totalCount] = await Promise.all([
      db.collection('history')
        .find({})
        .sort({ timestamp: sort })
        .skip(skip)
        .limit(limit)
        .toArray(),
      db.collection('history').countDocuments({})
    ]);

    return res.status(200).json({
      items,
      total: totalCount
    });
  } catch {
    return res.status(500).json({ message: 'Error fetching history' });
  }
}
