import { MongoClient, ObjectId } from 'mongodb';
import { connectToDatabase } from '../utils/mongodb';

export async function getHistoryByUser(user: string) {
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

export async function addOrUpdateHistory(
  user: string,
  title: string,
  chapterId: string,
  thumbnailUrl: string,
) {
  const { db } = await connectToDatabase();
  const collection = db.collection('history');
  try {
    const existingHistory = await collection.findOne({ user, title });
    if (existingHistory) {
      await collection.updateOne(
        { _id: existingHistory._id },
        {
          $set: { chapterId, timestamp: new Date(), thumbnailUrl },
        },
      );
      return { message: 'History updated successfully' };
    } else {
      await collection.insertOne({
        user,
        title,
        chapterId,
        thumbnailUrl,
        timestamp: new Date(),
      });
      return { message: 'History saved successfully' };
    }
  } catch (error) {
    console.error('Error adding or updating history:', error);
    throw error;
  }
}

export async function deleteHistory(user: string, historyId: string) {
  const { db } = await connectToDatabase();
  const collection = db.collection('history');
  try {
    const result = await collection.deleteOne({
      _id: new ObjectId(historyId),
      user,
    });
    if (result.deletedCount === 0) {
      throw new Error('History not found or user not authorized');
    }
    return { message: 'History deleted successfully' };
  } catch (error) {
    console.error('Error deleting history:', error);
    throw error;
  }
}
