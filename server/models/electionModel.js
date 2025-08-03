import mongoose from 'mongoose'
const{Schema,model,Types}=mongoose;

const electionSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    thumbnail:{
        type:String,
        required:true
    },
    candidates:[{type:Types.ObjectId,
        required:true
    }],
    voters:[{type:Types.ObjectId,
        required:true,
        ref:"Voter"
    }]
})

const electionModel=model("Election",electionSchema)
export default electionModel