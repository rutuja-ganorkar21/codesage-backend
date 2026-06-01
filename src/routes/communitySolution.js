const express = require('express');
const router = express.Router();
const userMiddleware = require('../middleware/userMiddleware');
const {
  getSolutions,
  postSolution,
  likeSolution
} = require('../controllers/communitySolutionController');

router.get('/get/:problemId', userMiddleware, getSolutions);
router.post('/post/:problemId', userMiddleware, postSolution);
router.post('/like/:solutionId', userMiddleware, likeSolution);

module.exports = router;