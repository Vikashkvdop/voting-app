import HttpError from '../models/errorModel.js';
import { v4 as uuid } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url'; 

import cloudinary from "../config/Cloudinary.js";
import electionModel from "../models/electionModel.js";
import candidateModel from '../models/candidateModel.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Add election
export const addElection = async (req, res, next) => {
    try {
        //only admin can add election
        if(!req.user.isAdmin){
            return next(new HttpError("Only admin can add election",403))
        }
        const { title, description } = req.body;

        if (!title || !description) {
            return next(new HttpError("All fields are required", 422));
        }

        if (!req.files || !req.files.thumbnail) {
            return next(new HttpError("Choose a thumbnail", 422));
        }

        const { thumbnail } = req.files;

        
        if (thumbnail.size > 10 * 1024 * 1024) { // 10MB = 10 * 1024 * 1024
            return next(new HttpError("File size should be less than 10MB", 422));
        }

        // Rename image
        let fileName = thumbnail.name;
        const ext = fileName.split('.').pop();
        fileName = fileName.split('.')[0] + uuid() + '.' + ext;

        const uploadPath = path.join(__dirname, '..', 'uploads', fileName);

        // Upload to local server
        await thumbnail.mv(uploadPath, async (err) => {
            if (err) {
                return next(new HttpError(err.message || "File upload failed", 500));
            }

            try {
                // Upload to Cloudinary
                const result = await cloudinary.uploader.upload(uploadPath, {
                    resource_type: "image"
                });

                if (!result.secure_url) {
                    return next(new HttpError("Couldn't upload image to Cloudinary", 422));
                }

                // Save election to DB
                const newElection = await electionModel.create({
                    title,
                    description,
                    thumbnail: result.secure_url
                });

                res.json(newElection);
            } catch (cloudErr) {
                return next(new HttpError(cloudErr.message || "Cloudinary error", 500));
            }
        });
    } catch (error) {
        return next(new HttpError(error.message || "Server error", 500));
    }
};


export const getElections=async(req,res,next)=>{
    try {
        const elections=await electionModel.find();
        res.status(200).json(elections)
    } catch (error) {
        return next(new HttpError(error))
    }
}

export const getElection=async (req,res,next)=>{
    try {
        const {id}=req.params;
        const election=await electionModel.findById(id)
        res.status(200).json(election)
    } catch (error) {
        return next(new HttpError(error))
    }
}

export const getCandidatesOfElection=async(req,res,next)=>{
    try {
        const {id}=req.params;
        const candidates=await candidateModel.find({election:id})
        res.status(200).json(candidates)
    } catch (error) {
        return next(new HttpError(error))
    }
}


export const getElectionVoters=async (req,res,next)=>{
    try {
        const {id}=req.params;
        const response=await electionModel.findById(id).populate('voters')
        res.status(200).json(response.voters)
    } catch (error) {
        return next(new HttpError(error))
    }
}







export const updateElection=async (req,res,next)=>{
    try {
        //only admin can update election
        if(!req.user.isAdmin){
            return next(new HttpError("Only admin can add election",403))
        }
        const {id}=req.params;
        const {title,description}=req.body;
        if (!title || !description) {
            return next(new HttpError("All fields are required",422))
        }
        if(req.files.thumbnail){
            const {thumbnail}=req.files;
            if (thumbnail.size > 10 * 1024 * 1024) { // 10MB = 10 * 1024 * 1024
                return next(new HttpError("File size should be less than 10MB", 422));
            }
            //rename the image
            let fileName=thumbnail.name;
            fileName=fileName.split(".")
            fileName=fileName[0]+uuid()+"."+fileName[fileName.length-1]
            thumbnail.mv(path.join(__dirname,"..",'uploads',fileName),async(err)=>{
                if(err){
                    return next(new HttpError(err))
                }
                //store image on cloudinary
                const result=await cloudinary.uploader.upload(path.join(__dirname,'..','uploads',fileName),{resource_type:'image'})
                //check if cloudinary storage was successful
                if(!result.secure_url){
                    return next(new HttpError("Failed upload",422))
                }
                await electionModel.findByIdAndUpdate(id,{title,description,thumbnail:result.secure_url})
                res.json("Election updated successfuly",200)
            })
        }
    } catch (error) {
        return next(new HttpError(error))
    }
}



export const removeElection=async(req,res,next)=>{
    try {
        //only admin can delete election
        if(!req.user.isAdmin){
            return next(new HttpError("Only admin can add election",403))
        }

        const {id}=req.params;
        await electionModel.findByIdAndDelete(id);
        //delete candidates that belong to this election
        await candidateModel.deleteMany({election:id})
        res.status(200).json("Election deleted successfully")
    } catch (error) {
        return next(new HttpError(error))
    }
}