import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { voteActions } from '../store/vote-slice';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Clear Redux store
    dispatch(voteActions.logout());

    // Remove voter data from localStorage
    localStorage.removeItem("currentUser");

    // Redirect to login page (or change this to '/' for home)
    navigate("/");
  }, [dispatch, navigate]);

  return (
    <div className="logout-message">
      <h2>Logging you out...</h2>
    </div>
  );
};

export default Logout;
