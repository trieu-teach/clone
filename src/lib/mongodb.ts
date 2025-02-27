import mongoose from "mongoose";
import { MongoClient } from 'mongodb';

const connectDB = async () => {
  try {
    const { connection } = await mongoose.connect(process.env.MONGODB_URI as string);
    if (connection.readyState === 1) {
      return Promise.resolve(true);
    }
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}



const clientPromise: Promise<MongoClient> = new Promise(() => {
  const uri = process.env.MONGODB_URI;
  const options = {};
  let client;
  if (!uri) {
    throw new Error('Please add your Mongo URI to .env.local');
  }
  const globalWithMongo = global as typeof globalThis & { _mongoClientPromise: Promise<MongoClient> };
  if (process.env.NODE_ENV === 'development') {
    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, options);
      globalWithMongo._mongoClientPromise = client.connect();
    }
    return globalWithMongo._mongoClientPromise;
  } else {
    client = new MongoClient(uri, options);
    return client.connect();
  }
})



export { clientPromise, connectDB };