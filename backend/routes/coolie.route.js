import express from "express";
import { registerCoolie, loginCoolie } from "../controllers/coolie.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const coolieRouter = express.Router();

coolieRouter.post("/register", registerCoolie);
coolieRouter.post("/login", loginCoolie);

export { coolieRouter };
