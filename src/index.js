import dotenv from "dotenv";
dotenv.config({
    path: "./src/.env"
});


import { app } from "./app.js";
import { connect } from "mongoose";
import connectDB from "./db/index.js";


const PORT = process.env.PORT || 8001;

connectDB()

.then(() => {
    app.listen(PORT, () => {
        console.log(`🚀🚀🚀 Server is running on port ${PORT}`);
    });
})

.catch((error) => {
    console.log("❌❌❌ [MongoDB] Connection Error", error);
});
