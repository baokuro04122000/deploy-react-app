import React from 'react'
import {useDispatch , useSelector} from 'react-redux';
import {Link , useParams} from 'react-router-dom';
import {listProducts ,deleteProduct} from '../actions/productActions';
import {PRODUCT_CREATE_RESET , PRODUCT_DELETE_RESET} from '../constants/productConstants';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
export default function ProductListScreen(props) {
    const { pageNumber = 1} = useParams(); 
    const sellerMode = props.match.path.indexOf('/seller') >= 0;
    const productList = useSelector(state=>state.productList);

    const {loading , error , products, page, pages} = productList;
    const productCreate = useSelector(state => state.productCreate);
    const {loading:loadingCreate , success:successCreate , error:errorCreate , product:createdProduct} = productCreate;
    const productDelete = useSelector(state=>state.productDelete);
    const {loading:loadingDelete , success:successDelete , error:errorDelete} = productDelete;
    const userSignin = useSelector(state=>state.userSignin);
    const {userInfo} = userSignin;
    const dispatch = useDispatch();
    React.useEffect(()=>{
        if(successCreate){
            dispatch({type:PRODUCT_CREATE_RESET});
            props.history.push(`/productList`);
        }
        if(successDelete){
            dispatch({type:PRODUCT_DELETE_RESET});
        }
        dispatch(listProducts({seller:sellerMode ? userInfo._id : '',pageNumber}));
        if(!userInfo?.isSeller){
            props.history.push('/signin');
        }
    },[dispatch,props.history,successCreate,createdProduct,
        successDelete,sellerMode,userInfo,pageNumber])
    const deleteHandler = (productId) => {
        if(window.confirm('Are you sure to delete?')){
            dispatch(deleteProduct(productId));
        }
    }
    const createHandler = () => {
        props.history.push('/createproduct');
    }
    return (
        <div>
            <div className="row">
                <h1>Products</h1>
                <button
                    type="button"
                    className="primary"
                    onClick={createHandler}>
                    Create Product
                </button>
            </div>
            {loadingDelete && <LoadingBox/>}
            {errorDelete && <MessageBox dariant="danger" children={errorDelete}/>}
            {loadingCreate && <LoadingBox/>}
            {errorCreate && <MessageBox dariant="danger" children={errorCreate}/>}
            {loading ? (
                <LoadingBox/>
            ): error ? (
                <MessageBox variant="danger" children={error}/>
            ):(
            <>
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>NAME</th>
                            <th>PRICE</th>
                            <th>CATEGORY</th>
                            <th>BRAND</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product)=>(
                            <tr key={product._id}>
                                <td>{product._id}</td>
                                <td>{product.name}</td>
                                <td>{product.price}</td>
                                <td>{product.category}</td>
                                <td>{product.brand}</td>
                                <td>
                                    <button 
                                        type="button"
                                        className="small"
                                        onClick={()=>{props.history.push(`/product/edit/${product._id}`)}}>
                                        Edit
                                    </button>
                                    <button
                                        type="button"
                                        className="small"
                                        onClick={()=>{deleteHandler(product._id)}}>
                                        delete
                                    </button>
                                </td>                            
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="row center pagination">
                    {[...Array(pages).keys()].map(x=>(
                        <Link
                            className={x + 1 === page ? 'active' : ''}
                            key={x+1}
                            to={`/productlist/pageNumber/${x+1}`}>
                            {x+1}
                        </Link>
                    ))}
                </div>
            </>
            )}
        </div>
    )
}
