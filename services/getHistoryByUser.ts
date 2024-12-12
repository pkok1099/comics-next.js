import { connectToDatabase } from '../utils/mongodb';


export async function getHistoryByUser(user: string): Promise<any> {
  const { db } = await connectToDatabase();
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
