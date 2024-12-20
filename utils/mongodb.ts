import { MongoClient, Collection, InsertOneResult, Document } from 'mongodb';

// Membuat client MongoDB untuk koneksi yang persisten
if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is not defined.");
}

const client = new MongoClient(process.env.MONGODB_URI, {
  maxPoolSize: 10, // Sesuaikan ukuran pool koneksi jika diperlukan
  socketTimeoutMS: 30000, // Timeout untuk koneksi yang terlalu lama
  serverSelectionTimeoutMS: 5000, // Timeout untuk memilih server
  retryWrites: true, // Aktifkan retry untuk operasi tulis
});

// Menggunakan koneksi langsung tanpa pengaturan khusus untuk pengembangan
const clientPromise: Promise<MongoClient> = client.connect();

// Fungsi untuk membuat user baru
export async function createUser(collection: Collection<Document>, username: string, password: string): Promise<string> {
  try {
    const result: InsertOneResult<Document> = await collection.insertOne({ username, password });
    return result.insertedId.toString();
  } catch (error) {
    throw new Error('Error creating user: ' + (error as Error).message); // Type assertion for error
  }
}

// Fungsi untuk mencari user berdasarkan username
export async function findUserByUsername(collection: Collection<Document>, username: string): Promise<Document | null> {
  try {
    return await collection.findOne({ username });
  } catch (error) {
    throw new Error('Error finding user: ' + (error as Error).message); // Type assertion for error
  }
}

// Fungsi untuk menghubungkan ke database dengan koneksi yang persisten
export async function connectToDatabase(): Promise<{ db: any; client: MongoClient }> {
    let retries = 5; // Maksimal percobaan
    while (retries) {
        try {
            const client = await clientPromise; // Mengambil client dari promise
            const db = client.db("komik"); // Mengambil database 'komik'
            console.log("Berhasil terhubung ke MongoDB");
            return { db, client }; // Mengembalikan database dan client
        } catch (error) {
            console.error("Error connecting to database:", (error as Error).message); // Type assertion for error
            retries -= 1;
            if (!retries) {
                throw new Error("Gagal terhubung ke database setelah beberapa percobaan.");
            }
            await new Promise(res => setTimeout(res, 2000)); // Tunggu 2 detik sebelum mencoba lagi
        }
    }
    throw new Error("Gagal terhubung ke database."); // Ensure a return statement
}