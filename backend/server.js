
import http from 'http';
import { Server } from 'socket.io';
// import initSockets from './sockets/index.js';
import express from 'express';
import connectDB from './config/connectDB.js';
import Routes from './routes/web.js';
import dotenv from 'dotenv';
import path from 'path';


dotenv.config();
const app = express();

const PORT = process.env.PORT ?? 2000;
app.use(express.json());
app.use(express.urlencoded({extended:true}));
connectDB();
Routes(app);
// app.get('/',(req,res)=>{
//     res.send('server is ready');
// })
const __dirname = path.resolve();
app.use('/uploads',express.static(path.join(__dirname,'/uploads')));
 app.use(express.static(path.join(__dirname,'/frontend/build')));
 app.get('*',(req,res)=>res.sendFile(path.join(__dirname,'/frontend/build/index.html')))
app.use((err, req, res, next) => {
    res.status(500).send({ message: err.message });
  });

//socket io
const httpServer = http.Server(app);
const io = new Server(httpServer,{cors : { origin : '*' }});
const users = [];

io.on('connection', (socket)=>{

    socket.on('disconnect',()=>{
        const user = users.find(x=>x.socketId === socket.id);
        if(user){
            user.online = false;
            console.log('Offline',user.name);
            const admin = users.find(x=>x.isAdmin && x.online);
            if(admin){
                io.to(admin.socketId).emit('updateUser',user);
            }
        }
    })
    socket.on('onLogin',(user)=>{
        const updatedUser = {
            ...user,
            online:true,
            socketId:socket.id,
            messages:[]
        };
        const existUser = users.find(x=>x._id === updatedUser._id);
        if(existUser){
            existUser.socketId = socket.id;
            existUser.online = true;
        }else{
            users.push(updatedUser);
        }
        const admin = users.find(x=>x.isAdmin && x.online);
        if(admin){
            io.to(admin.socketId).emit('listUsers',users);
        }
    });
    socket.on('onUserSelected',(user)=>{
        const admin = users.find(x=>x.isAdmin && x.online);
        if(admin){
            const existUser = users.find(x=>x._id === user._id);
            io.to(admin.socketId).emit('selectUser' , existUser);
        }
    });

    socket.on('onMessage', (message)=>{
        if(message.isAdmin){
            const user = users.find(x=>x._id === message._id && x.online);
            if(user){
                io.to(`${user.socketId}`).emit('message',message);
                user.messages.push(message);
            }
        }else{
            const admin = users.find(x=>x.isAdmin && x.online);
            if(admin){
                io.to(admin.socketId).emit('message', message);
                const user = users.find((x) => x._id === message._id && x.online);
                user.messages.push(message);
            }else{
                io.to(socket.id).emit('message',{
                    name : 'Admin',
                    body : 'Sorry. I am not online right now'
                })
            }
        }
    })
})
// initSockets(io);
httpServer.listen(PORT,()=>{
    console.log(PORT)
}); 