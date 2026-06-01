const mongoose = require('mongoose')

const chatHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  problemId: { type: mongoose.Schema.Types.ObjectId, required: true },
  messages: [
    {
      role: { type: String, enum: ['user', 'model'] },
      parts: [{ text: String }]
    }
  ]
}, { timestamps: true })


chatHistorySchema.index({ createdAt: 1 }, { expireAfterSeconds: 604800 })

module.exports = mongoose.model('ChatHistory', chatHistorySchema);