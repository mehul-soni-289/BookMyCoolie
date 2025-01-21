import { app } from "./app.js";
import { connectDB } from "./db/dbConnection.js";
import { createServer, ServerResponse } from "http";
import "dotenv/config";
import {Server} from 'socket.io'
import { log } from "console";
import jwt from 'jsonwebtoken'
import { User } from "./models/user.model.js";
import { UserSocket } from "./models/userSocket.model.js";
import { CoolieSocket } from "./models/coolieSocket.model.js";
import { Accepted } from "./models/accepted.model.js";
import { Pending } from "./models/pending.model.js";
import { deflate } from "zlib";
import { Coolie } from "./models/coolie.model.js";
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://127.0.0.1:3000", "http://127.0.0.1:5500"], // Update with your frontend origin for better security
    methods: ["GET", "POST"],
    credentials: true,
  },
});


function getCookie(name, cookies) {
  const matches = cookies.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return matches ? matches[2] : null;
}





connectDB().then(() => {


io.use(async (socket , next)=>{

 const cookies = socket.request.headers.cookie;

 if(!cookies){
  return next(new Error('Authentication Error'))
 }

 const accessToken = getCookie("accessToken", cookies);

//  console.log('accessToken' , accessToken);
 
 const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

 socket.user = decoded

 next()

//  console.log(decoded);
 
})



io.on('connection' ,async (socket)=> {

const type = socket.handshake.query.type 
console.log(type);

  const socketId = socket.id


  if(type == 'user'){

    socket.join('users')

    const user = await UserSocket.findById(socket.user._id)

    if(!user){
    const usersocket = await UserSocket.create({
      userId: socket.user._id,
      socketId: socketId,
    });
    }else {
      user.socketId = socketId 
      user.save()
    }



  }
  else if(type=='coolie'){

    socket.join('coolies')

    const coolie = await CoolieSocket.findById(socket.user._id)

    if(!coolie){
      
    const cooliesocket = await CoolieSocket.create({
      coolieId: socket.user._id,
      socketId: socketId,
    });
    }else {
      coolie.socketId = socketId 
      coolie.save()
    }




  }



  console.log('new connection created with id ' , socket.id);

  let requestTime ;

  socket.on('request' ,async (data)=>{

     const requestedUser = await UserSocket.find({userId : data.userId})
     console.log(requestedUser);
     




     requestTime =  setTimeout(()=>{

      socket.to(requestedUser.socketId).emit('cancelled' , 'Sorry ! No Coolie Found '  )
      console.log("request canceled");
      

    } , 3000)

  const user = await User.findById(data.userId);

  console.log('requested user : ', user);
  

   const requestData =  await Pending.create({
    userName : user.fullname , 
    userId : data.userId , 
    latitude : data.latitude , 
    longitude : data.longitude ,
    location : data.location , 
    mobile : data.mobile 
    })



  


    socket.to('coolies').emit('userRequest' , requestData)
  })



  socket.on('requestAccepted' , async (data)=>{

    const coolieId   = socket.user._id 

    const coolie  = await  Coolie.findById(coolieId)

    console.log('coolie detais' , coolie);
    

    if(coolie){


      socket.to('users').emit('requestAccepted' , {
        coolieName : coolie.fullname , 
        mobile : coolie.mobile
      })


    }





  } )

  
})





  server.listen(process.env.PORT, () => {
    console.log("App is running on " + process.env.PORT);
  });
});
