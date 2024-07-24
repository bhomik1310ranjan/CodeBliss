import dotenv from "dotenv";
import path from "path";

import connectDB from "./db";
import app from "./app";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

connectDB()
    .then(() => {
        const PORT = process.env.PORT || 4000;
        app.on("error", (error) => {
            throw error;
        });
        app.listen(PORT, () => {
            console.log(`Server is running at port ${PORT}`);
        });
    })
    .catch((error) => {
        if (error instanceof Error) {
            console.error(`Error occurred : ${error.name} \n${error.message}`);
        } else if (error && typeof error === "object" && "message" in error) {
            console.error(`Error occurred \n${error.message}`);
        } else {
            console.error(`Error occurred \n${error}`);
        }
    });
