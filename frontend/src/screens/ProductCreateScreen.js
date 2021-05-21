import React,{useEffect , useState} from 'react'
import axios from 'axios';
import {useDispatch, useSelector} from 'react-redux';
import {createProduct} from '../actions/productActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
export default function ProductCreateScreen(props) {
    const userSignin = useSelector(state=>state.userSignin);
    const {userInfo} = userSignin;
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState('please choose your a favorite picture');
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState('');
    const [brand, setBrand] = useState('');
    const [description, setDescription] = useState('');
    const [loadingUpload , setLoadingUpload] = useState(false);
    const [errorUpload , setErrorUpload] = useState('');
    const  productCreate = useSelector(state=>state.productCreate);
    const {loading , success , error} = productCreate;
    const dispatch = useDispatch();
    useEffect(()=>{
        if(!userInfo?.isAdmin && !userInfo?.isSeller){
            props.history.push('/');
        }
    },[props.history,userInfo])
    const submitHandler = (e)=>{
        e.preventDefault();
        dispatch(createProduct({
            name,
            price,
            image,
            category,
            brand,
            countInStock,
            description
        }))
        props.history.push('/productlist/seller');
    }
    // const setFormData = (files)=>{
    //     return new Promise((resolve, reject) => {
    //         let bodyFormData = new FormData();
    //         if(files){
    //             for (let i = 0; i < files.length; i++) {
    //                 bodyFormData.append('galleryImage',`images[${i}]`, files[i]);
    //             }
    //             setTimeout(()=>resolve(bodyFormData),500)
    //         }else{
    //             reject('please want to choose pictures upload');
    //         }
    //     })
    // }
    // const uploadFilesHandler = async (e)=>{
    //     let files = e.target.files; 
    //     setLoadingUpload(true);
    //     try {
    //         const bodyFormData = await setFormData(files);
    //         const {data} = await axios.post('/api/multiple/uploads/s3',bodyFormData,{
    //             headers:{
    //                 'Content-Type':'multipart/form-data',
    //                 Authorization:`BEARER ${userInfo.token}`
    //             }
    //         })
    //         setImage(data);
    //         setLoadingUpload(false);
    //     } catch (error) {
    //         setErrorUpload(error.message);
    //     }
    // }
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
            setImage(`${data}`);
            setLoadingUpload(false);
        } catch (error) {
            setErrorUpload(error.message);
            setErrorUpload(false);
        }
    }
    return (        
        <div>
            {userInfo?.isAdmin || userInfo?.isSeller ? (
                <form className="form" onSubmit={submitHandler}>
                <div>
                    <h1>Create Product</h1>
                </div>
                {success && <MessageBox variant="success" children="Created product successfully"></MessageBox>}
                {loading && <LoadingBox/>}
                {error && <MessageBox variant="danger" children={error} />}
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
                            <label htmlFor="imageFile">Product Image</label>
                            <input 
                                type="file"
                                id="imageFile"
                                label="Choose Image"
                                onChange={uploadFileHandler}
                            />
                            {loadingUpload && <LoadingBox/>}
                            {errorUpload && <MessageBox variant="danger" children={errorUpload} />}
                        </div>
                        {/* <div>
                            <label htmlFor="imageFile">Support Images</label>
                            <input 
                                type="file"
                                id="imageFiles"
                                label="Choose Images"
                                onChange={uploadFilesHandler}
                                multiple
                            />
                            
                        </div> */}
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
                            <input type="submit" className="primary" value="Create"/>
                        </div>
                    </>
                )}
            </form>
            ):(
                <h1>this page is only for admin</h1>
            )}
            
        </div>
    )
}
