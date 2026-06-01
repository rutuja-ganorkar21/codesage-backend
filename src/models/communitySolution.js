const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const communitySolutionSchema = new Schema({
  problemId: {
    type: Schema.Types.ObjectId,
    ref: 'Problem',
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
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
    ref: 'User'
  }],
}, { timestamps: true });

module.exports = mongoose.model('CommunitySolution', communitySolutionSchema);