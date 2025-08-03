import React, { useState } from 'react'
import './Register.css'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { voteActions } from '../store/vote-slice';
import axios from 'axios';
const Login = () => {
  const [userData,setUserData]=useState({fullName:"",email:"",password:""});

  const [error,setError]=useState("")
  const dispatch=useDispatch()
  const navigate=useNavigate()
  //function to change  controller inputs
  const changeInputHandler=(e)=>{
    setUserData(prevState =>{
      return {...prevState,[e.target.name]:e.target.value}
    })
  }

  const API_URL = import.meta.env.VITE_API_URL;
  
    const loginVoter = async (e) => {
      e.preventDefault();
      try {
        console.log(userData)
        const response=await axios.post(`${API_URL}/voters/login`, userData);
       const newVoter=await response.data;
       //save new voter in local storage and update in redux store
       localStorage.setItem("currentUser",JSON.stringify(newVoter))
       dispatch(voteActions.changeCurrentVoter(newVoter))
       navigate("/results")
      } catch (err) {
        if (err.response?.data?.message) {
          setError(err.response.data.message);
        } else if (err.message) {
          setError(err.message);
        } else {
          setError("An unknown error occurred.");
        }
        console.error("Registration error:", err);
      }
    };
  
  
  //console.log(userData);
  return (
    <section className="register">
      <div className="container register_container">
        <h2>Sign in</h2>
        <form onSubmit={loginVoter}>
          {error && <p className="form_error-message">{error}</p>}
          <input type="email" name='email' placeholder='Email Address' onChange={changeInputHandler} autoComplete='true' autoFocus  />
          <input type="password" name='password' placeholder='Password' onChange={changeInputHandler} autoComplete='true'  />
          <p>Don't have an account? <Link to='/register'>Sign up</Link> </p>
          <button type='submit' className='btn primary'>Login

          </button>
        </form>
      </div>
    </section>
  )
}

export default Login
