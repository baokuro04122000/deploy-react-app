import ProductModel from '../models/productModel.js';
const getProducts = (filterCondition,sortOrder,pageSize,page) => {
    return new Promise(async (resolve,reject)=>{
        try {
            const products = await ProductModel.getProducts(filterCondition,sortOrder,pageSize,page);
            resolve(products)
        } catch (error) {
            reject(error.message);
        }
    })
}
const getCategories = () => {
    return new Promise(async (resolve, reject) => {
      try {
            const categories = await ProductModel.getCategories();
            resolve(categories);    
      } catch (error){
          reject(error.message)
      }  
    })
}
const countFilter = (filter) => {
    return new Promise(async (resolve, reject) => {
        try {
            const count = await ProductModel.countFilter(filter);
            resolve(count); 
        } catch (error) {
            reject(error.message)
        }
    })
    
}
const getProductById = (productId) => {
    return new Promise(async (resolve,reject) => {
        try{
            const product = await ProductModel.getProductById(productId);
            resolve(product);
        }catch(error){
            reject(error.message);;
        }
    })
}
const updateProduct = (productId,newProduct) =>{
    return new Promise(async (resolve,reject)=>{
        try {
            const updatedProduct = await ProductModel.updateProduct(productId,newProduct);
            resolve(updatedProduct);
        } catch (error) {
            reject(error.message)
        }
    })
}
const deleteProduct = (productId) => {
    return new Promise(async (resolve,reject)=>{
        try {
            const deletedProduct = await ProductModel.deleteProductById(productId);
            resolve(deletedProduct);
        } catch (error) {
            reject(error.message)
        }
    })
}
const createProduct= (product)=>{
    return new Promise(async (resolve,reject)=>{
        try {
            const createdProduct = await ProductModel.createProduct(product);
            resolve(createdProduct);
        } catch (error) {
            reject(error.message)
        }
    });
}
export default {
    getProducts:getProducts,
    getCategories:getCategories,
    getProductById:getProductById,
    createProduct:createProduct,
    updateProduct:updateProduct,
    deleteProduct:deleteProduct,
    countFilter:countFilter
}