import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { userRouter } from "./routes/user.route.js";
import { coolieRouter } from "./routes/coolie.route.js";
const app = express();

app.use(
  cors({
    origin: ["http://127.0.0.1:3000", "http://localhost:5500"],
    credentials: true,
  })
);
// middelwares

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use('/user' , userRouter)
app.use('/coolie' , coolieRouter)    
 


export { app };
