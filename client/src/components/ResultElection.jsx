import React, { useEffect, useState } from 'react'
import CandidateRating from './CandidateRating';
//import { candidates } from '../utils/data'
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Loader from './Loader';
const ResultElection = ({_id:id,thumbnail,title}) => {

    const [totalVotes,setTotalVotes]=useState(0);
    const [electionCandidates,setElectionCandidates]=useState([])

    const [isLoading, setIsLoading]=useState(false);
    const token=useSelector(state=>state?.vote?.currentVoter?.token);

    const API_URL = import.meta.env.VITE_API_URL;
    const getCandidates=async ()=>{
        setIsLoading(true)
        try {
            const response=await axios.get(`${API_URL}/elections/${id}/candidates`, {withCredentials:true,headers:{Authorization:`Bearer ${token}`}})

            const candidates=await response.data;
            setElectionCandidates(candidates)
            //calculate the total vote count in each election
            for(let i=0; i< candidates.length; i++){
                setTotalVotes(prevState => prevState += candidates[i].voteCount)
            }
        } catch (error) {
            console.log(error)
        }
        setIsLoading(false)
    }

    useEffect(()=>{
        getCandidates()
    },[])
  return (
    <>
        {isLoading && <Loader/>}
        <article className="result">
            <header className="result_header">
                <h4>{title}</h4>
                <div className="result_header-image">
                    <img src={thumbnail} alt={title} />
                </div>
                
            </header>
            <ul className="result_list">
                    {
                        electionCandidates.map(candidate => <CandidateRating key={candidate.id}{...candidate} totalVotes={totalVotes} /> )
                    }
            </ul>
            <Link to={`/elections/${id}/candidates`} className='btn primary full'>Enter Election</Link>
        </article>
    </>
  )
}

export default ResultElection
