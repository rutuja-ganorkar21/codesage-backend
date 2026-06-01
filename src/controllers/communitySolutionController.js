const CommunitySolution = require('../models/communitySolution');
const Submission = require('../models/submission');

// GET — saare community solutions fetch karo
const getSolutions = async (req, res) => {
  try {
    const solutions = await CommunitySolution.find({
      problemId: req.params.problemId
    })
    .populate('userId', 'name email')
    .sort({ createdAt: -1 });

    res.json({ success: true, solutions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST — solution post karo (sirf accepted users)
const postSolution = async (req, res) => {
  try {
    const { code, language } = req.body;

    // Check — user ne problem accept kiya hai?
    const acceptedSubmission = await Submission.findOne({
      problemId: req.params.problemId,
      userId: req.user.id,
      status: 'accepted'
    });

    if (!acceptedSubmission) {
      return res.status(403).json({
        success: false,
        message: 'Pehle problem solve karo!'
      });
    }

    // Check — already post kiya hai?
    const alreadyPosted = await CommunitySolution.findOne({
      problemId: req.params.problemId,
      userId: req.user.id
    });

    if (alreadyPosted) {
      return res.status(400).json({
        success: false,
        message: 'Tumne already solution post kiya hai!'
      });
    }

    const solution = await CommunitySolution.create({
      problemId: req.params.problemId,
      userId: req.user.id,
      code,
      language
    });

    res.json({ success: true, solution });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST — like/unlike toggle
const likeSolution = async (req, res) => {
  try {
    const solution = await CommunitySolution.findById(req.params.solutionId);

    if (!solution) {
      return res.status(404).json({ success: false, message: 'Solution nahi mila!' });
    }

    const alreadyLiked = solution.likes.includes(req.user.id);

    if (alreadyLiked) {
      solution.likes = solution.likes.filter(
        id => id.toString() !== req.user.id.toString()
      );
    } else {
      solution.likes.push(req.user.id);
    }

    await solution.save();
    res.json({ success: true, likes: solution.likes.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getSolutions, postSolution, likeSolution };