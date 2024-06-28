import mongoose from "mongoose";

const connectToMongoDB = async () => {
    try {
        console.log("Attempting to connect to MongoDB...");
        console.log("MONGO_DB_URI:", process.env.MONGO_DB_URI);
        if (!process.env.MONGO_DB_URI) {
            throw new Error("MONGO_DB_URI is not defined in environment variables");
        }
        await mongoose.connect(process.env.MONGO_DB_URI);
        console.log("Connected to MongoDB successfully");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        console.error("Full error object:", error);
    }
};

export default connectToMongoDB;