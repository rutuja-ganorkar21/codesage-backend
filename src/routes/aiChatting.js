const express = require('express');
const aiRouter = express.Router();
const userMiddleware = require('../middleware/userMiddleware');
const { solveDoubt, getChatHistory } = require('../controllers/solveDoubt'); 

aiRouter.post('/chat', userMiddleware, solveDoubt);
aiRouter.get('/history/:problemId', userMiddleware, getChatHistory); // new line

module.exports = aiRouter;