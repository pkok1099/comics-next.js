import {
  MongoClient,
  Collection,
  InsertOneResult,
  Document,
  MongoClientOptions,
} from 'mongodb';

const options: MongoClientOptions = {
  maxPoolSize: 20,
  minPoolSize: 5,
  maxIdleTimeMS: 60000,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  serverSelectionTimeoutMS: 5000,
  retryWrites: true,
  compressors: ['zlib'],
};

if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable is not defined.');
}

const client = new MongoClient(process.env.MONGODB_URI, options);
const clientPromise: Promise<MongoClient> = client.connect();

let cachedClient: MongoClient | null = null;
let cachedDb: any = null;

// Fungsi untuk membuat user baru
export async function createUser(
  collection: Collection<Document>,
  username: string,
  password: string,
): Promise<string> {
  try {
    const result: InsertOneResult<Document> = await collection.insertOne({
      username,
      password,
    });
    return result.insertedId.toString();
  } catch (error) {
    throw new Error('Error creating user: ' + (error as Error).message); // Type assertion for error
  }
}

// Fungsi untuk mencari user berdasarkan username
export async function findUserByUsername(
  collection: Collection<Document>,
  username: string,
): Promise<Document | null> {
  try {
    return await collection.findOne({ username });
  } catch (error) {
    throw new Error('Error finding user: ' + (error as Error).message); // Type assertion for error
  }
}

// Fungsi untuk menghubungkan ke database dengan koneksi yang persisten
export async function connectToDatabase(): Promise<{
  db: any;
  client: MongoClient;
}> {
  if (cachedClient && cachedDb) {
    return { db: cachedDb, client: cachedClient };
  }

  let retries = 3;
  while (retries) {
    try {
      const client = await clientPromise;
      const db = client.db('komik');

      cachedClient = client;
      cachedDb = db;

      return { db, client };
    } catch (error) {
      console.error('Connection error:', (error as Error).message);
      retries--;
      if (!retries) throw error;
      await new Promise((res) => setTimeout(res, 1000));
    }
  }
  throw new Error('Failed to connect to database');
}

export async function closeConnection() {
  if (cachedClient) {
    await cachedClient.close();
    cachedClient = null;
    cachedDb = null;
  }
}
