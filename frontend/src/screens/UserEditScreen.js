import React,{useEffect, useState} from 'react'
import {useDispatch , useSelector} from 'react-redux';
import {updateUser , detailsUser} from '../actions/userActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { USER_UPDATE_RESET } from '../constants/userConstants';
export default function UserEditScreen(props) {
    const userId = props.match.params.id;
    const [name,setName] = useState('');
    const [email,setEmail] = useState('');
    const [isSeller,setIsSeller] = useState(false);
    const [isAdmin,setIsAdmin] = useState(false);

    const userDetails = useSelector(state=>state.userDetails);
    const {loading, error , user} = userDetails;
    console.log(user);
    const userUpdate = useSelector(state=>state.userUpdate);
    const {
        loading:loadingUpdate,
        error:errorUpdate,
        success:successUpdate
    }=userUpdate;
    const dispatch = useDispatch();
    useEffect(()=>{
        if(successUpdate){
            dispatch({type:USER_UPDATE_RESET});
            props.history.push('/userlist');            
        }
        if(!user){
            dispatch(detailsUser(userId));
        }
        else{
            setName(user.name)
            setEmail(user.email)
            setIsSeller(user.isSeller)
            setIsAdmin(user.isAdmin)
        }
    },[dispatch,props.history,successUpdate,user,userId])
    console.log(isAdmin,isSeller);
    const submitHandler = (e) => {
        e.preventDefault();
        console.log({_id:userId,name,email,isAdmin,isSeller})
        dispatch(updateUser({_id:userId,name,email,isAdmin,isSeller}));
    }
    return (
        <div>
            <form className="form" onSubmit={submitHandler}>
                
                    <h1>Edit User {name}</h1>
                    {loadingUpdate && <LoadingBox/>}
                    {errorUpdate && <MessageBox variant="danger" children={errorUpdate} />}
                    {loading ? (
                        <LoadingBox/>
                    ):error ?(
                        <MessageBox variant="danger" children={error}/>
                    ):(
                        <>
                            <div>
                                <label htmlFor="name">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    placeholder="Enter Name"
                                    onChange={(e)=>{setName(e.target.value)}}
                                    value={name}
                                />
                            </div>
                            <div>
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="Enter Email"
                                    onChange={(e)=>{setEmail(e.target.value)}}
                                    value={email}
                                />
                            </div>
                            <div>
                                <fieldset>
                                    <legend>Choose user's position</legend>
                                    <div>
                                        <label htmlfor="isSeller">Is Seller</label>
                                        {isSeller ? (
                                        <input type="checkbox" id="isSeller"  checked 
                                        onChange={(e)=>{
                                            setIsSeller(e.target.checked);
                                        }}
                                        />
                                        ):(

                                            <input type="checkbox" id="isSeller" 
                                        onChange={(e)=>{
                                            setIsSeller(e.target.checked);
                                        }}/>

                                        )}
                                    </div>
                                    <div>
                                        <label htmlfor="isAdmin">Is Admin</label>
                                        {isAdmin ? (
                                        <input type="checkbox" id="isAdmin" checked 
                                        onChange={(e)=>{
                                            setIsAdmin(e.target.checked);
                                        }}
                                        />

                                        ):(

                                            <input type="checkbox" id="isAdmin" 
                                        onChange={(e)=>{
                                            setIsAdmin(e.target.checked);
                                        }}/>

                                        )}
                                         
                                    </div>
                                </fieldset>
                            </div>
                            <div>
                                <label/>
                                <button
                                    type="sumbit"
                                    value="update"
                                    className="primary"
                                >
                                Update
                                </button>
                            </div>
                        </>
                    )}
                
            </form>            
        </div>
    )
}
