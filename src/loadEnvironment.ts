import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();
const connectionString = process.env.MONGO_URI || "";

// Initialise the Db connection
const initializeDBConnection = async () => {
    try {
        await mongoose.connect(connectionString);
        console.log("successfully connected");
    }
    catch (error: any) {
        console.error(error)
    }
}

// module.exports = { initializeConnection };

export default initializeDBConnection;

