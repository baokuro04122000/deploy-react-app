import mongoose from 'mongoose';
import User from './userModel.js'
const Schema = mongoose.Schema;
const reviewSchema = new Schema(
    {
        name:{type:String,required:true},
        comment:{type:String,required:true},
        rating:{type:Number,required:true}
    },
    {
        timestamps:true
    }
)
const ProductSchema = new Schema({
    name:{type:String, required:true},
    seller:{type:Schema.Types.ObjectId,ref:'User'},
    image:{type:String, required:true},
    brand: {type:String, required:true},
    category:{type:String, required:true},
    description:{type:String, required: true},
    price: {type:Number, required:true},
    countInStock:{type:Number, required:true},
    rating:{type:Number, required:true},
    numReviews: {type:Number, required:true},
    reviews:[reviewSchema]
},
{
    timestamps:true
}
);
ProductSchema.statics = {
    getProducts(filterCondition,sortOrder,pageSize,page){
        return this.find(filterCondition)
        .populate('seller','seller.name')
        .sort(sortOrder)
        .skip(pageSize*(page-1))
        .limit(pageSize)
        .exec();
    },
    getCategories(){
        return this.find({}).distinct('category').exec();
    },
    getProductById(id){
        return this.findOne({"_id":id}).populate('seller').exec();
    },
    createProduct(product){
        return this.create(product);
    },
    updateProduct(productId,newProduct){
        return this.findOneAndUpdate({"_id":productId},newProduct).exec();
    },
    deleteProductById(productId){
        return this.findOneAndDelete({"_id":productId}).exec() ;
    },
    countFilter(filter){
        return this.countDocuments(filter).exec();
    }
}
const ProductModel = mongoose.model("Products",ProductSchema);
export default ProductModel;