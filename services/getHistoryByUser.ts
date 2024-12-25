import { connectToDatabase } from '../utils/mongodb';

export async function getHistoryByUser(
  user: string,
  page = 1,
  limit = 20,
): Promise<any> {
  const connection = await connectToDatabase();
  if (!connection || !connection.db) {
    throw new Error('Database connection failed');
  }
  const { db } = connection;
  const collection = db.collection('history');

  try {
    const skip = (page - 1) * limit;
    const history = await collection
      .find(
        { user },
        {
          projection: {
            title: 1,
            chapterId: 1,
            thumbnailUrl: 1,
            timestamp: 1,
          },
        },
      )
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    return history;
  } catch (error) {
    console.error('Error getting history:', error);
    throw error;
  }
}
