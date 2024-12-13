import { connectToDatabase } from '../utils/mongodb';

export async function addOrUpdateHistory(
  user: string,
  title: string,
  chapterId: string,
  thumbnailUrl: string,
): Promise<{ message: string }> {
  const { db } = await connectToDatabase();
  const collection = db.collection('history');

  try {
    // Cari entri berdasarkan user dan title
    const existingHistory = await collection.findOne({ user, title });

    if (existingHistory) {
      // Validasi agar chapterId lebih besar
      if (parseInt(chapterId) <= parseInt(existingHistory.chapterId)) {
        return { message: 'Cannot update to a lower or equal chapterId' };
      }

      // Update jika chapterId valid
      await collection.updateOne(
        { _id: existingHistory._id },
        {
          $set: { chapterId, timestamp: new Date(), thumbnailUrl },
        },
      );
      return { message: 'History updated successfully' };
    } else {
      // Insert data baru
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
