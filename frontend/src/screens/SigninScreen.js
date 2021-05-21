import React from 'react';
import {Link} from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import {useDispatch , useSelector} from 'react-redux';
import {signin} from '../actions/userActions';
export default function SignInScreen(props) {
    const [email,setEmail] = React.useState('');
    const [password,setPassword] = React.useState('');
    const redirect = props.location.search
        ? props.location.search.split('=')[1]
        :'/';
    const userSignin = useSelector((state)=>state.userSignin);
    const {userInfo, loading , error} = userSignin;
    const dispatch = useDispatch();

    const submitHandler = (e) =>{
        e.preventDefault();
        dispatch(signin(email,password));
    }
    React.useEffect(()=>{
        if(userInfo?.token){
            props.history.push(redirect);
        }
    },[props.history,redirect,userInfo])
    return (
        <div>
            <form className="form" onSubmit={submitHandler}>
                <div>
                    Sign In
                </div>
                {loading && <LoadingBox></LoadingBox>}
                {error && <MessageBox variant="danger" children={error}></MessageBox>}
                <div>
                    <label htmlFor="email">Email address</label>
                    <input type="email" onChange={(e)=>setEmail(e.target.value)} id="email" placeholder="Enter email" required/>
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input type="password" onChange={(e)=>setPassword(e.target.value)} id="password" placeholder="Enter password" required/>
                </div>
                <div>
                    <label/>
                    <button className="primary" type="submit">
                        Sign In
                    </button>
                </div>
                <div>
                    <label/>
                    <div>
                        New customer?{' '} 
                        <Link to={`/register?redirect=${redirect}`}>Create your account</Link>
                    </div>
                </div>
            </form>
        </div>
    );
}
