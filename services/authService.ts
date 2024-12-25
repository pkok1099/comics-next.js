import bcrypt from 'bcryptjs';
import { LRUCache } from 'lru-cache';
import {
  connectToDatabase,
  createUser,
  findUserByUsername,
} from '@/utils/mongodb';

interface User {
  _id: string;
  username: string;
  password: string;
}

interface AuthResponse {
  message: string;
  userId: string;
}

const userCache = new LRUCache<string, User>({
  max: 500,
  ttl: 1000 * 60 * 5, // 5 minutes
});

export async function registerUser(
  username: string,
  password: string,
): Promise<User | null> {
  const connection = await connectToDatabase();
  if (!connection || !connection.db) {
    throw new Error('Database connection failed');
  }
  const { db } = connection;
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

    // Kembalikan data user dengan tipe User
    return { _id: userId, username, password: hashedPassword };
  } catch (error) {
    console.error('Error during registration:', error);
    throw error;
  }
}

// Fungsi untuk login user
export async function loginUser(
  username: string,
  password: string,
): Promise<(User & AuthResponse) | null> {
  try {
    // Check cache first
    const cachedUser = userCache.get(username);
    if (cachedUser) {
      const isPasswordValid = await bcrypt.compare(
        password,
        cachedUser.password,
      );
      if (isPasswordValid) {
        return {
          _id: cachedUser._id,
          username: cachedUser.username,
          password: cachedUser.password,
          message: 'Login successful',
          userId: cachedUser._id,
        };
      }
    }

    const connection = await connectToDatabase();
    if (!connection || !connection.db) {
      throw new Error('Database connection failed');
    }
    const { db } = connection;
    const collection = db.collection('users');

    // Cari user berdasarkan username
    const foundUser = await findUserByUsername(collection, username);
    if (!foundUser) {
      throw new Error('User not found');
    }
    const user = foundUser as unknown as User;

    // Validasi password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    // Cache the user after successful login
    userCache.set(username, user);

    return {
      _id: user._id,
      username: user.username,
      password: user.password,
      message: 'Login successful',
      userId: user._id,
    };
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
  return null;
}
