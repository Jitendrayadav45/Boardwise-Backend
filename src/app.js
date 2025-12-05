import express from "express";
import cros from "cors";
import healthcheckRouter from "./routes/healthcheck.routes.js";
import  errorHandler  from "./middlewares/error.middlewares.js";
import authRoutes from "./routes/auth.routes.js";
import boardRoutes from "./routes/board.routes.js";
import listRoutes from "./routes/list.routes.js";
import taskRoutes from "./routes/task.routes.js";




const app = express();

app.use(cros({
    origin: process.env.CROS_ORIGIN,
    credentials: true
}));

// commmon middlewares
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("Boardwise API is running ✅");
});
app.use("/api/healthcheck", healthcheckRouter);
app.use(errorHandler);

app.use("/api/user", authRoutes);
app.use("/api/boards", boardRoutes);
app.use("/api/lists", listRoutes);
app.use("/api/tasks", taskRoutes);



export { app };