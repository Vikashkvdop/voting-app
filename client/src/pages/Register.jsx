import React, { useState } from 'react'
import './Register.css'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
const Register = () => {
  const [userData,setUserData]=useState({fullName:"",email:"",password:"",confirmPassword:""});

  const [error,setError]=useState("");
  const navigate=useNavigate();
  //function to change  controller inputs
  const changeInputHandler=(e)=>{
    setUserData(prevState =>{
      return {...prevState,[e.target.name]:e.target.value}
    })
  }

  const API_URL = import.meta.env.VITE_API_URL;

  const registerVoter = async (e) => {
    e.preventDefault();
    try {
      console.log(userData)
      await axios.post(`${API_URL}/voters/register`, userData);
      navigate('/');
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
        <h2>Sign up</h2>
        <form onSubmit={registerVoter}>
          {error && <p className="form_error-message">{error}</p>}
          <input type="text" name='fullName' placeholder='Full Name' onChange={changeInputHandler} autoComplete='true' autoFocus />
          <input type="email" name='email' placeholder='Email Address' onChange={changeInputHandler} autoComplete='true'  />
          <input type="password" name='password' placeholder='Password' onChange={changeInputHandler} autoComplete='true'  />
          <input type="password" name='confirmPassword' placeholder='Confirm password' onChange={changeInputHandler} autoComplete='true'  />
          <p>Already have an account? <Link to='/'>Sign in</Link> </p>
          <button type='submit' className='btn primary'>Register</button>
        </form>
      </div>
    </section>
  )
}

export default Register
