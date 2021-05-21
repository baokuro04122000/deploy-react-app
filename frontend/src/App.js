import React,{useState,useEffect} from 'react';
import {BrowserRouter as Router , Route , Switch , Link} from 'react-router-dom';
import {useDispatch , useSelector} from 'react-redux';
import {animation} from './helpers/javascipt_animation.js'

import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import SigninScreen from './screens/SigninScreen';
import SignupScreen from './screens/SignupScreen';
import ShippingAdressScreen from './screens/ShippingAddressScreen';
import PaymentMethodScreen from './screens/PaymentMethodScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import ProfileScreen from './screens/ProfileScreen';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import ProductListScreen from './screens/ProductListScreen';
import ProductEditScreen from './screens/ProductEditScreen';
import ProductCreateScreen from './screens/ProductCreateScreen';
import OrderListScreen from './screens/OrderListScreen';
import UserListScreen from './screens/UserListScreen';
import UserEditScreen from './screens/UserEditScreen';
import SellerRoute from './components/SellerRoute';
import SellerScreen from './screens/SellerScreen';
import SearchBox from './components/SearchBox';
import SearchScreen from './screens/SearchScreen';
import MapScreen from './screens/MapScreen';
import SupportScreen from './screens/SupportScreen';
import ChatBox from './components/ChatBox';
import {listProductCategories} from './actions/productActions';
import LoadingBox from './components/LoadingBox';
import MessageBox from './components/MessageBox';
import {signout} from './actions/userActions';
function App() {
  const cart = useSelector((state)=>state.cart);
  const [sidebarIsOpen , setSidebarIsOpen] = useState(false);
  const [navBarMobile,setNavBarMobile] = useState(false);
  const {cartItems} = cart;
  const userSignin = useSelector(state=>state.userSignin);
  const {userInfo} = userSignin;
  console.log(userInfo)
  const dispatch = useDispatch();
  const signoutHandler = () => {
    dispatch(signout());
  };
  const productCategoryList = useSelector(state=>state.productCategoryList);
  const {
    loading:loadingCategories,
    error:errorCategories,
    categories
  } = productCategoryList;
  
  useEffect(()=>{
    animation();
    dispatch(listProductCategories())
  },[dispatch])
  return (
    <Router>
    <div className="grid-container">
    <div className="row center edit-row">
  <header>
  <Link to="/" className="logo">E-Commerce</Link>
  <label htmlFor="btn" className="icon" onClick={()=>{setNavBarMobile(!navBarMobile)}}>
    <span className="fa fa-bars" />
  </label>
  <ul className={navBarMobile?'display':''}>
  <li className="edit-search">
      <Route
        render={({history})=>(
          <SearchBox history={history}/>
        )}>
      </Route>
   </li>
    <li>
      <Link to="/cart"><i class="fas fa-shopping-cart"></i>
      {
        cartItems.length > 0 && (
          <span className="badge">
            {cartItems.length}
          </span>
        )
      }</Link>
    </li>
    {userInfo ? (
      <>
      <li>
      <Link to="/">{userInfo.name ? userInfo.name : 'User'}</Link>
      <ul>
        <li><Link to="/profile">Profile</Link></li>
        <li><Link to="/orderhistory">Order History</Link></li>
        <li onClick={signoutHandler} ><Link to="/signout">Sign Out</Link></li>
      </ul>
      </li>
      </>
      ):(
      
        <li>
          <Link to="/signin">Sign In</Link>
        </li>
      )}
      {userInfo?.isSeller && (
      <li>
      <Link to="/">{userInfo.seller?.name ? userInfo.seller.name : 'Seller'}</Link>
      <ul>
        <li>
          <Link to="/productlist/seller">Products</Link>
        </li>
        <li>
          <Link to="/orderlist/seller">Orders</Link>
        </li>
      </ul>
    </li>
      )}
      {userInfo?.isAdmin && (
      <li>
      <Link to="/">Admin</Link>
      <ul>
        <li>
          <Link to="/userlist">Users</Link>
        </li>
        <li>
          <Link to="/support">Support</Link>
        </li>
      </ul>
    </li>
      )}
  </ul>
    </header>
    </div>
    <aside className={sidebarIsOpen ? 'open' :''}>
      <ul className="categories">
          <li>
              <strong>Categories</strong>
              <button
                onClick={()=>setSidebarIsOpen(false)}
                className="close-sidebar"
                type="button">
              <i className="fas fa-window-close"></i>
              </button>
          </li>
          {loadingCategories ? (
            <LoadingBox/>
          ) : errorCategories ? (
            <MessageBox variant="danger" children={errorCategories}/>
          ): (
            categories?.map((c)=>(
              <li key={c}>
                <Link to={`/search/category/${c}`}
                  onClick={()=>setSidebarIsOpen(false)}>
                  {c}
                </Link>
              </li>
            ))
          )}
      </ul>
    </aside>
    <main>
    <Switch>
      <Route path="/" exact component={HomeScreen}/>
      <Route path="/home/pageNumber/:pageNumber" exact component={HomeScreen}/>
      <Route path="/product/:id" exact component={ProductScreen}/>
      <Route path="/product/edit/:id" exact component={ProductEditScreen}/>
      <Route path="/createproduct" exact component={ProductCreateScreen}/>
      <Route path="/cart/:id?" exact component={CartScreen}/>
      <Route path="/seller/:id" exact component={SellerScreen}/>
      <Route path="/seller/:id/pageNumber/:pageNumber" exact component={SellerScreen}/>
      <Route path="/signin" exact component={SigninScreen}/>
      <Route path="/register" exact component={SignupScreen}/>
      <Route path="/shipping" exact component={ShippingAdressScreen}/>
      <Route path="/payment" exact component={PaymentMethodScreen}/>
      <Route path="/placeorder" exact component={PlaceOrderScreen}/>
      <Route path="/order/:id" exact component={OrderScreen}/>
      <Route path="/orderhistory" exact component={OrderHistoryScreen}/>
      <Route path="/search/name/:name?" exact component={SearchScreen}/>
      <Route path="/search/category/:category" exact component={SearchScreen}/>
      <Route path="/search/category/:category/name/:name" exact component={SearchScreen}/>
      <Route path=
"/search/category/:category/name/:name/min/:min/max/:max/rating/:rating/order/:order/pageNumber/:pageNumber"
      exact component={SearchScreen}/>
      <PrivateRoute path="/profile" component={ProfileScreen}/>
      <PrivateRoute path="/map" component={MapScreen}/>
      <AdminRoute path="/orderlist" exact component={OrderListScreen} />
      <AdminRoute path="/productList" exact component={ProductListScreen}/>
      <AdminRoute path="/productList/pageNumber/:pageNumber" exact component={ProductListScreen}/>
      <AdminRoute path="/userlist" exact component={UserListScreen}/>
      <AdminRoute path="/user/edit/:id" exact component={UserEditScreen}/>
      <AdminRoute path="/support" exact component={SupportScreen}/>
      <SellerRoute path="/productlist/seller" exact component={ProductListScreen} />
      <SellerRoute path="/orderlist/seller" exact component={OrderListScreen} />
    </Switch>
    </main>
    <footer className="row center">
      {!userInfo?.isAdmin  && <ChatBox userInfo={userInfo}/>}
      <div>All right reserved</div>{' '}
    </footer>
  </div>
</Router>
  );
}

export default App;
