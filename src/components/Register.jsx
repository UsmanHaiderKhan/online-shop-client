import {useRef, useState, useEffect} from "react";
import {faCheck, faTimes, faInfoCircle} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import axios from '../api/axios';

const EMAIL_REGEX = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = '/auth/signup';

const Register = () => {
    const emailRef = useRef();
    const errRef = useRef();

    const [email, setUser] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);

    const [password, setPassword] = useState('');
    const [validPassword, setValidPassword] = useState(false);
    const [passwordFocus, setPasswordFocus] = useState(false);

    const [matchPassword, setMatchPassword] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        emailRef.current.focus();
    }, []);


    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email));
    }, [email])

    useEffect(() => {
        setValidPassword(PWD_REGEX.test(password));
        setValidMatch(password === matchPassword);
    }, [password, matchPassword])

    useEffect(() => {
        setErrMsg('');
    }, [email, password, matchPassword])

    const handleSubmit = async (e) => {
        e.preventDefault();
        // if button enabled with JS hack
        const v1 = EMAIL_REGEX.test(email);
        const v2 = PWD_REGEX.test(password);
        if (!v1 || !v2) {
            setErrMsg("Invalid Entry");
            return;
        }
        try {
            const response = await axios.post(REGISTER_URL,
                JSON.stringify({email, password}),
                {
                    headers: {'Content-Type': 'application/json'},
                     withCredentials: true,
                    // Authorization: 'Bearer ' +response?.accessToken
                }
            );
            console.log(response?.data);
            console.log(response?.accessToken);
            console.log(JSON.stringify(response))
            setSuccess(true);
            //clear state and controlled inputs
            //need value attrib on inputs for this
            setUser('');
            setPassword('');
            setMatchPassword('');
        } catch (err) {
            if (!err?.response) {
                console.log(err.message);
                setErrMsg('No Server Response');
            } else if (err.response?.status === 409) {
                setErrMsg('Email Taken');
            } else {
                console.log(err.message);
                setErrMsg('Registration Failed')
            }
            errRef.current.focus();
        }
    }
    return (
        <>
            {success ? (
                <section>
                    <h1>Success!</h1>
                    <p>
                        <a href="/">Sign In</a>
                    </p>
                </section>
            ) : (
                <section>

                    <div className="justify-center h-screen flex items-center ">
                        <form onSubmit={handleSubmit} className="bg-white rounded shadow-2xl lg:w-1/5 md:w-50  px-8 pt-6 pb-8 mb-4">
                            <p ref={errRef} className={errMsg ? "text-red" : "offscreen"} aria-live="assertive">{errMsg}</p>
                            <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">Register User</h1>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                    Email
                                    <FontAwesomeIcon icon={faCheck} className={validEmail ? "valid" : "hide"}/>
                                    <FontAwesomeIcon icon={faTimes}
                                                     className={validEmail || !email ? "hide" : "invalid"}/>
                                </label>
                                <input onChange={e => setUser(e.target.value)} ref={emailRef}
                                       aria-invalid={validEmail ? "false" : "true"}
                                       aria-describedby="uidnote" required
                                       onFocus={() => setEmailFocus(true)}
                                       onBlur={() => setEmailFocus(false)}
                                       className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                       id="email" type="text" placeholder="Email"/>
                                <p id="uidnote"
                                   className={emailFocus && email && !validEmail ? "instructions" : "offscreen"}>
                                    <FontAwesomeIcon icon={faInfoCircle}/>
                                    4 to 24 characters.<br/>
                                    Must begin with a letter.<br/>
                                    Letters, numbers, underscores, hyphens allowed.
                                </p>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                    Password
                                    <FontAwesomeIcon icon={faCheck} className={validPassword ? "valid" : "hide"}/>
                                    <FontAwesomeIcon icon={faTimes}
                                                     className={validPassword || !password ? "hide" : "invalid"}/>
                                </label>
                                <input value={password} onChange={e => setPassword(e.target.value)}
                                       aria-invalid={validPassword ? "false" : "true"}
                                       aria-describedby="passwordnote" required
                                       onFocus={() => setPasswordFocus(true)}
                                       onBlur={() => setPasswordFocus(false)}
                                       className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                       id="password" type="password" placeholder="Password"/>
                                <p id="passwordnote"
                                   className={passwordFocus && !validPassword ? "instructions" : "offscreen"}>
                                    <FontAwesomeIcon icon={faInfoCircle}/>
                                    8 to 24 characters.<br/>
                                    Must include uppercase and lowercase letters, a number and a special character.<br/>
                                    Allowed special characters: <span aria-label="exclamation mark">!</span> <span
                                    aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span
                                    aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                                </p>

                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirm_pwd">
                                    Confirm Password:
                                    <FontAwesomeIcon icon={faCheck}
                                                     className={validMatch && matchPassword ? "valid" : "hide"}/>
                                    <FontAwesomeIcon icon={faTimes}
                                                     className={validMatch || !matchPassword ? "hide" : "invalid"}/>
                                </label>
                                <input
                                    type="password"
                                    id="confirm_pwd"
                                    onChange={(e) => setMatchPassword(e.target.value)}
                                    value={matchPassword}
                                    required placeholder="Confirm Password"
                                    aria-invalid={validMatch ? "false" : "true"}
                                    aria-describedby="confirmnote"
                                    onFocus={() => setMatchFocus(true)}
                                    onBlur={() => setMatchFocus(false)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                />
                                <p id="confirmnote"
                                   className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                                    <FontAwesomeIcon icon={faInfoCircle}/>
                                    Must match the first password input field.
                                </p>
                                <div className="flex items-center justify-between mt-6">
                                    <button
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                        disabled={!validEmail || !validPassword || !validMatch}>Sign Up
                                    </button>
                                    <a className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                                       href="/">
                                        Forgot Password?
                                    </a>
                                </div>
                            </div>
                            <p className="mt-8 flex justify-between">
                                Already registered?<br />
                                <span className="line">
                            {/*put router link here*/}
                                    <a href="/">Sign In</a>
                        </span>
                            </p>
                        </form>

                    </div>

                </section>
            )}
        </>
    );
}
export default Register;
