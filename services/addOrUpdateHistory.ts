import { connectToDatabase } from '../utils/mongodb';


export async function addOrUpdateHistory(
  user: string,
  title: string,
  chapterId: string,
  thumbnailUrl: string
): Promise<{ message: string; }> {
  const { db } = await connectToDatabase();
  const collection = db.collection('history');
  try {
    const existingHistory = await collection.findOne({ user, title });
    if (existingHistory) {
      await collection.updateOne(
        { _id: existingHistory._id },
        {
          $set: { chapterId, timestamp: new Date(), thumbnailUrl },
        }
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
