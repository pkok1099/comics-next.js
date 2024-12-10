import { MongoClient, ObjectId } from 'mongodb';

async function connectToDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI environment variable not set');
  }
  const client = new MongoClient(uri);
  const db = client.db();
  return { db, client };
}

export async function getHistoryByUser(user: string) {
  const { db, client } = await connectToDatabase();
  const collection = db.collection('history');
  try {
    const history = await collection.find({ user }).sort({ timestamp: -1 }).toArray();
    return history;
  } finally {
    await client.close();
  }
}

export async function addOrUpdateHistory(user: string, title: string, chapterId: string, thumbnailUrl: string) {
  const { db, client } = await connectToDatabase();
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
  } finally {
    await client.close();
  }
}

export async function deleteHistory(user: string, historyId: string) {
  const { db, client } = await connectToDatabase();
  const collection = db.collection('history');
  try {
    const result = await collection.deleteOne({ _id: new ObjectId(historyId), user });
    if (result.deletedCount === 0) {
      throw new Error('History not found or user not authorized');
    }
    return { message: 'History deleted successfully' };
  } finally {
    await client.close();
  }
}

