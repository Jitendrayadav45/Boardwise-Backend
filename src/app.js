import express from "express";
import cros from "cors";



const app = express();

app.use(cros({
    origin: process.env.CROS_ORIGIN,
    credentials: true
}));

// commmon middlewares
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(express.static("public"));


export { app };