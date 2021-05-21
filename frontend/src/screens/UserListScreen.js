import React from 'react'
import {useDispatch,useSelector} from 'react-redux';
import {listUsers , deleteUser} from '../actions/userActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { USER_DETAILS_RESET } from '../constants/userConstants';
export default function UserListScreen(props) {
    const userList = useSelector(state=>state.userList);
    const {loading, error, users} = userList;
    const userDelete = useSelector(state=>state.userDelete);
    const {
        loading:loadingDelete,error:errorDelete,success:successDelete
    } = userDelete;
    const dispatch = useDispatch();
    React.useEffect(()=>{
        dispatch(listUsers());
        dispatch({type:USER_DETAILS_RESET})
    },[dispatch])
    const deleteHandler = (userId) => {
        if(window.confirm('Are you sure?')){
            dispatch(deleteUser(userId))
        }
        dispatch(listUsers());
    }
    return (
        <div>
            <h1>Users</h1>
            {loadingDelete && <LoadingBox/>}
            {errorDelete && <MessageBox variant="danger" children={errorDelete}/>}
            {successDelete && <MessageBox variant="success" children="user deleted successfully" />}
            {loading ? (
                <LoadingBox/>
            ):error ? (
                <MessageBox variant="danger" children={error} />
            ):(
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>NAME</th>
                            <th>EMAIL</th>
                            <th>IS SELLER</th>
                            <th>IS ADMIN</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users?.map((user)=>(
                            <tr key={user._id}>
                                <td>{user._id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.isSeller ? 'Yes' : 'No'}</td>
                                <td>{user.isAdmin ? 'Yes' : 'No'}</td>
                                <td>
                                    <button
                                        type="button"
                                        className="small"
                                        onClick={()=>props.history.push(`/user/edit/${user._id}`)}>
                                            Edit
                                    </button>
                                </td>
                                <td>
                                    <button
                                        type="button"
                                        className="small"
                                        onClick={()=>{deleteHandler(user._id)}}
                                        >
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
