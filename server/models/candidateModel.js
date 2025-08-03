
import mongoose from 'mongoose'
const {Schema,model,Types}=mongoose

const candidateSchema=new Schema({
    fullName:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    voteCount:{
        type:Number,
        default:0
    },
    election:{
        type:Types.ObjectId,
        required:true,
        ref:"Election"
    }
})

const candidateModel=model("Candidate",candidateSchema)

export default candidateModel;