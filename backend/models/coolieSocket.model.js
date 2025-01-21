import mongoose from "mongoose";


const cooliesocketSchema = new mongoose.Schema({

    socketId : {
        type : String 
    } , 

    coolieId : {
        type : mongoose.Schema.Types.ObjectId , 
        ref : "Coolie"
    } , 

    mobile : {
        type : String , 
    }



})

const CoolieSocket = mongoose.model('CoolieSocket' , cooliesocketSchema)

export {CoolieSocket}
