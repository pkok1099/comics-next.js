import { ObjectId } from 'mongodb';
import { connectToDatabase } from '@/services/mongodb';

export async function getHistoryByUser(user) {
  const { db, client } = await connectToDatabase();
  const collection = db.collection('history');
  try {
    const history = await collection.find({ user }).toArray();
    return history;
  } finally {
    await client.close();
  }
}

export async function addOrUpdateHistory(user, title, chapterId) {
  const { db, client } = await connectToDatabase();
  const collection = db.collection('history');
  try {
    const existingHistory = await collection.findOne({ user, title });
    if (existingHistory) {
      await collection.updateOne(
        { _id: existingHistory._id },
        {
          $set: { chapterId, timestamp: new Date() },
        },
      );
      return { message: 'Chapter updated successfully' };
    } else {
      await collection.insertOne({
        user,
        title,
        chapterId,
        timestamp: new Date(),
      });
      return { message: 'History saved successfully' };
    }
  } finally {
    await client.close();
  }
}

export async function deleteHistoryById(user, historyId) {
  const { db, client } = await connectToDatabase();
  const collection = db.collection('history');
  try {
    const parsedHistoryId = ObjectId.isValid(historyId)
      ? new ObjectId(historyId)
      : null;
    if (!parsedHistoryId) {
      throw new Error('Invalid historyId format');
    }

    const existingHistory = await collection.findOne({
      _id: parsedHistoryId,
      user,
    });
    if (!existingHistory) {
      throw new Error('History not found');
    }

    await collection.deleteOne({ _id: parsedHistoryId });
    return { message: 'History deleted successfully' };
  } finally {
    await client.close();
  }
}
