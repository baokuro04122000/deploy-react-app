import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
const Schema = mongoose.Schema;

export const UserSchema = new Schema({
    name:{type:String, required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    isAdmin : {type:Boolean , default: false , required:true},
    isSeller:{type:Boolean,default:false,required:true},
    seller:{
        name:String,
        logo:String,
        description:String,
        rating:Number
    }
    },
    {
        timestamps:true,
    }
);
UserSchema.statics = {
    createUser(item){
        return this.create(item);
    },
    createData(item){
        return this.insertMany(item).exec();
    },
    findUserByEmail(userEmail){
        return this.findOne({"email":userEmail}).exec();
    },
    findUserById(userId){
        return this.findOne({"_id":userId},{seller:1,_id:1,email:1,name:1,isAdmin:1,isSeller:1}).exec();
    },
    getAllUsers(){
        return this.find({}).exec();
    },
    getTopSellers(){
        return this.find({"isSeller":true},{_id:1,seller:1,isSeller:1}).sort({"seller.rating":-1}).exec();
    },
    updateUserById(userId,userChange){
        return this.findOneAndUpdate({"_id":userId},userChange).exec();
    },
    deleteUser(userId){
        return this.findOneAndDelete({"_id":userId}).exec();
    },
    updateUser(userId,newUser){
        return this.findOneAndUpdate({"_id":userId},newUser).exec();
    }
}
UserSchema.methods = {
    comparePassword(password){
        //return a promise has result is true or false
        return bcrypt.compare(password,this.password);
    }

}
const User = mongoose.model('User',UserSchema);
export default User;