import React, {useState} from 'react'
import Product from '../components/Product';
import MessageBox from '../components/MessageBox';
import LoadingBox from '../components/LoadingBox';
import Carousel from 'react-elastic-carousel';
import Item from "../helpers/ItemsCarousel";
import {useSelector , useDispatch} from 'react-redux';
import {listProducts} from '../actions/productActions';
import {listTopSellers} from '../actions/userActions';
import {Link} from 'react-router-dom';
const breakPoints = [
    { width: 1, itemsToShow: 1 },
    { width: 550, itemsToShow: 2, itemsToScroll: 2 },
    { width: 768, itemsToShow: 3 },
    { width: 1200, itemsToShow: 4 }
  ];

export default function HomeScreen(props) {
    const currentPage = props.match.params.pageNumber;
    const [RPagination,setRPagination] = useState(2);
    const [LPagination,setLPagination] = useState(1);
    const dispatch = useDispatch();
    const productList = useSelector((state)=>state.productList);
    const {loading , error , products , pages ,page} = productList;
    const userTopSellers = useSelector(state=>state.userTopSellers);
    const {
        loading:loadingSellers,
        error:errorSellers,
        users:sellers
    } = userTopSellers;
    React.useEffect(()=>{
        dispatch(listProducts({pageNumber:currentPage ? currentPage : 1}));
        dispatch(listTopSellers());
    },[dispatch,currentPage])
    return (
        <div>
        <div className="container">
        <div className="title">
            <h2>Shop by Brand</h2>
            <span>Select from the premium product brands and save plenty money</span>
        </div>
            {loadingSellers ? (<LoadingBox/>):errorSellers ? (
                <MessageBox variant="danger" children={errorSellers} />
            ):(
                <div className="default-carousel">
      <div className="controls-wrapper">
      </div>
      <hr className="seperator" />
      <div className="carousel-wrapper">
        <Carousel breakPoints={breakPoints}>
          {sellers.map((seller) => (
            <Item key={seller._id}><Link to={`/seller/${seller._id}`}>
            <img src={seller?.seller?.logo} alt={seller?.seller?.name} /></Link></Item>
          ))}
        </Carousel>
      </div>
    </div>
            ) }
        </div>
    <div className="row">
        {
            loading ? (
                <LoadingBox/>
            ) : error ? (
                <MessageBox variant="danger">{error}</MessageBox>
            ):(
            <>
                {products?.length===0 && <MessageBox>No Product Found</MessageBox>}
                    <div className="product-layout edit-layout-product">
                        
                    {products?.map((product)=>
                        <Product product={product} key={product._id}/>
                    )}
                    </div>
                   
            </>
            )
            }
        </div>
        <div className="row  a-little-edit">
        <ul className="pagination">
      {pages < 4 ? (
            <>
            {[...Array(pages).keys()].map((x)=>(
                <Link className={x+1 === page ? 'active' : ''}  key={x+1}
             to={`/home/pageNumber/${x+1}`} > <span>{x+1}</span>
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
             to={`/home/pageNumber/${LPagination}`} > <span>{LPagination}</span>
            </Link>
            <Link className={RPagination === page ? 'active' : ''}
             to={`/home/pageNumber/${RPagination}`} > <span>{RPagination}</span>
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
                to={`/home/pageNumber/${pages}`} ><span className="last" onClick={()=>{
                    setLPagination(pages-1);
                    setRPagination(pages);
                }}>Last »</span></Link>
            </>
            )}
            
          </>
      )}
      </ul>
        </div>
    </div>
    )
}
