import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { UiActions } from '../store/ui-slice';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { voteActions } from '../store/vote-slice';

const ConfirmVote = ({ selectedElection }) => {
  const [modalCandidate, setModalCandidate] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const selectedVoteCandidate = useSelector(state => state.vote.selectedVoteCandidate);
  const token = useSelector(state => state?.vote?.currentVoter?.token);
  const currentVoter = useSelector(state => state?.vote?.currentVoter);
  const API_URL = import.meta.env.VITE_API_URL;

  const closeCandidateModal = () => {
    dispatch(UiActions.closeVoteCandidateModal());
  };

  const fetchCandidate = async () => {
    try {
      const response = await axios.get(`${API_URL}/candidates/${selectedVoteCandidate}`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      });
      setModalCandidate(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const confirmVote = async () => {
    try {
      const response = await axios.patch(
        `${API_URL}/candidates/${selectedVoteCandidate}`,
        { selectedElection },
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const voteResult = response.data;
      dispatch(voteActions.changeCurrentVoter({ ...currentVoter, votedElection: voteResult }));
      navigate('/congrats');
    } catch (error) {
      console.error(error);
      if (error.response?.status === 403) {
        alert("You have already voted in this election.");
      } else {
        alert("Voting failed. Please try again later.");
      }
    }
    closeCandidateModal();
  };

  useEffect(() => {
    fetchCandidate();
  }, []);

  return (
    <section className="modal">
      <div className="modal_content confirm_vote-content">
        <h5>Please confirm your vote</h5>
        <div className="confirm_vote-image">
          <img src={modalCandidate.image} alt={modalCandidate.fullName} />
        </div>
        <h2>
          {modalCandidate.fullName?.length > 17
            ? modalCandidate.fullName.substring(0, 17) + '...'
            : modalCandidate.fullName}
        </h2>
        <p>
          {modalCandidate.motto?.length > 40
            ? modalCandidate.motto.substring(0, 40) + '...'
            : modalCandidate.motto}
        </p>
        <div className="confirm_vote-cta">
          <button className="btn" onClick={closeCandidateModal}>
            Cancel
          </button>
          <button className="btn primary" onClick={confirmVote}>
            Confirm
          </button>
        </div>
      </div>
    </section>
  );
};

export default ConfirmVote;
