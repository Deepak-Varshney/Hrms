import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

// Validate that the database name doesn't contain quotes
// Extract database name from URI (between last / and ?)
const dbNameMatch = MONGODB_URI.match(/\.net\/([^?]+)/);
if (dbNameMatch && dbNameMatch[1]) {
  const dbName = dbNameMatch[1];
  if (dbName.includes('"') || dbName.includes("'")) {
    throw new Error(
      `Invalid database name in MONGODB_URI: "${dbName}". Database name should not contain quotes. ` +
      `Example: mongodb+srv://user:pass@cluster.mongodb.net/hrmsnew?retryWrites=true (not "hrmsnew")`
    );
  }
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
