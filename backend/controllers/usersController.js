import {user} from '../services/index.js';
import bcrypt from 'bcrypt';
import {generateToken} from '../helpers/utils.js'
const signin =async (req,res) => {
    try{
        const checkout = await user.signin({email:req.body.email,password:req.body.password});
        res.send(checkout);
    }catch(err){
        res.status(401).send({message: err})
    }
}
const register = async (req,res) => {
    const newUser = {
        name:req.body.name,
        email:req.body.email,
        password:bcrypt.hashSync(req.body.password,8)
    }
    try{
        const createUser = await user.register(newUser); 
        res.send({
            _id:createUser._id,
            name:createUser.name,
            email:createUser.email,
            isAdmin:createUser.isAdmin,
            token:generateToken(createUser)
        });
    }catch(err){
        res.status(401).send({message:err});
    }
}
const getUserById =async (req,res) => {
    try{
        const getUser = await user.getUserById(req.params.id);
        res.send(getUser);
    }catch(error){
        res.status(401).send({message:error})
    }
}
const getAllUsers =async (req,res)=>{
    try {
        const users = await user.getAllUsers();
        res.send(users);
    } catch (error) {
        res.status(401).send({message:error})
    }
}
const getTopSellers = async (req,res) => {
    try {
        const topSellers = await user.getTopSellers();
        res.send(topSellers);
    } catch (error) {
        console.log(error);
        res.status(401).send({message:error});
    }
}
const updateProfile=async (req,res) => {
    const userInfo = await user.getUserById(req.user._id);
    if(userInfo){
        const sellerName = req.body.sellerName || userInfo.seller.name;
        const sellerLogo = req.body.sellerLogo ||  userInfo.seller.logo;
        const sellerDescription = req.body.sellerDescription || userInfo.seller.description;
        let userChange ={
            name:req.body.name,
            email:req.body.email,
            password:req.body.password ? bcrypt.hashSync(req.body.password,8) : userInfo.password,
            seller:{
                name:sellerName,
                logo:sellerLogo,
                description:sellerDescription
            }
        }
        try {
            const updatedUser = await user.updateProfile(req.user._id,userChange);
            res.send(updatedUser);
        } catch (error) {
            res.status(401).send({message:error});
        }
    }
}
const deleteUser = async (req,res) => {
    const userId = req.params.id;
    try {
        const deletedUser = await user.deleteUser(userId);
        res.send(deletedUser);
    } catch (error) {
        res.status(401).send({message:error})
    }
}
const updateUser =async (req,res) => {
    const userId = req.params.id;
    const oldUser = await user.getUserById(userId);
    if(oldUser){
        const newUser = {
            name:req.body.name ?? oldUser.name,
            email:req.body.email ?? oldUser.email,
            isSeller:req.body.isSeller ?? oldUser.isSeller,
            isAdmin:req.body.isAdmin ?? oldUser.isAdmin
        }
        console.log(newUser);
        try {
            const updatedUser = await user.updateUser(userId,newUser);
            res.send(updatedUser);
        } catch (error) {
            res.status(401).send({message:error});
        }
    }
}
export default {
    signin:signin,
    register:register,
    getUserById:getUserById,
    updateProfile:updateProfile,
    getAllUsers:getAllUsers,
    getTopSellers:getTopSellers,
    deleteUser:deleteUser,
    updateUser:updateUser
}