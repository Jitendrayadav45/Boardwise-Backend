import express from "express";
import cros from "cors";
import authRoutes from "./routes/auth.routes.js";
import boardRoutes from "./routes/board.routes.js";


const app = express();

app.use(cros({
    origin: process.env.CROS_ORIGIN,
    credentials: true
}));

// commmon middlewares
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(express.static("public"));

app.use("/api/user", authRoutes);
app.use("/api/boards", boardRoutes);
export { app };