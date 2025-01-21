import mongoose from "mongoose";


const usersocketSchema = new mongoose.Schema({

    socketId : {
        type : String 
    } , 

    userId : {
        type : mongoose.Schema.Types.ObjectId , 
        ref : "User"
    } , 

    mobile : {
        type : String 
    }

})

const UserSocket = mongoose.model('UserSocket' , usersocketSchema)

export {UserSocket}
