export const pushSocketIdToArray = (clients, userId, socketId) => {
    if(clients[userId]){
        clients[userId].push(socketId);
    }else{
        clients[userId]=[socketId];      
    }
    return clients;
}


export const emitNotifyToArray = (clients, userId, io, eventName, data) => {
    if(clients[userId]){
        clients[userId].forEach(socketId =>{
            io.sockets.connected[socketId].emit(eventName, data);
        })
    }
}
export const removeSocketIdFromArray = (clients, userId, socket) => {
    if(clients[userId]){
        clients[userId] = clients[userId].filter(socketId => socketId !== socket.id)
        if(clients[userId].length){
            delete clients[userId]
        }
    }
    return clients;
}