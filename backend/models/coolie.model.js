import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


const coolieSchema = new mongoose.Schema({

mobile : {
    type : String , 
    required : true ,
} , 

fullname : {
    type : String , 
    required : true 
} , 

category : {
    type : String , 
    required : true 
} , 

locations : {
    type : [String] , 
    required : true 
} , 

profilePic : {
    type : String , 
} , 

password : {
    type : String , 
    required : true 
} , 

refreshToken : {
    type : String 
}

} , {timestamps : true})



coolieSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  }
  next();
});




coolieSchema.methods.isPasswordCorrect = async function (password) {
  const isCorrect = await bcrypt.compare(password, this.password);
  return isCorrect;
};


coolieSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      username: this.fullname,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};



coolieSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};









const Coolie = mongoose.model('Coolie' , coolieSchema)








export {Coolie}