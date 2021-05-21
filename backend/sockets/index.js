import chatBoxClients from './chatBox.js';
import chatBoxAdmin from './supportScreen.js';
const initSockets=(io)=>{
   chatBoxClients(io);
   chatBoxAdmin(io);
}
export default initSockets;