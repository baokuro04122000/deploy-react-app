import React,{useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {useDispatch , useSelector} from 'react-redux';
import {listProducts} from '../actions/productActions';
import {detailsUser} from '../actions/userActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Product from '../components/Product';

export default function SellerScreen(props) {
    const sellerId = props.match.params.id;
    const currentPage = props.match.params.pageNumber;
    const [RPagination,setRPagination] = useState(2);
    const [LPagination,setLPagination] = useState(1);
    const userDetails = useSelector(state=>state.userDetails);
    const {loading , error ,user} = userDetails;
    const productlist = useSelector(state=>state.productList);
    const {
        loading:loadingProducts,
        error:errorProducts,
        products,
        page,
        pages
    }=productlist;
    const dispatch = useDispatch();
    useEffect(()=>{
        dispatch(detailsUser(sellerId));
        dispatch(listProducts({seller:sellerId,pageNumber:currentPage > 1 ? currentPage : 1}));
    },[dispatch,sellerId,currentPage])
    return (
        <div className="row-top">
            <div className="col-1">
                {loading ? (
                    <LoadingBox/>
                ):error ?(
                    <MessageBox variant="danger" children={error}/>
                ):(
                    <ul className="card card-body">
                        <li>
                            <div className="row start">
                                <div className="p-1">
                                    <img className="small" src={user.seller?.logo} alt={user.seller?.name} />
                                </div>
                                <div className="p-1">
                                    <h1>{user.seller?.name}</h1>
                                </div>
                            </div>
                        </li>
                        {/* <li>
                            <a href={`mailto:${user.seller.email}`}>Contact Seller</a>
                        </li> */}
                        <li>{user.seller?.description}</li>
                    </ul>
                )}
            </div>
            <div className="col-3">
                    {loadingProducts ? (
                        <LoadingBox/>
                    ):errorProducts ?(
                        <MessageBox variant="danger" children={errorProducts}/>
                    ):(
                        <>
                            {products.length===0 && <MessageBox>No Product Found</MessageBox>}
                            <div className="row content">
                            <div className="product-layout">
                                {products?.map((product)=>(
                                    <Product key={product._id} product={product}/>
                                ))}

                                </div>
                            </div>
                            <ul className="pagination">
      {pages < 4 ? (
            <>
            {[...Array(pages).keys()].map((x)=>(
                <Link className={x+1 === page ? 'active' : ''}  key={x+1}
             to={`/seller/${sellerId}/pageNumber/${x+1}`} > <span>{x+1}</span>
                </Link>
            ))}
            </>    
      ):(

          <>
            {LPagination === 1 ? (<></>):(
            <span className="icon" onClick={()=>{
                setRPagination(RPagination-1);
                setLPagination(LPagination-1);
            }}>«</span>)} 
           <Link className={LPagination === page ? 'active' : ''}
             to={`/seller/${sellerId}/pageNumber/${LPagination}`} > <span>{LPagination}</span>
            </Link>
            <Link className={RPagination === page ? 'active' : ''}
             to={`/seller/${sellerId}/pageNumber/${RPagination}`} > <span>{RPagination}</span>
            </Link>
            {RPagination === pages ? (<></>  
            ):(
            <>
            <span className="icon" onClick={()=>{
                 setRPagination(RPagination+1)
                setLPagination(LPagination+1)
                return;
            }}>››</span>
            <Link className={pages === page ? 'active' : ''}
                to={`/seller/${sellerId}/pageNumber/${pages}`} ><span className="last" onClick={()=>{
                    setLPagination(pages-1);
                    setRPagination(pages);
                }}>Last »</span></Link>
            </>
            )}
            
          </>
      )}
      </ul>
                        </>
                    )}
            </div>
        </div>
    )
}
