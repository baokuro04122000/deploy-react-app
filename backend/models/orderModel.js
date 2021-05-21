import mongoose from 'mongoose';
const Schema = mongoose.Schema;

let OrderSchema = new Schema({
    orderItems:[
        {
            name:{type:String , required:true},
            qty:{type:Number , required:true},
            image:{type:String , required:true},
            price:{type:Number , required : true},
            product: {
                type:Schema.Types.ObjectId,
                ref:'Product',
                required:true
            }
        }
    ],
    shippingAddress:{
        fullName:{type:String , required:true},
        address:{type:String , required:true},
        city:{type:String , required:true},
        postalCode:{type:String , required:true},
        country:{type:String , required:true},
        lat:Number,
        lng:Number,
    },
    paymentMethod:{type:String,required:true},
    paymentResult:{
        id:String,
        status:String,
        update_time:String,
        email_address:String,
    }, 
    itemsPrice:{type:Number , required:true},
    shippingPrice:{type:Number , required:true},
    taxPrice:{type:Number , required:true},
    totalPrice:{type:Number , required:true},
    user:{type:Schema.Types.ObjectId, ref:'User' , required:true},
    seller:{type:Schema.Types.ObjectId,ref:'User'},
    isPaid:{type: Boolean, default:false},
    paidAt:{type:Date},
    isDelivered:{type:Boolean, default:false},
    deliveredAt:{type:Date}
},{
    timestamps:true
});
OrderSchema.statics = {
    createOrder(itemInfo){
        return this.create(itemInfo);
    },
    findOrderById(orderId){
        return this.findOne({"_id":orderId}).populate('user','email name').exec();
    },
    updateOrderById(orderId,newOrder){
        return this.findOneAndUpdate({"_id":orderId},newOrder).exec();
    },
    getAllOrderByUserId(userId){
        return this.find({user:userId}).populate("user",'name').sort({"_id":-1}).exec();
    },
    getAllOrders(sellerFilter){
        return this.find(sellerFilter).populate('user.name').exec();
    },
    deleteOrderById(orderId){
        return this.findOneAndDelete({"_id":orderId}).exec();
    },
    updateDeliver(orderId , newOrder){
        return this.findOneAndUpdate({"_id":orderId},newOrder).exec();
    }
}
const Order = mongoose.model('Order',OrderSchema);
export default Order;