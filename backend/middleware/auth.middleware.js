import jwt from "jsonwebtoken";

import { User } from "../models/user.model.js";

export const verifyJWT = async function (req, res, next) {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        Error: "Unauthorized request",
      });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); // decode the token

    const user = await User.findById(decoded?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      return res.status(401).json({
        Error: "Invalid token provided",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      Error: "invalid token from catch",
    });
  }
};
