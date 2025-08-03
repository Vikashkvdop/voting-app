import React, { useEffect, useState } from 'react'
import { IoMdClose } from 'react-icons/io'
import { useDispatch, useSelector } from 'react-redux'
import { UiActions } from '../store/ui-slice'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const UpdateElectionModal = () => {
    const [title,setTitle]=useState("")
    const [description,setDescription]=useState("")
    const[thumbnail,setThumbnail]=useState("")

    const navigate=useNavigate()
    const dispatch=useDispatch()
    const idOfElectionToUpdate=useSelector(state=>state?.vote?.idOfElectionToUpdate)
    console.log(idOfElectionToUpdate)
    //close add election modal
    const closeModal=()=>{
        dispatch(UiActions.closeUpdateElectionModal())
    }

    
    const token=useSelector(state=>state?.vote?.currentVoter?.token)
    const fetchElection=async ()=>{
        try {
            const response= await axios.get(`${import.meta.env.VITE_API_URL}/election/${idOfElectionToUpdate}`, {withCredentials:true, headers: {Authorization: `Bearer ${token}`}})
            const election= await response.data
            setTitle(election.title)
            setDescription(election.description)
        } catch (error) {
            console.log(error)
        }
    }
    
    useEffect(()=>{
        fetchElection()
    },[])

    const updateElection=async (e)=>{
        e.preventDefault()
        try {
            const electionData=new FormData();
            electionData.set('title',title)
            electionData.set('description',description)
            electionData.set('thumbnail',thumbnail)
            const response=await axios.patch(`${import.meta.env.VITE_API_URL}/elections/${idOfElectionToUpdate}`, electionData, {withCredentials:true, headers: {Authorization: `Bearer ${token}`}})
            closeModal()
            navigate(0)
        } catch (error) {
            console.log(error)
        }
    }
  return (
    <section className="modal">
        <div className="modal_content">
            <header className="modal_header">
                <h4>Edit Election</h4>
                <button className='modal_close' onClick={closeModal}><IoMdClose/> </button>
            </header>
            <form onSubmit={updateElection} >
                <div>
                    <h6>Election Title:</h6>
                    <input type="text" name='title' value={title} onChange={e=>setTitle(e.target.value)} />
                </div>
                <div>
                    <h6>Election Description:</h6>
                    <input type="text" name='description' value={description} onChange={e=>setDescription(e.target.value)} />
                </div>
                <div>
                    <h6>Election Thumbnail</h6>
                    <input type="file" name='thumbnail' onChange={e=>setThumbnail(e.target.files[0])} accept="png jpg jpeg webp avif" />
                </div>
                <button type='submit' className='btn primary' >
                    Update Election</button>
            </form>
        </div>
    </section>
  )
}

export default UpdateElectionModal
