const mongoose = require('mongoose');

const savedCodeSchema = new mongoose.Schema({
  userId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  problemId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Problem', required: true },
  language:   { type: String, required: true },
  code:       { type: String, required: true },
  savedAt:    { type: Date, default: Date.now, expires: 60 * 60 * 24 * 10 } // 10 din TTL
});


savedCodeSchema.index({ userId: 1, problemId: 1, language: 1 }, { unique: true });

module.exports = mongoose.model('SavedCode', savedCodeSchema);