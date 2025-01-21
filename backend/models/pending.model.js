import mongoose from "mongoose";


const pendingSchema = new mongoose.Schema({

    userId : {
        type : mongoose.Schema.Types.ObjectId , 
        ref : "User"
    } , 

    userName : {

        type : String , 

    } ,


    latitude : {
        type : String , 
    }

    ,
    longitude : {
        type : String ,
    } , 

    location : {
        type : String
    } , 

    mobile :  {
        type : String 
    }




} , {timestamps : true })


const Pending = mongoose.model('Pending' , pendingSchema)

export {Pending}