import React, { useEffect, useState } from 'react'
//import { elections as dummyElections } from '../utils/data'
import ResultElection from '../components/ResultElection'
import './Result.css'
import {useSelector} from 'react-redux'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
const Results = () => {
  const [elections,setElections]=useState([]);

  const navigate=useNavigate()
  const token= useSelector(state => state?.vote?.currentVoter?.token)

  const API_URL = import.meta.env.VITE_API_URL;
  const getElections=async (e)=>{
    try {
      const response=await axios.get(`${API_URL}/elections`,
        {withCredentials:true,headers:{Authorization:`Bearer ${token}`}}
      )
      console.log("Current token:", token);

      const elections=await response.data;
      setElections(elections)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    getElections()
  },[])
  useEffect(()=>{
        if(!token){
          navigate('/')
        }
  },[])
  return (
    <section className="results">
      <div className="container results_container">
        {
          elections.map(election => <ResultElection key={election._id} {...election} />)
        }
      </div>
    </section>
  )
}

export default Results
