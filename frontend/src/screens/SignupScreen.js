import React from 'react'
import {Link} from 'react-router-dom';
import {register} from '../actions/userActions';
import MessageBox from '../components/MessageBox';
import LoadingBox from '../components/LoadingBox';
import {useDispatch , useSelector} from 'react-redux';
export default function SignupScreen(props) {
    const [name,setName] = React.useState('');
    const [email,setEmail] = React.useState('');
    const [password,setPassword] =React.useState('');
    const [confirmPassword,setConfirmPassword] = React.useState('');
    
    const redirect = props.location.search
    ? props.location.search.split('=')[1]
    : '/';
    console.log(props);
    const userRegister = useSelector((state) => state.userRegister);
    const {userInfo,loading,error} = userRegister;
    
    const dispatch = useDispatch();
    const sumbitHandler = (e) => {
        e.preventDefault();
        if(password !== confirmPassword){
            alert('Password and confirm password are not match');
        }else{
            dispatch(register(name,email,password));
        }
    }
    console.log(redirect);
    React.useEffect(()=>{
        if(userInfo){
            props.history.push(redirect);
        }
    },[props.history,redirect,userInfo])
    return (
        <div>
            <form className="form" onSubmit={(e)=>sumbitHandler(e)}>
                <div>
                    <h1>Create Account</h1>
                </div>
                {loading && <LoadingBox/>}
                {error && <MessageBox variant="danger" children={error}/>}
                <div>
                    <label htmlFor="name">Name</label>
                    <input
                     type="text"
                     id="name"
                     placeholder="Enter name"
                     required
                     onChange={(e)=>setName(e.target.value)}
                     />
                </div>
                <div>
                    <label htmlFor="email">Email</label>
                    <input
                     type="text"
                     id="email"
                     placeholder="Enter email"
                     required
                     onChange={(e)=>setEmail(e.target.value)}
                     />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input
                     type="password"
                     id="password"
                     placeholder="Enter password"
                     required
                     onChange={(e)=>setPassword(e.target.value)}
                     />
                </div>
                <div>
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                     type="password"
                     id="confirPassword"
                     placeholder="Enter confirm password"
                     required
                     onChange={(e)=>setConfirmPassword(e.target.value)}
                     />
                </div>
                <div>
                    <label/>
                    <button className="primary" type="submit">
                        Register
                    </button>
                </div>
                <div>
                    <label/>
                    <div>
                        Already have an account?{''}
                        <Link to={`/signin?redirect=${redirect}`}>Signin</Link>
                    </div>
                </div>
            </form>
        </div>
    )
}
