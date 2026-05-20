const express = require("express");
const problemRouter = express.Router();
const adminMiddleware = require("../middleware/adminMiddlware");
const {
  createProblem,
  updateProblem,
  deleteProblem,
  getProblemById,
  getAllProblem,
  solvedProblembyUser,
  submittedProblem,
  
} = require("../controllers/userProblem");
const userMiddleware = require("../middleware/userMiddleware");

problemRouter.post("/create", adminMiddleware, createProblem);
problemRouter.put("/update/:id", adminMiddleware, updateProblem);
problemRouter.delete("/delete/:id", adminMiddleware, deleteProblem);

problemRouter.get("/problemById/:id", userMiddleware, getProblemById);
problemRouter.get("/getAllProblem", userMiddleware, getAllProblem);
problemRouter.get("/problemSolvedByuser", userMiddleware, solvedProblembyUser);
problemRouter.get("/submittedProblem/:pid", userMiddleware, submittedProblem);


module.exports = problemRouter;
