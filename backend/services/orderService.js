import OrderModel from '../models/orderModel.js'

const createOrder = (orderInfo) => {
    return new Promise(async (resolve,reject)=>{
        try{
            const createdOrder = await OrderModel.createOrder(orderInfo);
            resolve(createdOrder);
        }catch(error){
            reject(error.message);
        }
    })
}
const getOrderById=(orderId)=>{
    return new Promise(async (resolve,reject)=>{
        try {
            const order =await OrderModel.findOrderById(orderId);
            resolve(order);
        } catch (error) {
            reject(error.message);
        }
        
    })
}
const orderPayment=(oldOrder)=>{
    return new Promise(async (resolve,reject)=>{
        try{
            const order =await OrderModel.getOrderById(oldOrder.id);
            order.isPaid = true;
            order.paidAt=Date.now();
            order.paymentResult={
                id:oldOrder.id,
                status:oldOrder.status,
                update_time:oldOrder.update_time,
                email_address:oldOrder.email_address
            }
            const updateOrder = await OrderModel.updateOrderById(oldOrder.id,order);
            resolve(updateOrder);
        }catch(err){
            reject(err.message);
        }
    })
}
const getMineOrder= (userId)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            const orders =await OrderModel.getAllOrderByUserId(userId);
            resolve(orders);
        }catch(err){
            reject(err.message)
        }
    })
}
const getAllOrders = (sellerFilter) =>{
    return new Promise(async (resolve,reject)=>{
        try {
            const orders = await OrderModel.getAllOrders(sellerFilter);
            resolve(orders);
        } catch (error) {
            console.log(error);
            reject(error.message);
        }
    })
}
const deleteOrder = (orderId) => {
    return new Promise(async (resolve,reject)=>{
        try {
            const deletedOrder = await OrderModel.deleteOrderById(orderId);
            resolve(deletedOrder);
        } catch (error) {
            reject(error.message)
        }
    })
}
const updateDeliver = (orderId,newOrder) => {
    return new Promise(async (resolve , reject)=>{
        try {
        const updatedDeliver = await OrderModel.updateDeliver(orderId,newOrder);
            resolve(updatedDeliver);
        } catch (error) {
            reject(error.message);
        }
    })
}
export default {
    createOrder:createOrder,
    getOrderById:getOrderById,
    orderPayment:orderPayment,
    getMineOrder:getMineOrder,
    getAllOrders:getAllOrders,
    deleteOrder:deleteOrder,
    updateDeliver,updateDeliver   
}