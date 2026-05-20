const express = require('express');
const aiRouter = express.Router();  // router → aiRouter
const userMiddleware = require('../middleware/userMiddleware');
const { solveDoubt } = require('../controllers/solveDoubt'); 

aiRouter.post('/chat', userMiddleware, solveDoubt);

module.exports = aiRouter;