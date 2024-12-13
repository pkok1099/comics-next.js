import bcrypt from 'bcryptjs';
import {
  connectToDatabase,
  createUser,
  findUserByUsername,
} from '@/utils/mongodb';
interface User {
  _id: string;
  username: string;
}
// Fungsi untuk registrasi user
export async function registerUser(
  username: string,
  password: string,
): Promise<User | null> {
  const { db } = await connectToDatabase();
  const collection = db.collection('users');

  try {
    // Cek apakah user sudah ada
    const existingUser = await findUserByUsername(collection, username);
    if (existingUser) {
      throw new Error('Username already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat user baru
    const userId = await createUser(collection, username, hashedPassword);
    return { message: 'User registered successfully', userId };
  } catch (error) {
    console.error('Error during registration:', error);
    throw error;
  }
}

// Fungsi untuk login user
export async function loginUser(
  username: string,
  password: string,
): Promise<User | null> {
  const { db } = await connectToDatabase();
  const collection = db.collection('users');

  try {
    // Cari user berdasarkan username
    const user = await findUserByUsername(collection, username);
    if (!user) {
      throw new Error('User not found');
    }

    // Validasi password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    return { message: 'Login successful', userId: user._id };
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
}
