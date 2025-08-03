import HttpError from '../models/errorModel.js';
import { v4 as uuid } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

import cloudinary from "../config/Cloudinary.js";
import candidateModel from '../models/candidateModel.js';
import electionModel from '../models/electionModel.js';
import mongoose from 'mongoose';
import voterModel from '../models/voterModel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ADD CANDIDATE
export const addCandidate = async (req, res, next) => {
    try {
        if (!req.user.isAdmin) {
            return next(new HttpError("Only an admin can perform this action", 403));
        }

        const { fullName, motto, currentElection } = req.body;
        if (!fullName || !motto || !currentElection) {
            return next(new HttpError("All fields are required", 422));
        }

        if (!req.files || !req.files.image) {
            return next(new HttpError("Choose an image", 422));
        }

        const { image } = req.files;
        if (image.size > 10 * 1024 * 1024) {
            return next(new HttpError("File size should be less than 10MB", 422));
        }

        // Save image temporarily
        let fileName = image.name;
        const ext = fileName.split('.').pop();
        fileName = fileName.split('.')[0] + uuid() + '.' + ext;
        const uploadPath = path.join(__dirname, '..', 'uploads', fileName);

        await new Promise((resolve, reject) => {
            image.mv(uploadPath, (err) => {
                if (err) reject(new HttpError("Image upload failed", 500));
                else resolve();
            });
        });

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(uploadPath, {
            resource_type: "image",
        });

        // Delete local temp image
        fs.unlinkSync(uploadPath);

        if (!result.secure_url) {
            return next(new HttpError("Image upload to Cloudinary failed", 500));
        }

        // Start transaction
        const sess = await mongoose.startSession();
        sess.startTransaction();

        // Create candidate
        const newCandidate = new candidateModel({
            fullName,
            motto,
            image: result.secure_url,
            election: currentElection
        });

        await newCandidate.save({ session: sess });

        // Add candidate to election
        const election = await electionModel.findById(currentElection).session(sess);
        if (!election) {
            await sess.abortTransaction();
            return next(new HttpError("Election not found", 404));
        }

        election.candidates.push(newCandidate._id);
        await election.save({ session: sess });

        await sess.commitTransaction();
        sess.endSession();

        res.status(201).json("Candidate added successfully.");
    } catch (error) {
        return next(new HttpError(error.message || "Server error", 500));
    }
};








// GET CANDIDATE
export const getCandidate = async (req, res, next) => {
    try {
        const { id } = req.params;
        console.log("Received candidate ID:", id);

        const candidate = await candidateModel.findById(id);

        if (!candidate) {
            return next(new HttpError("Candidate not found", 404));
        }

        res.status(200).json(candidate);
    } catch (error) {
        return next(new HttpError(error.message || "Fetching candidate failed", 500));
    }
};









//  REMOVE CANDIDATE
export const removeCandidate = async (req, res, next) => {
    try {
        if (!req.user.isAdmin) {
            return next(new HttpError("Only admin can remove candidate", 403));
        }

        const { id } = req.params;
        const currentCandidate = await candidateModel.findById(id).populate('election');
        if (!currentCandidate) {
            return next(new HttpError("Candidate not found", 404));
        }

        const sess = await mongoose.startSession();
        sess.startTransaction();

        await currentCandidate.deleteOne({ session: sess });
        currentCandidate.election.candidates.pull(currentCandidate._id);
        await currentCandidate.election.save({ session: sess });

        await sess.commitTransaction();
        sess.endSession();

        res.status(200).json("Candidate deleted successfully.");
    } catch (error) {
        return next(new HttpError(error.message || "Candidate deletion failed", 500));
    }
};








//  VOTE CANDIDATE
export const voteCandidate = async (req, res, next) => {
    try {
        const { id: candidateId } = req.params;
        const { selectedElection } = req.body;

        const sess = await mongoose.startSession();
        sess.startTransaction();

        // Get voter in session
        const voter = await voterModel.findById(req.user.id).session(sess);
        if (!voter) {
            await sess.abortTransaction();
            return next(new HttpError("Voter not found", 404));
        }

        // Check if already voted
        if (voter.votedElections.includes(selectedElection)) {
            await sess.abortTransaction();
            return next(new HttpError("You have already voted in this election", 403));
        }

        const candidate = await candidateModel.findById(candidateId).session(sess);
        if (!candidate) {
            await sess.abortTransaction();
            return next(new HttpError("Candidate not found", 404));
        }

        const election = await electionModel.findById(selectedElection).session(sess);
        if (!election) {
            await sess.abortTransaction();
            return next(new HttpError("Election not found", 404));
        }

        // Record vote
        candidate.voteCount += 1;
        election.voters.push(voter._id);
        voter.votedElections.push(election._id);

        await candidate.save({ session: sess });
        await election.save({ session: sess });
        await voter.save({ session: sess });

        await sess.commitTransaction();
        sess.endSession();

        res.status(200).json(voter.votedElections);
    } catch (error) {
        return next(new HttpError(error.message || "Voting failed", 500));
    }
};

