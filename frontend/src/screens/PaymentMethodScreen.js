import React from 'react'
import {useDispatch , useSelector} from 'react-redux';
import {savePaymentMethod} from '../actions/cartActions';
import CheckoutSteps from '../components/CheckoutSteps';
export default function PaymentMethodScreen(props) {
    const cart = useSelector(state => state.cart);
    const {shippingAddress} = cart;
    if(!shippingAddress.address){
        props.history.push('/shipping')
    }
    const [paymentMethod, setPaymentMethod] = React.useState('Paypal');
    const dispatch = useDispatch();
    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(savePaymentMethod(paymentMethod));
        props.history.push('/placeorder');
    }
    return (
        <div>
            <CheckoutSteps step1 step2 step3 />
            <form className="form" onSubmit={e=> submitHandler(e)}>
                <div>
                    <h1>Payment Method</h1>
                </div>
                <div>
                    <div>
                        <input 
                            type="radio"
                            id="paypal"
                            value="Paypal"
                            name="paymentMethod"
                            required
                            checked
                            onChange={(e)=>setPaymentMethod(e.target.value)} />
                        <label htmlFor="paypal">Paypal</label>
                    </div>
                </div>
                <div>
                    <label/>
                    <button className="primary" type="submit">
                        Continue
                    </button>
                </div>
            </form>
        </div>
    )
}
