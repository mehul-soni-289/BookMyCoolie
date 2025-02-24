import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({

    mobile : {
        type : String ,  
        required: true 
    } , 
    
    fullname : {
        type :String , 
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



} , {timestamps:true})



userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  }
  next();
});




userSchema.methods.isPasswordCorrect = async function (password) {
    
  const isCorrect = await bcrypt.compare(password, this.password);
  console.log(password);
  console.log(isCorrect);
  
  
  return isCorrect;
};


userSchema.methods.generateAccessToken = function () {
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



userSchema.methods.generateRefreshToken = function () {
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



const User = mongoose.model("User", userSchema);


export {User}