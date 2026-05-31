const express = require('express');
const router = express.Router();
const SavedCode = require('../models/savedCode');
const userMiddleware = require('../middleware/userMiddleware'); // ✅ naam match

router.post('/save', userMiddleware, async (req, res) => {
  const { problemId, language, code } = req.body;
  try {
    await SavedCode.findOneAndUpdate(
      { userId: req.result._id, problemId, language },
      { code, savedAt: new Date() },
      { upsert: true, new: true }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

router.get('/:problemId/:language', userMiddleware, async (req, res) => {
  try {
    const saved = await SavedCode.findOne({
      userId: req.result._id,
      problemId: req.params.problemId,
      language: req.params.language
    });
    res.json({ code: saved?.code || null });
  } catch (err) {
    res.status(500).json({ code: null });
  }
});

module.exports = router; 