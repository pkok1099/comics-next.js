import { MongoClient } from 'mongodb';

// Membuat client MongoDB untuk koneksi yang persisten
const client = new MongoClient(process.env.MONGODB_URI, {
  maxPoolSize: 10, // Sesuaikan ukuran pool koneksi jika diperlukan
  socketTimeoutMS: 30000, // Timeout untuk koneksi yang terlalu lama
  serverSelectionTimeoutMS: 5000, // Timeout untuk memilih server
});

// Menyimpan clientPromise untuk memastikan hanya ada satu koneksi untuk seluruh aplikasi
let clientPromise; // Tidak perlu tipe eksplisit jika menggunakan JavaScript biasa

// Menggunakan global._mongoClientPromise untuk pengembangan agar koneksi tidak dibuat ulang
if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  clientPromise = client.connect();
}

// Fungsi untuk membuat user baru
export async function createUser(collection, username, password) {
  try {
    const result = await collection.insertOne({ username, password });
    return result.insertedId;
  } catch (error) {
    throw new Error('Error creating user: ' + error.message); // Pastikan error dilempar dengan benar
  }
}

// Fungsi untuk mencari user berdasarkan username
export async function findUserByUsername(collection, username) {
  try {
    return await collection.findOne({ username });
  } catch (error) {
    throw new Error('Error finding user: ' + error.message); // Pastikan error dilempar dengan benar
  }
}

// Fungsi untuk menghubungkan ke database dengan koneksi yang persisten
export async function connectToDatabase() {
  try {
    const client = await clientPromise; // Mengambil client dari promise
    const db = client.db('komik'); // Mengambil database 'komik'
    return { db, client }; // Mengembalikan database dan client
  } catch (error) {
    throw new Error('Error connecting to database: ' + error.message); // Pastikan error dilempar dengan benar
  }
}
