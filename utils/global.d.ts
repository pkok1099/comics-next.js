import { MongoClient } from "mongodb";


declare global {
  namespace NodeJS {
    interface Global {
      _mongoClientPromise?: Promise<MongoClient>; // Use optional property to avoid index signature error
    }
  }
}
