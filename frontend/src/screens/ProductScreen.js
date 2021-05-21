import React from 'react'
import Rating from '../components/Rating';
import {NavLink,Link, useParams} from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import {useDispatch,useSelector} from 'react-redux';
import {detailsProduct, createReview} from '../actions/productActions';
import {PRODUCT_REVIEW_CREATE_RESET} from '../constants/productConstants';
export default function ProductScreen(props) {
    const {id} = useParams();
    const [qty,setQty] = React.useState(1);
    const dispatch = useDispatch();
    const productDetails = useSelector(state=>state.productDetails);
    const {error,loading,product} = productDetails;
    const userSignin = useSelector(state=>state.userSignin);
    const {userInfo} = userSignin;
    const productReviewCreate = useSelector(state=>state.productReviewCreate);
    const {
        loading:loadingReviewCreate,
        error:errorReviewCreate,
        success:successReviewCreate
    }=productReviewCreate;

    const [rating,setRating] = React.useState(0);
    const [comment,setComment] = React.useState('');
    React.useEffect(()=>{
        if(successReviewCreate){
            window.alert('Review Submitted Successfully');
            setRating('');
            setComment('');
            dispatch({type:PRODUCT_REVIEW_CREATE_RESET})
        }
        dispatch(detailsProduct(id));
    },[dispatch,id,successReviewCreate])
    const addToCarHandler= () => props.history.push(`/cart/${id}?qty=${qty}`);
    const submitHandler = (e) => {
        e.preventDefault();
        if(comment && rating){
            dispatch(createReview(id,{rating,comment,name:userInfo.name}))
        }else{
            alert('Please enter comment and rating');
        }
    }
    return (
<div>
        {loading ? (
            <LoadingBox/>) : error ? (
                <MessageBox variant="danger">{error}</MessageBox>
            ):(
    <div className="row top">
        <div className="card-wrapper">
  
        <div className="card">
    {/* card left */}
    <div className="product-imgs">
      <div className="img-display">
        <div className="img-showcase">
          <img src={product.image} alt={product.name} />
        </div>
      </div>
    </div>
    {/* card right */}
    <div className="product-content">
      <h2 className="product-title">{product.name}</h2>
      <NavLink to={`/seller/${product.seller?._id}`} ><p className="product-list">visit {` ${product.seller?.name}`}</p></NavLink>
      <div className="product-rating">
        <Rating rating={product.rating} numReviews={product.numReviews}/>
      </div>
      <div className="product-price">
        <p className="new-price">Price: <span>${product.price}</span></p>
      </div>
      <div className="product-detail">
        <h2>About this item: </h2>
        <p>{product.description}</p>
        <ul>
          <li>Available: <span>{product.countInStock  > 0 ? 'In Stock':'Not Availible'}</span></li>
          <li>Category: <span>{product.category}</span></li>
          <li>Shipping Area: <span>All over the world</span></li>
          <li>Shipping Fee: <span>Free</span></li>
        </ul>
      </div>
      <div className="purchase-info">
        {product.countInStock > 0 ? (
                <input type="number" min={1} defaultValue={1} max={product.countInStock} onChange={(e)=>setQty(e.target.value)} />
            ):(<p>Our produtcs will availible soon !</p>
        )}
        {product.countInStock > 0 ?
        (<button type="button" className="btn" onClick={addToCarHandler}>
          Add to Cart <i className="fas fa-shopping-cart" />
        </button>):(
            <button type="button" className="btn" onClick={addToCarHandler} disabled>
          Add to Cart <i className="fas fa-shopping-cart" />
        </button>
        )

        }
        
      </div>
      <div className="social-links">
        <p>Share At: </p>
        <Link to="#">
          <i className="fab fa-facebook-f" />
        </Link>
        <Link to="#">
          <i className="fab fa-twitter" />
        </Link>
        <Link to="#">
          <i className="fab fa-instagram" />
        </Link>
        <Link to="#">
          <i className="fab fa-whatsapp" />
        </Link>
        <Link to="#">
          <i className="fab fa-pinterest" />
        </Link>
      </div>
    </div>
  </div>
                
                <div>
                    <h2 id="reviews">Reviews</h2>
                    {product.reviews?.length === 0 && (
                        <MessageBox>There is no review</MessageBox>
                    )}
                    <ul>
                        {product.reviews?.map((review)=>(
                            <li key={review._id}>
                                <strong>{review.name}</strong>
                                <Rating rating={review.rating} caption=" " />
                                <p>{review.createdAt.substring(0 , 10)}</p>
                                <p>{review.comment}</p>
                            </li>
                        ))}
                        <li>
                            {userInfo ? (
                                <form className="form" onSubmit={submitHandler}>
                                    <div>
                                        <h2>Write a customer review</h2>
                                    </div>
                                    <div>
                                        <label htmlFor="rating">Rating</label>
                                        <select
                                            id="rating"
                                            value={rating}
                                            onChange={(e)=>setRating(e.target.value)}>
                                            <option value="">Select...</option>
                                            <option value="1">1- Poor</option>
                                            <option value="2">2- Fair</option>
                                            <option value="3">3- Good</option>
                                            <option value="4">4- Very Good</option>
                                            <option value="5">5- Excelent</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="comment">Comment</label>
                                        <textarea
                                            id="comment"
                                            value={comment}
                                            onChange={(e)=>setComment(e.target.value)}>
                                        </textarea>
                                    </div>
                                    <div>
                                        <label/>
                                        <button className="primary" type="submit">
                                            Submit
                                        </button>
                                    </div>
                                    <div>
                                        {loadingReviewCreate && <LoadingBox/>}
                                        {errorReviewCreate && (
                                            <MessageBox variant="danger" children={errorReviewCreate}/>
                                        )}
                                    </div>
                                </form>
                            ):(
                                <MessageBox>
                                    Please <Link to="/signin">Sign In</Link> to write a review
                                </MessageBox>
                            )}
                        </li>
                    </ul>
                </div>
        </div>
    </div> 
        )}
</div>
)}