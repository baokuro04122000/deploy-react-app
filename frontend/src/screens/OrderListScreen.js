import React from 'react'
import {useDispatch , useSelector} from 'react-redux';
import {listOrder , deleteOrder} from '../actions/orderActions';
import {ORDER_DELETE_RESET} from '../constants/orderConstants';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
export default function OderListScreen(props) {
    const sellerMode = props.match.path.indexOf('/seller') >= 0;
    const orderList = useSelector(state=>state.orderList);
    const {loading,error,orders} = orderList;
    const orderDelete = useSelector(state=>state.orderDelete);
    const {loading:loadingDelete,error:errorDelete,success:successDelete} = orderDelete;
    const userSignin = useSelector(state=>state.userSignin);
    const {userInfo} = userSignin;
    const dispatch= useDispatch();
    console.log(orders);
    React.useEffect(()=>{
        dispatch({type:ORDER_DELETE_RESET})
        dispatch(listOrder({seller:sellerMode ? userInfo._id:''}));
    },[dispatch,sellerMode,successDelete,userInfo._id])
    const deleteHandler = (orderId) => {
        if(window.confirm("Are you sure to delete?")){
            dispatch(deleteOrder(orderId));
            
        }
    }
    return (
        <div>
            <h1>Orders</h1>
            {loadingDelete && <LoadingBox/>}
            {errorDelete && <MessageBox variant="danger" children={errorDelete}/>}
            {successDelete && <MessageBox variant="success" children="you deleted successfully"/>}
            {loading ? <LoadingBox/>
            : error ? (
                <MessageBox variant="danger" children={error}/>
            ):(
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>USER</th>
                            <th>DATE</th>
                            <th>TOTAL</th>
                            <th>PAID</th>
                            <th>DELIVERED</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders?.map((order)=>(
                            <tr key={order._id}>
                                <td>{order._id}</td>
                                <td>{order.user}</td>
                                <td>{order.createdAt.substring(0,10)}</td>
                                <td>{order.totalPrice.toFixed(2)}</td>
                                <td>{order.idPaid ? order.paidAt.substring(0,10):'No'}</td>
                                <td>{order.isDelivered? order.deliveredAt?.substring(0,10) : 'No'}</td>
                                <td>
                                    <button
                                        type="button"
                                        className="small"
                                        onClick={()=>{
                                            props.history.push(`/order/${order._id}`)
                                        }}>
                                            Details
                                    </button>
                                </td>
                                <td>
                                    <button
                                        type="button"
                                        className="small"
                                        onClick={()=>{
                                            deleteHandler(order._id)
                                        }}>
                                            Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}
