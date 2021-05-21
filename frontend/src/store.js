import {createStore,compose,applyMiddleware,combineReducers} from 'redux';
import thunk from 'redux-thunk';
import { productDetailsReducer,
         productListReducer ,
         productCreateReducer,
         productUpdateReducer,
         productDeleteReducer, 
         productCategoryListReducer,
         productReviewCreateReducer} from './reducers/productReducers';
import {cartReducer} from './reducers/cartReducers';
import {userSigninReducer , userRegisterReducer ,userDetailsReducer ,userUpdateProfileReducer, userListReducer, userDeleteReducer, userUpdateReducer, userTopSellerListReducer, userAddressMapReducer} from './reducers/userReducers';
import {orderCreateReducer,orderDetailsReducer ,orderPayReducer ,orderMineListReducer, orderListReducer, orderDeleteReducer, orderDeliverReducer} from './reducers/orderReducers';
const initialState = {
    userSignin: {
        userInfo: localStorage.getItem('userInfo')
        ? JSON.parse(localStorage.getItem('cartItems'))
        : null
    },
    cart:{
        cartItems:localStorage.getItem('cartItems')

        ? JSON.parse(localStorage.getItem('cartItems'))
        : [],
        shippingAddress: localStorage.getItem('shippingAddress')
        ? JSON.parse(localStorage.getItem('shippingAddress'))
        :{},
        paymentMethod:'Paypal'
    },

};

const reducer = combineReducers({
    productList:productListReducer,
    productCategoryList:productCategoryListReducer,
    productDetails:productDetailsReducer,
    productCreate:productCreateReducer,
    productUpdate:productUpdateReducer,
    productDelete:productDeleteReducer,
    productReviewCreate:productReviewCreateReducer,
    cart:cartReducer,
    userSignin:userSigninReducer,
    userRegister:userRegisterReducer,
    orderCreate:orderCreateReducer,
    orderDetails:orderDetailsReducer,
    orderPay:orderPayReducer,
    userAddressMap:userAddressMapReducer,
    orderMineList:orderMineListReducer,
    orderList:orderListReducer,
    orderDelete:orderDeleteReducer,
    orderDeliver:orderDeliverReducer,
    userDetails:userDetailsReducer,
    userUpdateProfile:userUpdateProfileReducer,
    userList:userListReducer,
    userTopSellers:userTopSellerListReducer,
    userDelete:userDeleteReducer,
    userUpdate:userUpdateReducer
});

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(reducer,initialState,composeEnhancer(applyMiddleware(thunk)));
export default store;