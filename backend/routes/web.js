import express from 'express';
import {product , user ,order ,upload} from '../controllers/index.js';
import {isAuth ,isAdmin ,isSeller} from '../helpers/utils.js';
const router = express.Router();

let initRoutes = (app) => {
    router.get('/api/products',product.getProducts);
    router.get('/api/products/:id',product.getProductById);
    router.put('/api/product/update/:id',isAuth,isSeller,product.updateProduct)
    router.delete('/api/product/delete/:id',isAuth,product.deleteProduct);
    router.post('/api/product/create',isAuth,product.createProduct);
    router.post('/api/product/:id/reviews',isAuth,product.createReviews);
    router.get('/api/categories',product.getCategories);
    
    router.post('/api/users/signin',user.signin);
    router.post('/api/users/register',user.register);
    router.get('/api/user/:id',user.getUserById);
    router.put('/api/users/profile',isAuth,user.updateProfile);
    router.get('/api/users/getAllUsers',isAuth,isAdmin,user.getAllUsers);
    router.delete('/api/user/delete/:id',isAuth,isAdmin,user.deleteUser);
    router.put('/api/user/edit/:id',isAuth,user.updateUser);
    router.get('/api/users/topSellers',user.getTopSellers);
    

    router.post('/api/orders',isAuth,order.createOrder);
    router.get('/api/orders/:id',isAuth,order.getOrderById);
    router.get('/api/order/getAllOrders',isAuth,isSeller,order.getAllOrders);
    router.delete('/api/order/delete/:id',isAuth,isSeller,order.deleteOrder);
    router.put('/api/order/deliver/:id',order.updateDeliver);
    router.get('/api/config/paypal',(req,res)=>{
        res.send(process.env.PAYPAL_CLIENT_ID || 'sb');
    });
    router.put('/api/orders/:id/pay',isAuth,order.orderPayment);
    router.get('/api/order/mine',isAuth,order.getMineOrder);


    //upload image by multer
    //router.post('/api/uploads',isAuth,config.upload.single('image'),config.uploadImage);
    router.post('/api/uploads/s3',isAuth,upload.uploadS3.single('image'),upload.uploadImage);
    router.post('/api/multiple/uploads/s3',isAuth,upload.uploadS3.array('galleryImage',4),upload.uploadImages);
    router.get('/api/config/google',(req,res)=>{
        res.send(process.env.GOOGLE_API_KEY || 'googleKey');
    })
    return app.use('/',router);
}
export default initRoutes;