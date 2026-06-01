const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const communitySolutionSchema = new Schema({
  problemId: {
    type: Schema.Types.ObjectId,
    ref: 'problem',
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  code: {
    type: String,
    required: true
  },
  language: {
    type: String,
    enum: ['javascript', 'java', 'cpp', 'c++'],
    required: true
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'user'
  }],
}, { timestamps: true });

// Ek user ek problem pe ek hi solution post kar sake
communitySolutionSchema.index({ problemId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('CommunitySolution', communitySolutionSchema);