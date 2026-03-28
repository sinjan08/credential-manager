import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.DB_URL as string;

if (!MONGODB_URI) {
    throw new Error("Please define DB_URL in .env");
}

declare global {
    var mongoose: {
        conn: Mongoose | null;
        promise: Promise<Mongoose> | null;
    };
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = {
        conn: null,
        promise: null,
    };
}

export const INIT_DATABASE = async (): Promise<Mongoose> => {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, {
            bufferCommands: false,
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (err) {
        cached.promise = null;
        throw err;
    }

    return cached.conn;
};