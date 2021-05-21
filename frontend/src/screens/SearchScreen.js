import React, {useState} from 'react'
import {useDispatch , useSelector} from 'react-redux';
import {Link,useParams} from 'react-router-dom';
import {listProducts} from '../actions/productActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Product from '../components/Product';
import Rating from '../components/Rating';
import {prices , ratings} from '../helpers/utils';

export default function SearchScreen(props) {
    const [RPagination,setRPagination] = useState(2);
    const [LPagination,setLPagination] = useState(1);
    const {name = 'all', category='all',min=0
    ,max=0,rating=0,order='newest',pageNumber=1} = useParams();
    const dispatch = useDispatch();
    const productList = useSelector(state=>state.productList);
    const {loading , error , products,page,pages} = productList;
    const productCategoryList = useSelector(state=>state.productCategoryList);
    const {
        loading:loadingCategories,
        error:errorCategories,
        categories
    }=productCategoryList;
    React.useEffect(()=>{
        dispatch(listProducts({
            pageNumber,
            name:name!=='all' ? name: '',
            category:category!=='all' ? category : '',
            min,
            max,
            rating,
            order
        }))
    },[dispatch,name,category,min,rating,max,order,pageNumber])
    const getFilterUrl = (filter) => {

        const filterPage = filter.page || pageNumber;
        const filterCategory = filter.category || category;
        const filterName = filter.name || name;
        const sortOrder = filter.order || order;
        let filterRating = filter.rating || rating;
        let filterMin = filter.min || min;
        let filterMax = filter.max || max;

return`/search/category/${filterCategory}/name/${filterName}/min/${filterMin}/max/${filterMax}/rating/${filterRating}/order/${sortOrder}/pageNumber/${filterPage}`;
    }
    return (
        <div>

<section className="section products">
  <div className="products-layout container">
    <div className="col-1-of-4">
      <div>
        <div className="block-title">
          <h3>Category</h3>
        </div>
        <ul className="block-content">
          {loadingCategories ? (<LoadingBox/>) :
            errorCategories ? (
            <MessageBox variant="danger" children={errorCategories} />
          ):(
              <>
            <li>
                <Link to={getFilterUrl({category:'all',page:1})}
                    className={'all' === category ? 'active' : ''}>
                    Any
                </Link>
            </li>   
            {categories?.map((c)=>(
                <li key={c}>
                    <Link className={c===category ? 'active' : ''}
                        to={getFilterUrl({category:c,page:1,min,max,rating})}>
                        {c}
                    </Link>
                </li>
            ))}
            </>
          )}
        </ul>
      </div>
      <div>
        <div className="block-title">
          <h3>Price</h3>
        </div>
        <ul className="block-content">
          <li>
            <Link to={getFilterUrl({min:1,max:10000,page:1})}
                className={`1-10000`===`${min}-${max}`?'active':''}>
                Any
            </Link>
          </li>
          <li>
          {prices?.map((p)=>(
                <li key={p.name}>
                    <Link
                        to={getFilterUrl({min:p.min,max:p.max,page:1})}
                        className={
                            `${p.min}-${p.max}`===`${min}-${max}` ? 'active' :''
                        }>
                            {p.name}
                    </Link>
                </li>
            ))}
          </li>
        </ul>
      </div>

    
        <div>
        <div className="block-title">
            <h3>Avg: Customer Review</h3>
        </div>
        <ul className="block-content">
            {ratings.map((r)=>(
                <li>
                <Link key={r.name}
                    to={getFilterUrl({rating:r.rating,page:1})}
                    className={`${r.rating}` === `${rating}` ? 'active' : ''}>
                    <Rating caption={' & up '}  rating={r.rating} />
                </Link>
                </li>
            ))}
        </ul>   
        </div>
    </div>
    
    <div className="col-3-of-4">
        <form action>
            <div className="item">
            {loading ? (<LoadingBox/>
                ):error ? (
                    <MessageBox variant="danger" children={error} />
                ):(
                    <div>{products.length} Results</div>
                )}
                <div>
                    Sort by{' '}
                    <select
                        value={order}
                        onChange={(e)=>{
                            props.history.push(getFilterUrl({order:e.target.value,pageNumber:1}));
                        }}>
                            <option value="newest">Newest Arrivals</option>
                            <option value="lowest">Price: Low to high</option>
                            <option value="highest">Price: High to low</option>
                            <option value="toprated">Avg: Customer Reviews </option>
                        </select>
                </div>
            </div>
        </form>
      <div className="product-layout">
            {loading ? (<LoadingBox/>) : error ? (
            <MessageBox variant="danger" children={error} />
                ):(
                <> 
                {products.length === 0 && (<MessageBox>No Product Found</MessageBox>)}
                
                    {products?.map((product)=>(
                        <Product key={product._id} product={product}/>
                    ))}

                </>
                )
            }
      </div>
      {/* PAGINATION */}
      <ul className="pagination">
      {pages < 4 ? (
            <>
            {[...Array(pages).keys()].map((x)=>(
                <Link 
                    className={x + 1===page ? 'active' : ''}
                    key={x+1}
                    to={getFilterUrl({page:x+1})}>
                    <span>{x+1}</span>
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
             to={getFilterUrl({page:LPagination})} > <span>{LPagination}</span>
            </Link>
            <Link className={RPagination === page ? 'active' : ''}
             to={getFilterUrl({page:RPagination})} > <span>{RPagination}</span>
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
                to={getFilterUrl({page:pages})} ><span className="last" onClick={()=>{
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
</section>

        </div>
    )
}
