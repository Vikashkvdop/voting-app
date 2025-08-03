import { Router } from 'express';
import { getVoter, loginVoter, registerVoter }  from '../controllers/voterController.js'
import { addElection, getCandidatesOfElection, getElection, getElections, getElectionVoters, removeElection, updateElection } from '../controllers/electionController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { addCandidate, getCandidate, removeCandidate, voteCandidate } from '../controllers/candidateController.js';

const router=Router()


router.post('/voters/register',registerVoter);
router.post('/voters/login',loginVoter);
router.get('voters/:id',authMiddleware,getVoter);


router.post('/elections',authMiddleware, addElection)
router.get('/elections',authMiddleware, getElections)
router.get('/election/:id',authMiddleware,getElection)
router.delete('/elections/:id',authMiddleware,removeElection)
router.patch("/elections/:id",authMiddleware,updateElection)
router.get('/elections/:id/candidates',authMiddleware, getCandidatesOfElection)
router.get('/elections/:id/voters',authMiddleware, getElectionVoters)



router.post('/candidates',authMiddleware,addCandidate)
router.get('/candidates/:id',authMiddleware,getCandidate)
router.delete('/candidates/:id',authMiddleware, removeCandidate)
router.patch('/candidates/:id',authMiddleware,voteCandidate)
export default router