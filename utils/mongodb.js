// utils/mongodb.js
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI);

export async function connectToDatabase() {
  await client.connect();
  const db = client.db('komik');
  return { db, client };
}

export async function insertHistory(collection, user, title, chapterId) {
  await collection.insertOne({
    user,
    title,
    chapterId,
    timestamp: new Date(),
  });
}

export async function updateHistory(collection, historyId, chapterId) {
  await collection.updateOne(
    { _id: historyId },
    { 
      $set: { 
        chapterId,
        timestamp: new Date(),
      }
    }
  );
}

export async function findHistory(collection, user, title) {
  return collection.findOne({ user, title });
}

// Fungsi untuk menghapus history berdasarkan ID
export async function deleteHistoryById(collection, historyId) {
  await collection.deleteOne({ _id: historyId });
}