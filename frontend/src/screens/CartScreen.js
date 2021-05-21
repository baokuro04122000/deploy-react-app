import React from 'react'
import {useDispatch , useSelector} from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import {addToCart ,removeFromCart} from '../actions/cartActions'
import MessageBox from '../components/MessageBox';
export default function CartScreen(props) {
    const productId = props.match.params.id;
    const qty = props.location.search
    ? Number(props.location.search.split('=')[1])
    : 1;
    const dispatch = useDispatch();
    const cart = useSelector(state=>state.cart);
    const {cartItems , error} = cart;
    React.useEffect(()=>{
       if(productId){
           dispatch(addToCart(productId,qty));
       }
   },[dispatch,productId,qty]);

    const removeFromCartHandler = (id) => {
        dispatch(removeFromCart(id));
    }

    const checkoutHandler= () => {
        props.history.push('/shipping');
    }

    return (
        <>
        <div className="row top">


        <div className="small-container cart-page">
                <h1>Shopping Cart</h1>
                {error && <MessageBox variant="danger" clildren={error}/>}
                {cartItems.length === 0 ?
                (
                    <MessageBox>
                        Cart is empty <Link to='/'>Go shopping</Link>
                    </MessageBox>
                ):(
            <table className="cart-table">
                <tbody>
                    <tr>    
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Subtotal</th>
                    </tr>
                        {cartItems.map((item)=>(
                            <tr key={item.product}>
                                <td>
                                <div className="cart-info">
                                    <img src={item.image} alt={item.name} />
                                    <div>
                                        <NavLink to={`/product/${item.product}`} activeClassName="product-name">{item.name}</NavLink>
                                        <br/>
                                        <small>Price: ${item.price}</small>
                                        <br/>
                                        <p  onClick={()=> removeFromCartHandler(item.product)}>
                                            Remove
                                        </p>
                                    </div>
                                </div>
                                </td>
                                <td>
                                    <select value={item.qty}
                                        onChange={(e)=>{dispatch(addToCart(item.product,Number(e.target.value)))}}>
                                            {[...Array(item.countInStock).keys()].map((x)=>(
                                                <option key={x+1}>
                                                    {x+1}
                                                </option>
                                            ))}
                                    </select>
                                </td>
                                <td>{item.price}</td>
                            </tr>
                            
                        ))}
                
                </tbody>
            </table>
                )
                }  
            <div className="total-price">
                    <table className="cart-table">
                        <tbody>
                            <tr>
                                <td>Total</td>
                                <td>
                                    ({cartItems.reduce((accumulator,item)=>accumulator+item.qty,0)})
                                    :
                                    ${cartItems.reduce((accumulator,item)=>accumulator+item.qty*item.price,0)}
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                            </tr>

                            
                                <button 
                                    onClick={()=>checkoutHandler()}
                                    className="button-payment"
                                    disabled={cartItems.length === 0}>
                                    Proceed to Checkout
                                </button>
                            
                            </tbody>
                    </table>
                </div>
        </div>
        </div>
        </>
    )
}
