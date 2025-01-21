import { User } from "../models/user.model.js";

async function registerUser(req, res) {
  const { fullname, mobile, password } = req.body;
  if (!fullname || !mobile || !password) {
    return res.status(400).json({
      Error: "required fields not provided",
    });
  }

  const duplicate = await User.findOne({
    mobile: mobile,
  });

  if (duplicate) {
    return res.status(400).json({
      Error: "user already exists",
    });
  }

  const user = await User.create({
    fullname,
    mobile,
    password,
  });

  return res.status(201).json({
    Success: "User registration successfull",
  });
}

async function generateAccessTokenRefeshToken(userId) {
  const user = await User.findById(userId);

  const refreshToken = user.generateRefreshToken();
  const accessToken = user.generateAccessToken();
  user.refreshToken = refreshToken;

  await user.save({ validateBeforeSave: false });
  return { refreshToken, accessToken };
}

async function loginUser(req, res) {
  const { mobile, password } = req.body;

  if (!mobile || !password) {
    return res.status(400).json({
      Error: "required fields not provided",
    });
  }

  const user = await User.findOne({
    mobile: mobile,
  });

  if (!user) {
    return res.status(401).json({
      Error: "Invalid mobile no",
    });
  }
  const isPasswordCorrect = await user.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    return res.status(401).json({
      Error: "Wrong password entered",
    });
  }

  const { accessToken, refreshToken } = await generateAccessTokenRefeshToken(
    user._id
  );

  const options = {
    httpOnly: true,
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: "None",
  };

  user.password = undefined;

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json({
      Success: "User logged in successfully",
      data: user,
    });
}

export { loginUser, registerUser };
