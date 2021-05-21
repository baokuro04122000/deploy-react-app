import React from 'react'
import {useDispatch,useSelector} from 'react-redux';
import {createOrder} from '../actions/orderActions';
import { Link } from 'react-router-dom';
import CheckoutSteps from '../components/CheckoutSteps';
import { ORDER_CREATE_RESET } from '../constants/orderConstants';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

export default function PlaceOrderScreen(props) {
    const cart = useSelector(state => state.cart);
    if(!cart.paymentMethod){
        props.history.push('/payment')
    }
    const orderCreate =useSelector(state=>state.orderCreate);
    const {loading,error,order,success} = orderCreate;
    const toPrice = (num) => +num.toFixed(2); //4.123 =>"4.12" =>4.12
    cart.itemsPrice = toPrice(cart.cartItems.reduce((a,c)=>a + c.qty * c.price,0));
    cart.shippingPrice = cart.itemsPrice > 100 ? toPrice(0) : toPrice(10);
    cart.taxPrice = toPrice(0.05 * cart.itemsPrice);
    cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;
    const dispatch = useDispatch();

    const placeOrderHandler = () => {
        dispatch(createOrder({...cart, orderItems:cart.cartItems}))
    }
    React.useEffect(()=>{
        if(success){
            props.history.push(`/order/${order._id}`);
            dispatch({type:ORDER_CREATE_RESET});
        }
    },[dispatch,success,order,props.history])
    return (
        <div>
            <CheckoutSteps step1 step2 step3 step4 />
            <div className="row top">
                <div className="col-2">
                    <ul>
                        <li>
                            <div className="card card-body">
                                <h2>shipping</h2>
                                <p>
                                    <strong>Name:</strong>{cart.shippingAddress.fullName}<br/>
                                    <strong>Address:</strong>{cart.shippingAddress.address}, &nbsp
                                    {cart.shippingAddress.city}, &nbsp{cart.shippingAddress.postalCode} &nbsp
                                    {cart.shippingAddress.country}
                                </p>
                            </div>
                        </li>
                        <li>
                            <div className="card card-body">
                                <h2>Payment</h2>
                                <p>
                                    <strong>Method:</strong>{cart.paymentMethod}
                                </p>
                            </div>
                        </li>
                        <li>
                            <div className="card card-body">
                                <h2>Order Items</h2>
                                <ul>
                                    {cart.cartItems.map((item)=>(
                                        <li key={item.product}>
                                            <div className="row">
                                                <div>
                                                    <img src={item.image}
                                                        alt={item.name}
                                                        className="small" />
                                                </div>
                                            </div>
                                            <div className="min-30">
                                                <Link to={`/product/${item.product}`}>{item.name}</Link>
                                            </div>
                                            <div>
                                                {item.qty}x${item.price} = ${item.qty * item.price}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </li>
                    </ul>
                </div>
                <div className="col-1">
                        <ul className="payment">
                            <li>
                                <h2>Order Summary</h2>
                            </li>
                            <li>
                                <div className="row">
                                    <div>Items</div>
                                    <div>${cart.itemsPrice.toFixed(2)}</div>
                                </div>
                            </li>
                            <li>
                                <div className="row">
                                    <div>Tax</div>
                                    <div>${cart.taxPrice.toFixed(2)}</div>
                                </div>
                            </li>
                            <li>
                                <div className="row">
                                    <div>Shipping</div>
                                    <div>${cart.itemsPrice > 100 ? 0 : 10}</div>
                                </div>
                            </li>
                            <li>
                                <div className="row">
                                    <div>
                                        <strong>Order Total</strong>
                                    </div>
                                    <div>
                                        <strong>${cart.totalPrice.toFixed(2)}</strong>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <button 
                                    type="button"
                                    onClick={placeOrderHandler}
                                    className="primary block"
                                    disabled={cart.cartItems.length===0}>
                                    Place Order
                                </button>
                            </li>
                            {loading && <LoadingBox/>}
                            {error && <MessageBox variant="danger" children={error}/>}
                        </ul>
                </div>
            </div>
        </div>
    )
}
