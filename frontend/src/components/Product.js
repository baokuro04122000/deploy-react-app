import React from 'react'
import {Link} from 'react-router-dom';
import Rating from './Rating';
export default function Product(props) {
    const { product } = props;
    return (
                <div className="product">
                    <div className="img-container">
                        <img src={product.image} alt={product.name} />
                    </div>
                    <div className="bottom">
                        <Link to={`/product/${product._id}`}>{product.name}</Link>
                        <div class="resize-rating">
                            <Rating rating={product.rating} numReviews = {product.numReviews}/>
                        </div>
                        <div className="price">
                        <span>Price: ${product.price}</span>
                        </div>
                        <div className="seller">
                        <Link to={`/seller/${product.seller._id}`}>
                            <span>{product.seller.seller.name}</span>
                        </Link>
                        </div>
                    </div>
                </div> 
    )
}
