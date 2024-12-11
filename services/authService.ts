import {
  connectToDatabase,
  createUser,
  findUserByUsername,
} from '../utils/mongodb';
import bcrypt from 'bcryptjs';

export async function registerUser(username: string, password: string) {
  const { db } = await connectToDatabase();
  const collection = db.collection('users');

  try {
    const existingUser = await findUserByUsername(collection, username);
    if (existingUser) {
      throw new Error('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await createUser(collection, username, hashedPassword);
    return { message: 'User registered successfully', userId };
  } catch (error) {
    console.error('Error during registration:', error);
    throw error;
  }
}

export async function loginUser(username: string, password: string) {
  const { db } = await connectToDatabase();
  const collection = db.collection('users');

  try {
    const user = await findUserByUsername(collection, username);
    if (!user) {
      throw new Error('User not found');
    }

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
