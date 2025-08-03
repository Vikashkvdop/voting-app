import HttpError from "../models/errorModel.js";
import voterModel from "../models/voterModel.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

export const registerVoter = async (req, res, next) => {
  try {
    const { fullName, email, password, confirmPassword } = req.body;

    if (!fullName || !email || !password || !confirmPassword) {
      return next(new HttpError("All fields are required", 422));
    }

    const newEmail = email.toLowerCase();
    const emailExists = await voterModel.findOne({ email: newEmail });
    if (emailExists) {
      return next(new HttpError("Email already exists.", 422));
    }

    if (password.trim().length < 6) {
      return next(new HttpError("Password should be at least 6 characters", 422));
    }

    if (password !== confirmPassword) {
      return next(new HttpError("Password and confirm password must match", 422));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const isAdmin = newEmail === "vkvikash2225@gmail.com";

    const newVoter = await voterModel.create({
      fullName,
      email: newEmail,
      password: hashedPassword,
      isAdmin
    });

    //console.log(newVoter);
    res.status(201).json({ message: `New voter ${fullName} created.` });

  } catch (error) {
    return next(new HttpError("Voter registration failed.", 500));
  }
};



//function to generate json web token
const generateToken=(payload)=>{
    const token=jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"3d"})
    return token;
}
export const loginVoter=async (req,res,next)=>{
    try {
        const {email,password}=req.body;
        if(!email || !password){
            return next(new HttpError("All fields are required",422))
        }
        const newEmail=email.toLowerCase()
        const voter=await voterModel.findOne({email:newEmail})
        if(!voter){
            return next(new HttpError("Invalid credentail.", 422))
        }
        //compare password
        const comparePass=await bcrypt.compare(password,voter.password)
        if(!comparePass){
            return next(new HttpError("Invalid credentails.",422))
        }
        const {_id: id,isAdmin,votedElections}=voter;
        const token=generateToken({id,isAdmin})
        res.json({token,id,votedElections,isAdmin})
    } catch (error) {
        return next(new HttpError("Login failed. Try again later",422))
    }
}


export const getVoter=async(req,res,next)=>{
  try {
    const {id}=req.params;
    const voter=await voterModel.findById(id).select("-password")
    res.json(voter)
  } catch (error) {
    return next(new HttpError("Couldn't get voter",404))
  }
}