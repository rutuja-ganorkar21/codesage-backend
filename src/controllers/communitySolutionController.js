const CommunitySolution = require('../models/communitySolution');
const Submission = require('../models/submission');

const getSolutions = async (req, res) => {
  try {
    const solutions = await CommunitySolution.find({
      problemId: req.params.problemId
    })
    .populate('userId', 'firstName lastName profilePicture')
    .sort({ createdAt: -1 });

    res.json({ success: true, solutions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const postSolution = async (req, res) => {
  try {
    const { code, language } = req.body;
    const userId = req.result._id;

    const acceptedSubmission = await Submission.findOne({
      problemId: req.params.problemId,
      userId: userId,
      status: 'accepted'
    });

    if (!acceptedSubmission) {
      return res.status(403).json({
        success: false,
        message: 'Pehle problem solve karo!'
      });
    }

    const alreadyPosted = await CommunitySolution.findOne({
      problemId: req.params.problemId,
      userId: userId
    });

    if (alreadyPosted) {
      return res.status(400).json({
        success: false,
        message: 'Tumne already solution post kiya hai!'
      });
    }

    const solution = await CommunitySolution.create({
      problemId: req.params.problemId,
      userId: userId,
      code,
      language
    });

    res.json({ success: true, solution });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const likeSolution = async (req, res) => {
  try {
    const solution = await CommunitySolution.findById(req.params.solutionId);

    if (!solution) {
      return res.status(404).json({ success: false, message: 'Solution nahi mila!' });
    }

    const userId = req.result._id;
    const alreadyLiked = solution.likes.some(
      id => id.toString() === userId.toString()
    );

    if (alreadyLiked) {
      solution.likes = solution.likes.filter(
        id => id.toString() !== userId.toString()
      );
    } else {
      solution.likes.push(userId);
    }

    await solution.save();
    res.json({ success: true, likes: solution.likes.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getSolutions, postSolution, likeSolution };