const { getLanguageById, submitBatch } = require("../utils/ProblemUtility");
const Problem = require("../models/Problem");
const mongoose = require("mongoose");
const axios = require("axios");
const User = require("../models/user");
const Submission = require("../models/submission");
const SolutionVedio = require("../models/solutionVedio");

const createProblem = async (req, res) => {
  try {
    const {
      title,
      description,
      difficulty,
      tags,
      visibleTestCases,
      hiddenTestCases,
      startCode,
      referenceSolution,
      editorial,
    } = req.body;

    if (!Array.isArray(referenceSolution)) {
      return res.status(400).json({
        message: "referenceSolution must be array",
      });
    }

    if (!Array.isArray(visibleTestCases)) {
      return res.status(400).json({
        message: "visibleTestCases must be array",
      });
    }

    for (const { language, completeCode } of referenceSolution) {
      if (!completeCode) {
        return res.status(400).json({
          message: "completeCode missing in referenceSolution",
        });
      }

      const languageId = getLanguageById(language);

      const submissions = visibleTestCases.map((testcase) => ({
        source_code: completeCode,
        language_id: languageId,
        stdin: testcase.input,
        expected_output: testcase.output,
      }));

      const submitResult = await submitBatch(submissions);
    }

    const normalizedSolutions = referenceSolution.map((s) => ({
      language: s.language.toLowerCase().trim(),
      completeCode: s.completeCode,
    }));

    const normalizedStartCode = startCode.map((s) => ({
      language: s.language.toLowerCase().trim(),
      initialCode: s.initialCode,
    }));

    //  create problem
    const userProblem = await Problem.create({
      title,
      description,
      difficulty,
      tags,
      visibleTestCases,
      hiddenTestCases,
      startCode: normalizedStartCode,
      referenceSolution: normalizedSolutions,
      editorial,
      problemCreater: req.result._id, // ✅ FIXED
    });

    return res.status(201).send({
      message: "Problem Saved Successfully",
    });
  } catch (err) {
    console.error("FULL ERROR:", err);

    return res.status(500).json({
      message: err.message,
      error: err,
    });
  }
};

const updateProblem = async (req, res) => {
  const { id } = req.params;
  const { visibleTestCases, referenceSolution } = req.body;

  try {
    if (!id) return res.status(400).send("Missing Id Field");

    const DsaProblem = await Problem.findById(id);
    if (!DsaProblem) return res.status(404).send("ID is not present in server");

    for (const { language, completeCode } of referenceSolution) {
      const languageId = getLanguageById(language);

      const submissions = visibleTestCases.map((testcase) => ({
        source_code: completeCode,
        language_id: languageId,
        stdin: testcase.input,
        expected_output: testcase.output,
      }));

      const results = await submitBatch(submissions);

      for (const test of results) {
        if (test.status?.id !== 3) {
          return res.status(400).json({
            message: `Test case failed: ${test.status?.description}`,
            stderr: test.stderr,
            compile_output: test.compile_output,
          });
        }
      }
    }

    const normalizedSolutions = referenceSolution.map((s) => ({
      language: s.language.toLowerCase().trim(),
      completeCode: s.completeCode,
    }));

    const normalizedStartCode = req.body.startCode?.map((s) => ({
      language: s.language.toLowerCase().trim(),
      initialCode: s.initialCode,
    }));

    const newProblem = await Problem.findByIdAndUpdate(
      id,
      {
        ...req.body,
        referenceSolution: normalizedSolutions,
        startCode: normalizedStartCode,
      },
      { runValidators: true, new: true },
    );

    res.status(200).send(newProblem);
  } catch (err) {
    console.error("UpdateProblem Error:", err);
    res.status(500).send("Error: " + err.message);
  }
};

const deleteProblem = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) return res.status(400).send("ID is Missing");

    const deletedProblem = await Problem.findByIdAndDelete(id);

    if (!deletedProblem) return res.status(500).send("Problem is Missing");

    res.status(200).send("Successfully Deleted");
  } catch (err) {
    res.status(500).send("Error " + err);
  }
};

const getProblemById = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) return res.status(400).send("ID is Missing");

    const getProblem = await Problem.findById(id).select(
      "_id title description difficulty tags visibleTestCases startCode referenceSolution editorial",
    );

    if (!getProblem) return res.status(404).send("Problem is Missing");

    const vedio = await SolutionVedio.findOne({ problemId: id });

    const responseData = {
      ...getProblem.toObject(),
      vedios: vedio
        ? [
            {
              secureUrl: vedio.secureUrl,
              thumbnailUrl: vedio.thumbnailUrl,
              duration: vedio.duration,
            },
          ]
        : [],
    };

    res.status(200).json(responseData);
  } catch (err) {
    console.error("getProblemById ERROR:", err);
    res.status(500).send("Error " + err);
  }
};

const getAllProblem = async (req, res) => {
  try {
    const getProblem = await Problem.find({}).select(
      "_id title difficulty tags",
    );

    if (getProblem.length === 0)
      return res.status(404).send("No Problems Found");

    res.status(200).send(getProblem);
  } catch (err) {
    res.status(500).send("Error " + err);
  }
};

const solvedProblembyUser = async (req, res) => {
  try {
    const userId = req.result._id;

    const user = await User.findById(userId).populate({
      path: "problemSolved",
      select: "_id title difficulty tags",
    });
    res.status(200).send(user.problemSolved);
  } catch (err) {
    console.error("solvedProblembyUser Error:", err);
    res.status(500).send("Server Error");
  }
};

const submittedProblem = async (req, res) => {
  try {
    const userId = req.result._id;
    const problemId = req.params.pid;

    const ans = await Submission.find({ userId, problemId }).sort({
      createdAt: -1,
    });
    if (ans.length == 0) return res.status(200).send([]);

    return res.status(200).send(ans);
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  createProblem,
  updateProblem,
  deleteProblem,
  getProblemById,
  getAllProblem,
  solvedProblembyUser,
  submittedProblem,
};
