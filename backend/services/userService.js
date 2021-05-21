import UserModel from '../models/userModel.js'; 
import {generateToken} from '../helpers/utils.js';
const signin = (user) => {
    return new Promise(async (resolve,reject)=>{
        const userInfo = await UserModel.findUserByEmail(user.email);
        if(userInfo){
            const checkPass =await userInfo.comparePassword(user.password);
            if(checkPass){
                resolve({
                    _id:userInfo._id,
                    name:userInfo.name,
                    email:userInfo.email,
                    isAdmin:userInfo.isAdmin,
                    isSeller:userInfo.isSeller,
                    seller:{
                        name:userInfo.seller.name
                    },
                    token:generateToken(userInfo)
                })
            }
            reject('Invalid email or password');
        }
        reject('email has not been created');        
    })
}
const register = (newUser) => {
    return new Promise(async (resolve,reject)=>{
        const checkEmail = await UserModel.findUserByEmail(newUser.email);
        if(!checkEmail){
            const userCreated =await UserModel.createUser(newUser);
            if(userCreated){
                resolve(userCreated);
            }
            reject('process is failed');
        }
        reject('email has existed');
    })
}
const getUserById = (userId) =>{
    return new Promise(async (resolve,reject)=>{
        try {
            const user = await UserModel.findUserById(userId);
            resolve(user);
        } catch (error) {
            reject(error.message);
        }
    })
}
const getAllUsers = () => {
    return new Promise(async (resolve , reject)=>{
        try {
            const users = await UserModel.getAllUsers();
            resolve(users);
        } catch (error) {
            reject(error.message)
        }
    })
}
const getTopSellers = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const topSellers = await UserModel.getTopSellers();
            resolve(topSellers);
        } catch (error) {
            reject(error.message);
        }
    })
    
}
const updateProfile = (userId,userChange) => {
    return new Promise(async (resolve,reject)=>{
        try {
            const updatedUser = await UserModel.updateUserById(userId,userChange);
            resolve({
                _id:updatedUser._id,
                name:updatedUser.name,
                email:updatedUser.email,
                isAdmin:updatedUser.isAdmin,
                isSeller:updateUser.isSeller,
                token:generateToken(updatedUser)
            })
        } catch (error) {
            reject(error.message);
        }
    
    })
}
const deleteUser = (userId) => {
    return new Promise(async (resolve,reject)=>{
        try {
            const deletedUser = await UserModel.deleteUser(userId);
            resolve(deletedUser);
        } catch (error) {
            reject(error.message);
        }
    })
}
const updateUser = (userId,newUser) => {
    return new Promise(async (resolve,reject)=>{
        try {
            const updatedUser = await UserModel.updateUser(userId,newUser);
            resolve(updatedUser);
        } catch (error) {
            reject(error.message)
        }
    })
}
export default  {
    signin:signin,
    register:register,
    getUserById:getUserById,
    updateProfile:updateProfile,
    getAllUsers:getAllUsers,
    getTopSellers:getTopSellers,
    deleteUser:deleteUser,
    updateUser:updateUser
}