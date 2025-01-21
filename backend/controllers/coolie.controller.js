import { Coolie } from "../models/coolie.model.js";

async function registerCoolie(req, res) {
  const { fullname, mobile, password , category , locations } = req.body;
  
  if (!fullname || !mobile || !password || !category) {
    return res.status(400).json({
      Error: "required fields not provided",
    });
  }

  const duplicate = await Coolie.findOne({
    mobile: mobile,
  });

  if (duplicate) {
    return res.status(400).json({
      Error: "coolie already exists",
    });
  }

  const coolie = await Coolie.create({
    fullname,
    mobile,
    password,
    locations , 
    category
  });

  return res.status(201).json({
    Success: "Coolie registration successfull",
  });
}

async function generateAccessTokenRefeshToken(coolieId) {
  const coolie = await Coolie.findById(coolieId);

  const refreshToken = coolie.generateRefreshToken();
  const accessToken = coolie.generateAccessToken();
  coolie.refreshToken = refreshToken;

  await coolie.save({ validateBeforeSave: false });
  return { refreshToken, accessToken };
}

async function loginCoolie(req, res) {
  const { mobile, password } = req.body;

  if (!mobile || !password) {
    return res.status(400).json({
      Error: "required fields not provided",
    });
  }

  const coolie = await Coolie.findOne({
    mobile: mobile,
  });

  if (!coolie) {
    return res.status(401).json({
      Error: "Invalid mobile no",
    });
  }
  const isPasswordCorrect = await coolie.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    return res.status(401).json({
      Error: "Wrong password entered",
    });
  }

  const { accessToken, refreshToken } = await generateAccessTokenRefeshToken(
    coolie._id
  );

  const options = {
    httpOnly: true,
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: "None",
  };

  coolie.password = undefined;

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json({
      Success: "Coolie logged in successfully",
      data: coolie,
    });
}

export { loginCoolie, registerCoolie };
