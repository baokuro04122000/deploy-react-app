import {order} from '../services/index.js';
import {sendMail, payOrderEmailTemplate} from '../helpers/mailer.js';
const createOrder =async (req,res) =>{
    if(req.body.orderItems.length === 0){
        res.status(400).send({message:'Cart is empty'});
    }else{
        const orderInfo = {
            seller:req.body.orderItems[0].seller,
            orderItems:req.body.orderItems,
            shippingAddress:req.body.shippingAddress,
            paymentMethod:req.body.paymentMethod,
            itemsPrice:req.body.itemsPrice,
            shippingPrice:req.body.shippingPrice,
            taxPrice:req.body.taxPrice,
            totalPrice:req.body.totalPrice,
            user:req.user._id
        }
        try{
            const createdOrder = await order.createOrder(orderInfo);
            res.status(201).send({message:'New Order Created',order:createdOrder})
        }catch(err){
            res.status(401).send({message:err});
        }
    }
}
const getOrderById=async ( req , res )=>{
    try{
      const getOrder =await order.getOrderById(req.params.id);
      res.status(201).send(getOrder);  
    }catch(error){
        res.status(401).send({message:error});
    }
}
const getAllOrders = async (req,res)=>{
    const seller = req.query.seller+'' || '';
    try {
        const orders =await order.getAllOrders({seller:seller?seller:''});
        res.send(orders);
    } catch (error) {
        console.log(error);
        res.status(401).send({message:error});
    }
}
const orderPayment = async (req,res) => {
    const oldOrder = {
        id:req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address:req.body.email_address
    }
    try{
        const currentOrder = await order.getOrderById(req.body.id);
        const updatedOrder = await order.orderPayment(oldOrder);
        // mailgun()
        //     .messages()
        //     .send({
        //         from:'Amazona <dinhbao-ecommerce-app.com>',
        //         to:`${currentOrder.user.name} <${currentOrder.user.email}>`,
        //         subject: `New order ${currentOrder.orderItems[0].name}`,
        //         html:payOrderEmailTemplate(currentOrder),

        //     },
        //     (error, body)=>{
        //         if(error){
        //             console.log(error)
        //         }else{
        //             console.log(body);
        //         }
        //     })
        let to=`${currentOrder.user.email}`;
        let subject = `New order ${currentOrder.orderItems[0].name}`;
        let template = payOrderEmailTemplate(currentOrder);
        await sendMail(to,subject,template);
        res.send({message:'Order Paid',order:updatedOrder}); 
    }catch(err){

        res.status(401).send({message:err})
    }
}
const getMineOrder =async (req,res)=>{
    try{
        const orders =await order.getMineOrder(req.user._id);
        res.send(orders);
    }catch(err){
        console.log(error)
        res.status(401).send({message:err})
    }
}
const deleteOrder =async (req,res) => {
    const orderId = req.params.id;
    try {
        const deletedOrder = await order.deleteOrder(orderId);
        res.send(deletedOrder)
    } catch (error) {
        console.log(error)
        res.status(401).send({message:error})
    }
}
const updateDeliver =async (req,res) => {
    const newOrder = {
        isDelivered:true,
        deliveredAt:Date.now()
    }
    try {
        const currentOrder = await order.getOrderById(req.params.id);
        const updatedDeliver = await order.updateDeliver(req.params.id,newOrder);
        if(currentOrder){
            let to=`${currentOrder.user.email}`;
            let subject = `New order ${currentOrder.orderItems[0].name}`;
            let template = payOrderEmailTemplate(currentOrder);
            await sendMail(to,subject,template);
        }
        res.send(updatedDeliver);
    } catch (error) {
        console.log(error);
        res.status(401).send({message:error})
    }
}
export default {
    createOrder:createOrder,
    getOrderById:getOrderById,
    orderPayment:orderPayment,
    getMineOrder:getMineOrder,
    getAllOrders:getAllOrders,
    deleteOrder:deleteOrder,
    updateDeliver:updateDeliver
}