const express = require('express');
const userMiddleware = require('../middleware/userMiddleware');
const submitRouter = express.Router();
const { submitCode, runcode, getUserSubmissions } = require("../controllers/userSubmission");

submitRouter.post("/submit/:id", userMiddleware, submitCode);
submitRouter.post("/runcode/:id", userMiddleware, runcode);
submitRouter.get("/getUserSubmissions", userMiddleware, getUserSubmissions);

module.exports = submitRouter;