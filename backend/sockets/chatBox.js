import {pushSocketIdToArray, removeSocketIdFromArray} from '../helpers/socketHepler.js'
const chatBoxClients = (io) => {
    let clients = {};
    let currentUser = {};
    io.on('connect',(socket)=>{
        socket.on('onLogin',(userInfo)=>{
            currentUser={...userInfo}
            clients= pushSocketIdToArray(clients, userInfo._id,socket.id);
            
        })
        

        socket.on('disconnect',()=>{
            removeSocketIdFromArray(clients,currentUser._id,socket.id);
        })
    }) 
}
export default chatBoxClients;