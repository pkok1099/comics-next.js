import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI);


export async function createUser(collection, username, password) {
  const result = await collection.insertOne({ username, password });
  return result.insertedId;
}

export async function findUserByUsername(collection, username) {
  return collection.findOne({ username });
}

export async function connectToDatabase() {
  await client.connect();
  const db = client.db('komik');
  return { db, client };
}