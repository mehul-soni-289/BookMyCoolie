import mongoose from "mongoose";


const acceptedSchema = new mongoose.Schema({

    userId : {
        type : mongoose.Schema.Types.ObjectId , 
        ref : "User"
    } , 

    coolieId : {
        type : mongoose.Schema.Types.ObjectId , 
        ref : "Coolie"
    } , 

    coolieName : {
        type : String , 

    } , 

    mobile : {
        type : String , 
    } , 

    distance : {
        type : Number ,
    } , 




} , {timestamps : true })


const Accepted = mongoose.model('Accepted' , acceptedSchema)

export {Accepted}