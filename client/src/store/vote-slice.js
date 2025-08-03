import { createSlice } from "@reduxjs/toolkit";

let currentVoter = null;

try {
  const raw = localStorage.getItem("currentUser");
  if (raw && raw !== "undefined") {
    currentVoter = JSON.parse(raw);
  }
} catch (err) {
  console.error("Failed to parse currentUser from localStorage:", err);
  currentVoter = null;
}

const initialState = {
  selectedVoteCandidate: "",
  currentVoter,
  selectedElection: "",
  idOfElectionToUpdate: "",
  addCandiateElectionId: ""
};

const voteSlice = createSlice({
  name: "vote",
  initialState,
  reducers: {
    changeSelectedVoteCandidate(state, action) {
      state.selectedVoteCandidate = action.payload;
    },
    changeCurrentVoter(state, action) {
      state.currentVoter = action.payload;
    },
    changeSelectedElection(state, action) {
      state.selectedElection = action.payload;
    },
    changeIdOfElectionToUpdate(state, action) {
      state.idOfElectionToUpdate = action.payload;
    },
    changeAddCandidateElectionId(state, action) {
      state.addCandiateElectionId = action.payload;
    },
    logout(state) {
      state.selectedVoteCandidate = "";
      state.currentVoter = null;
      state.selectedElection = "";
      state.idOfElectionUpdate = "";
      state.addCandiateElectionId = "";
    }
  }
});

export const voteActions = voteSlice.actions;
export default voteSlice;
