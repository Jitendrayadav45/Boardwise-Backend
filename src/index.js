// console.log("hello jitendra");

import dotenv from "dotenv";
import { app } from "./app.js";
import { connect } from "mongoose";
import connectDB from "./db/index.js";



dotenv.config({
    path: "./src/.env"
});

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
