// server/models/voterModel.js

import mongoose from 'mongoose';

const { Schema, model, Types } = mongoose;

const voterSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true // good practice to prevent duplicate emails
    },
    password: {
      type: String,
      required: true
    },
    votedElections: [
      {
        type: Types.ObjectId,
        ref: 'Election',
        required: true
      }
    ],
    isAdmin: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const voterModel = model('Voter', voterSchema);

export default voterModel; 
