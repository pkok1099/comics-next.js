import { connectToDatabase } from '../utils/mongodb';

export async function getHistoryByUser(user: string): Promise<any> {
  const connection = await connectToDatabase();
  if (!connection || !connection.db) {
    throw new Error('Database connection failed');
  }
  const { db } = connection;
  const collection = db.collection('history');
  try {
    const history = await collection
      .find({ user })
      .sort({ timestamp: -1 })
      .toArray();
    return history;
  } catch (error) {
    console.error('Error getting history by user:', error);
    throw error;
  }
}
