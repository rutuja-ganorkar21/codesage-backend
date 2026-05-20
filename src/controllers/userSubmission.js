// const { request } = require("express");
const Problem = require("../models/Problem");
const Submission = require("../models/submission");
const { getLanguageById, submitBatch } = require("../utils/ProblemUtility");
const cloudinary = require('cloudinary').v2;
const User = require("../models/user");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const submitCode = async (req, res) => {
  try {
    const userId = req.result._id;
    const problemId = req.params.id;

    let { code, language } = req.body;

    if (!userId || !code || !problemId || !language)
      return res.status(400).send("Some field is missing");

    if (language === "cpp") language = "c++";

    // fetch the problem from database
    const dsaProblem = await Problem.findById(problemId);

    //testcases hidden

    const submittedResult = await Submission.create({
      userId,
      problemId,
      code,
      language,
      status: "pending",
      testCasesTotal: dsaProblem.hiddenTestCases.length,
    });

    //Judge0 code ko submit karna hai

    const languageId = getLanguageById(language);

    const submissions = dsaProblem.hiddenTestCases.map((testcase) => ({
      source_code: code,
      language_id: languageId,
      stdin: testcase.input,
      expected_output: testcase.output,
    }));

    const testResult = await submitBatch(submissions);

    //submittedResult ko update karo
    let testCasesPassed = 0;
    let runtime = 0;
    let memory = 0;
    let status = "accepted";
    let errorMessage = null;

    for (const test of testResult) {
      if (test.status?.id == 3) {
        testCasesPassed++;
        runtime = runtime + parseFloat(test.time);
        memory = Math.max(memory, test.memory);
      } else {
        if (test.status?.id == 4) {
          status = "error";
          errorMessage = test.stderr;
        } else {
          status = "wrong";
          errorMessage = test.stderr;
        }
      }
    }

    //   store the result in database
    submittedResult.status = status;
    submittedResult.testCasesPassed = testCasesPassed;
    submittedResult.errorMessage = errorMessage;
    submittedResult.runtime = runtime;
    submittedResult.memory = memory;

    await submittedResult.save();

    //problemId ko insert karenge userschema ke problem solve ,mein if it is not present there
    // if(!req.result.problemSolved.includes(problemId)){
    // req.result.problemSolved.push(problemId);
    // await req.result.save();
    //}
    if (status === "accepted") {
      const alreadySolved = req.result.problemSolved.some(
        (id) => id.toString() === problemId.toString(),
      );

      if (!alreadySolved) {
        req.result.problemSolved.push(problemId);
        await req.result.save();
      }
    }
    res.status(201).send(submittedResult);
  } catch (err) {
    res.status(500).send("Internal Server Error" + err);
  }
};

const runcode = async (req, res) => {
  try {
    const userId = req.result._id;
    const problemId = req.params.id;
    let { code, language } = req.body;

    if (language === "cpp") language = "c++";

    if (!userId || !code || !problemId || !language)
      return res.status(400).send("Some field is missing");

    // fetch the problem from database
    const dsaProblem = await Problem.findById(problemId);

    //Judge0 code ko submit karna hai

    const languageId = getLanguageById(language);

    if (
      !dsaProblem.visibleTestCases ||
      dsaProblem.visibleTestCases.length === 0
    )
      return res
        .status(400)
        .json({ error: "No visible test cases found for this problem" });

    if (!dsaProblem.hiddenTestCases || dsaProblem.hiddenTestCases.length === 0)
      return res
        .status(400)
        .json({ error: "No hidden test cases found for this problem" });

    const submissions = dsaProblem.visibleTestCases.map((testcase) => ({
      source_code: code,
      language_id: languageId,
      stdin: testcase.input,
      expected_output: testcase.output,
    }));

    const testResult = await submitBatch(submissions);

    res.status(201).send(testResult);
  } catch (err) {
    res.status(500).send("Internal Server Error" + err);
  }
};


// 1. Signature generate karo
const generateProfilePicSignature = async (req, res) => {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const userId = req.result._id;

    const publicId = `codesage/profiles/${userId}_${timestamp}`;

    const uploadParams = {
      timestamp,
      public_id: publicId,
    };

    const signature = cloudinary.utils.api_sign_request(
      uploadParams,
      process.env.CLOUDINARY_API_SECRET
    );

    res.json({
      signature,
      timestamp,
      public_id: publicId,
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      upload_url: `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
    });
  } catch (err) {
    console.error("Signature error:", err);
    res.status(500).json({ message: "Failed to generate signature" });
  }
};

// 2. URL save karo
const saveProfilePicture = async (req, res) => {
  try {
    const { secureUrl } = req.body;

    if (!secureUrl) return res.status(400).json({ message: "URL is required" });

    const user = await User.findByIdAndUpdate(
      req.result._id,
      { profilePicture: secureUrl },
      { new: true }
    );

    res.status(200).json({
      message: "Profile picture updated",
      profilePicture: user.profilePicture,
      user,
    });
  } catch (err) {
    console.error("Save error:", err);
    res.status(500).json({ message: "Save failed", error: err.message });
  }
};

const getUserSubmissions = async (req, res) => {
  try {
    const userId = req.result._id;

    const submissions = await Submission.find({ userId })
      .populate({
        path: "problemId",
        model: Problem,        // ← string nahi, direct model
        select: "title difficulty"
      })
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json(submissions);
  } catch (err) {
    console.error("SUBMISSION ERROR:", err);
    res.status(500).json({ message: "Failed to fetch submissions", error: err.message });
  }
};

// Delete profile picture
const deleteProfilePicture = async (req, res) => {
  try {
    const user = await User.findById(req.result._id);
    if (user.profilePicture) {
      const urlParts = user.profilePicture.split("/");
      const uploadIndex = urlParts.indexOf("upload");
      const publicId = urlParts
        .slice(uploadIndex + 2)  // v123 version skip
        .join("/")
        .replace(/\.[^/.]+$/, ""); // .jpg/.png remove
      await cloudinary.uploader.destroy(publicId);
    }
    await User.findByIdAndUpdate(req.result._id, { profilePicture: "" });
    res.status(200).json({ message: "Profile picture deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
};

// module.exports mein add karo:

module.exports = { submitCode, runcode, generateProfilePicSignature, saveProfilePicture, getUserSubmissions, deleteProfilePicture };
