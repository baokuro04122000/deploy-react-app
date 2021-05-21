import React ,{useState , useEffect} from 'react'
import axios from 'axios';
import {useDispatch , useSelector} from 'react-redux';
import {detailsProduct , updateProduct} from '../actions/productActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants';

export default function ProductEditScreen(props) {
    const productId = props.match.params.id;
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState('');
    const [brand, setBrand] = useState('');
    const [description, setDescription] = useState('');

    const productDetails = useSelector(state=>state.productDetails);
    const {loading,error,product} = productDetails;
    
    const productUpdate = useSelector(state=>state.productUpdate);
    const {
        loading:loadingUpdate ,
        success:successUpdate ,
        error:errorUpdate 
    }=productUpdate;
    
    const dispatch = useDispatch();
    useEffect(()=>{
        if(successUpdate){
            dispatch({type:PRODUCT_UPDATE_RESET})
            props.history.push('/productlist');
        }
        if(!product || product._id !== productId){
            dispatch(detailsProduct(productId));
        }else{
            setName(product.name);
            setPrice(product.price);
            setImage(product.image);
            setCategory(product.category);
            setCountInStock(product.countInStock);
            setBrand(product.brand);
            setDescription(product.description);
        }
    },[product,dispatch,productId,successUpdate,props.history])

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(updateProduct({
            _id:productId,
            name,
            price,
            image,
            category,
            brand,
            countInStock,
            description
        }))
    }
    const [loadingUpload , setLoadingUpload] = useState(false);
    const [errorUpload , setErrorUpload] = useState('');

    const userSignin = useSelector(state=>state.userSignin);
    const {userInfo} = userSignin;
    const uploadFileHandler = async (e)=>{
        const file = e.target.files[0];
        const bodyFormData = new FormData();
        bodyFormData.append('image',file);
        setLoadingUpload(true);
        try {
            const {data} = await axios.post('/api/uploads/s3',bodyFormData,{
                headers:{
                    'Content-Type':'multipart/form-data',
                    Authorization:`BEARER ${userInfo.token}`
                }
            })
            setImage(data);
            setLoadingUpload(false);
        } catch (error) {
            setErrorUpload(error.message);
            setErrorUpload(false);
        }
    }
    return (
        <div>
            <form className="form" onSubmit={submitHandler}>
                <div>
                    <h1>Edit Product</h1>
                </div>
                {loadingUpdate && <LoadingBox/>}
                {errorUpdate && <MessageBox variant="danger" children={errorUpdate} />}
                {loading ? (
                    <LoadingBox/>
                ):error ? (
                    <MessageBox dariant="danger" children={error} />
                ):(
                    <>
                        <div>
                            <label htmlFor="name">Name</label>
                            <input 
                                type="text"
                                id="name"
                                placeholder="Enter Name"
                                value={name}
                                onChange={(e)=>setName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="price">Price</label>
                            <input 
                                type="text"
                                id="price"
                                placeholder="Enter Price"
                                value={price}
                                onChange={(e)=>setPrice(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="image">Image</label>
                            <input 
                                type="text"
                                id="image"
                                placeholder="Enter image"
                                value={image}
                                onChange={(e)=>setImage(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="imageFile">Image File</label>
                            <input 
                                type="file"
                                id="imageFile"
                                label="Choose Image"
                                onChange={uploadFileHandler}
                            />
                            {loadingUpload && <LoadingBox/>}
                            {errorUpload && <MessageBox variant="danger" children={errorUpload} />}
                        </div>
                        <div>
                            <label htmlFor="category">category</label>
                            <input 
                                type="text"
                                id="category"
                                placeholder="Enter Category"
                                value={category}
                                onChange={(e)=>setCategory(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="brand">Brand</label>
                            <input 
                                type="text"
                                id="brand"
                                placeholder="Enter Brand"
                                value={brand}
                                onChange={(e)=>setBrand(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="countInStock">Count In Stock</label>
                            <input 
                                type="text"
                                id="countInStock"
                                placeholder="Enter count in stock"
                                value={countInStock}
                                onChange={(e)=>setCountInStock(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="description">Description</label>
                            <textarea 
                                type="text"
                                id="description"
                                placeholder="Enter Description"
                                value={description}
                                onChange={(e)=>setDescription(e.target.value)}
                            >
                            </textarea>
                        </div>
                        <div>
                            <label/>
                            <input type="submit" className="primary" value="Update"/>
                        </div>
                    </>
                )}
            </form>
        </div>
    )
}
