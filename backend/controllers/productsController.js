import {product} from '../services/index.js';
const getProducts = async (req,res)=>{
    const pageSize = 6;
    const page = +req.query.pageNumber || 1;    
    const name=req.query.name || '';
    const seller = req.query.seller || '';
    const category = req.query.category || '';
    const order = req.query.order || '';
    const min = req.query.min && +req.query.min !== 0 ? +req.query.min : 0;
    const max = req.query.max && +req.query.max !== 0 ? +req.query.max : 0;
    const rating = req.query.rating && +req.query.rating !== 0 ? +req.query.rating : 0;

    const sellerFilter = seller ? {seller} : '';
    const nameFilter =  name !== 'all' ? { name : { $regex : name, $options:'i'}} : {};
    const categoryFilter = category ? {category} : {};
    const priceFilter = min && max ? {price:{$gte : min, $lte : max}} : {};
    const ratingFilter = rating ? { rating : { $gte : rating }} : {};
    const sortOrder = order === 'lowest' 
                    ? {price:1}
                    : order==='highest'
                    ?  {price:-1}
                    : order === 'toprated'
                    ? {rating:-1}
                    : {_id:-1};
    try{
        const count = await product.countFilter({
            ...sellerFilter,
            ...nameFilter,
            ...categoryFilter,
            ...priceFilter,
            ...ratingFilter
        })
        const products = 
        await product.getProducts(
            {
            ...sellerFilter,
            ...nameFilter,
            ...categoryFilter,
            ...priceFilter,
            ...ratingFilter
            },
            sortOrder,pageSize,page);
        res.send({products,page,pages:Math.ceil(count/pageSize)});
    }catch(err){
        res.send({error:err})
    }
}
const getCategories = async (req,res) => {
    try {
        const categories = await product.getCategories();
        res.send(categories);
    } catch (error) {
        res.send({message:error});
    }
}
const getProductById = async (req,res)=>{
    let productId = req.params.id;
    try{
        const item = await product.getProductById(productId);
        res.send(item)
    }catch(err){
        console.log(err)
        res.send({error:err})
    }
}
const createProduct =async (req,res) => {
    let productSent={
        name:req.body.name,
        seller:req.user._id,
        image:req.body.image,
        price:req.body.price,
        category:req.body.category,
        brand:req.body.brand,
        countInStock:req.body.countInStock,
        rating:0,
        numReviews:0,
        description:req.body.description
    };
    try {
        const createdProduct = await product.createProduct(productSent);
        res.send({message:"product created",product:createdProduct})
    } catch (error) {
         res.status(401).send({message:error})   
    }
}
const updateProduct =async (req,res) => {
    const productId = req.params.id;
    const newProduct = {
        name:req.body.name,
        price:req.body.price,
        image:req.body.image,
        category:req.body.category,
        countInStock:req.body.countInStock,
        brand:req.body.brand,
        description:req.body.description
    }
    try {
        const updatedProduct = await product.updateProduct(productId,newProduct);
        res.send(updatedProduct);
    } catch (error) {
        res.status(401).send({message:error})
    }
}
const deleteProduct = async (req,res)=>{
    try {
        const deletedProduct = await product.deleteProduct(req.params.id);
        res.send((deletedProduct)); 
    } catch (error) {
        res.status(401).send({message:error})
    }
}
const createReviews = async (req,res)=>{
    const productId = req.params.id;
    const currentProduct =await product.getProductById(productId);
    try {
        if(currentProduct.reviews.find(x=>x.name===req.user.name)){
            return res.status(400).send({message:'You already submitted a review'});
        }
        const reviews = {
            name:req.user.name,
            rating:+req.body.rating,
            comment:req.body.comment

        };
        currentProduct.reviews.push(reviews);
        currentProduct.numReviews = currentProduct.reviews.length;
        currentProduct.rating =
            currentProduct.reviews.reduce((a, c) => c.rating + a, 0) / currentProduct.reviews.length;
        const updateProduct = await product.updateProduct(productId,currentProduct);
        
        res.status(201).send({
            message:'Review Created',
            review:updateProduct.reviews[updateProduct.reviews.length - 1]
        })
    } catch (error) {
        console.log(error);
        res.status(404).send({message:error})
    }
        
    
}
export default {
    getProducts:getProducts,
    getCategories:getCategories,
    getProductById:getProductById,
    createProduct:createProduct,
    updateProduct:updateProduct,
    deleteProduct:deleteProduct,
    createReviews:createReviews
}