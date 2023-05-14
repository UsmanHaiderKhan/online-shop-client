import {useState, useEffect} from 'react';
import axios from "../api/axios";
// import {Link} from "react-router-dom";

const Login = () => {
    const [users, setUsers] = useState();
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        let isMounted = true;
        const abController = new AbortController();

        const getUsers = async (user) => {
            try {
                const response = await axios.get('/users', {
                    signal: abController.signal
                }).then(() => {
                    console.log(response.data);
                    isMounted && setUsers(response.data)
                }).catch(err => {
                    console.log(err.message);
                });
            } catch (err) {
                console.log(err.message);
            }
        }
        getUsers().then(r => {
            console.log('it works')});
        return ()=>{
            isMounted = false;
            abController.abort();
        }
    }, []);


    // const [password, setPassword] = useState('');

    const proceedLogin = (e) => {
        e.preventDefault();
        if (validate()){
           fetch("localhost:3000/auth/login").then((res) =>{
               return res.json();
           }).then((response) =>{
               console.log(response);

           }).catch((err)=>{
               alert(err.message);
           });
        }
    }

    const validate = () =>{
        let result = true;
        if(username === '' || username === null){
            result = false;
            alert('Please enter the Username' );
        }
        if(password === '' || password === null){
            result = false;
            alert('Please enter the Password' );
        }
        return result;
    }

    return (
        <div className="h-screen items-center flex justify-center ">
            <form onSubmit={proceedLogin} className="bg-white shadow-2xl rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                        Username
                    </label>
                    <input value={username} onChange={e => setUserName(e.target.value)}
                           className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                           id="username" type="text" placeholder="Username"/>
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                        Password
                    </label>
                    <input value={password} onChange={e => setPassword(e.target.value)}
                           className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                           id="password" type="password" placeholder="Password"/>
                    {/*<p className="text-red-500 text-xs italic">Please choose a password.</p>*/}
                </div>
                <div className="flex items-center justify-between">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit">
                        Sign In
                    </button>
                    <a className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                       href="/">
                        Forgot Password?
                    </a>
                </div>
                {/*<div className="text-center">*/}
                {/*    <Link to={'/register'} className="btn btn-primary">Create New User</Link>*/}
                {/*</div>*/}
            </form>
        </div>
    )
}

export default Login;
