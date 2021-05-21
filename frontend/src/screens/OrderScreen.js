import React from 'react';
import axios from 'axios';
import {PayPalButton} from 'react-paypal-button-v2';
import {useDispatch , useSelector} from 'react-redux';
import {Link , useParams} from 'react-router-dom';
import {deliverOrder, detailsOrder ,payOrder} from '../actions/orderActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import {ORDER_PAY_RESET , ORDER_DELIVER_RESET} from '../constants/orderConstants';
export default function OrderScreen(props) {
    const {id} =useParams();
    const [sdkReady, setSdkReady] = React.useState(false);
    const orderDetails = useSelector(state=>state.orderDetails);
    const {loading,error,order} = orderDetails;
    const userSignin = useSelector(state=>state.userSignin);
    const {userInfo} = userSignin;
    const orderPay = useSelector(state=>state.orderPay);
    const {
        loading:loadingPay,
        error:errorPay,
        success:successPay
    } = orderPay;
    const orderDeliver = useSelector(state=>state.orderDeliver);
    const {loading:loadingDeliver,error:errorDeliver,success:successDeliver} = orderDeliver;

    const dispatch = useDispatch();
    React.useEffect(()=>{
        const addPayPalScript = async () => {
            const {data} = await axios.get('/api/config/paypal');
            const script = document.createElement('script');
            script.type="text/javascript";
            script.src=`https://www.paypal.com/sdk/js?client-id=${data}`;
            script.async = true;
            script.onload = () =>{
                setSdkReady(true);
            }
            document.body.appendChild(script);
        };
        if(!order || successPay || successDeliver || (order?._id !== id)){
            dispatch({type:ORDER_PAY_RESET});
            dispatch({type:ORDER_DELIVER_RESET});
            dispatch(detailsOrder(id));
        }else{
            if(!order.isPaid){
                if(!window.paypal){
                    addPayPalScript();
                }else{
                    setSdkReady(true);
                }
            }
        }
    },[dispatch,id,order,sdkReady,successPay,successDeliver]);
    const successPaymentHandler = (paymentResult) => {
        dispatch(payOrder(order,paymentResult));
    }
    const deliverHandler = () => {
        dispatch(deliverOrder(order._id));
    }
    return loading ? (<LoadingBox/>) : error ? ( 
        <MessageBox variant ="danger" children={error}/>
    ):(
        <div>
            <h1>Order {order._id}</h1>
            <div className="row top">
                <div className="col-2">
                    <ul>
                        <li>
                            <div className="card card-body">
                                <h2>Shipping</h2>
                                <p>
                                    <strong>Name:</strong>{order.shippingAddress.fullName}<br/>
                                    <strong>Address</strong>{order.shippingAddress.address},
                                    {order.shippingAddress.city},{' '}
                                    {order.shippingAddress.postalCode},
                                    {order.shippingAddress.country}
                                </p>
                                {order.isDelivered ? (
                                    <MessageBox variant="success">
                                        Delivered at {order.deliveredAt}
                                    </MessageBox>
                                ):(
                                    <MessageBox variant="danger">Not delivered</MessageBox>
                                )}
                            </div>
                        </li>
                        <li>
                            <div className="card card-body">
                                <h2>Payment</h2>
                                <p>
                                    <strong>Method:</strong>{order.paymentMethod}
                                </p>
                                {order.isPaid ? (
                                    <MessageBox variant="success">
                                        Paid at {order.paidAt}
                                    </MessageBox>
                                ):(
                                    <MessageBox variant="danger">Not Paid</MessageBox>
                                )}
                            </div>
                        </li>
                        <li>
                            <div className="card card-body">
                                <h2>Order Items</h2>
                            </div>
                            <ul>
                                {order.orderItems.map((item)=>(
                                    <li key={item.product}>
                                        <div className="row">
                                            <div>
                                                <img 
                                                src={item.image}
                                                alt={item.name}
                                                className="small" />
                                            </div>
                                            <div className="min-30">
                                                <Link to={`/product/${item.product}`}>{item.name}</Link>
                                            </div>
                                            <div>
                                                {item.qty} x ${item.price} = ${item.qty * item.price}
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    </ul>
                </div>
                <div className="col-1">
                        <ul className="payment">
                            <li>
                                <h2>Order Sumary</h2>
                            </li>
                            <li>
                                <div className="row">
                                    <div>Items</div>
                                    ${order.itemsPrice.toFixed(2)}
                                </div>
                            </li>
                            <li>
                                <div className="row">
                                    <div>Shipping</div>
                                    ${order.shippingPrice.toFixed(2)}
                                </div>
                            </li>
                            <li>
                                <div className="row">
                                    <div>Tax</div>
                                    ${order.taxPrice.toFixed(2)}
                                </div>
                            </li>
                            <li>
                                <div className="row">
                                    <div>
                                        <strong>Order Total</strong>
                                    </div>
                                    <div>
                                        <strong>${order.totalPrice.toFixed(2)}</strong>
                                    </div>
                                </div>
                            </li>
                            <li>
                              {!order.isPaid && (
                                  <li>
                                    {!sdkReady ? (
                                        <LoadingBox></LoadingBox>
                                    ):(
                                        <>
                                            {errorPay && (
                                                <MessageBox variant="danger">{errorPay}</MessageBox>
                                            )}
                                            {loadingPay && <LoadingBox></LoadingBox>}
                                        <PayPalButton
                                            amount={order.totalPrice}
                                            onSuccess={successPaymentHandler}>
                                        </PayPalButton>
                                        </>
                                    )}

                                  </li>
                              )}      
                            </li>
                            {userInfo?.isSeller && !order.isDelivered && (
                                <li>
                                    {loadingDeliver && <LoadingBox/>}
                                    {errorDeliver && <MessageBox variant="danger" children={errorDeliver} />}
                                    <button 
                                        type="button"
                                        className="primary block"
                                        onClick={()=>{
                                            deliverHandler()}}>
                                        Deliver Order
                                    </button>
                                </li>
                            )}                     
                        </ul>
                </div>
            </div>
        </div>
    )
}
