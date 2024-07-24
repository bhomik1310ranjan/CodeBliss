import mongoose from "mongoose";

import { DB_NAME } from "../constants";

const connectDB = async (): Promise<void> => {
    try {
        const connectionInstance = await mongoose.connect(
            `${process.env.MONGODB_URI}/${DB_NAME}`
        );
        console.log(
            `\nMongoDB connected successfully \nDatabase Host : ${connectionInstance.connection.host}`
        );
    } catch (error) {
        if (error instanceof Error) {
            console.error(
                `MongoDB connection failed : ${error.name} \n${error.message}`
            );
        } else if (error && typeof error === "object" && "message" in error) {
            console.error(`MongoDB connection failed \n${error.message}`);
        } else {
            console.error(`MongoDB connection failed \n${error}`);
        }
        process.exit(1);
    }
};

export default connectDB;
