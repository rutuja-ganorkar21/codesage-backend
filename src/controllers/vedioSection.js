const cloudinary = require('cloudinary').v2;
const Problem = require("../models/problem");
const User = require("../models/user");
const SolutionVedio = require("../models/solutionVedio");


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const generateUploadSignature = async (req, res) => {
    try {
        const {problemId} = req.params;

        const userId = req.result._id;
        //verify problem exist
        const problem = await Problem.findById(problemId);
        if (!problem) {
            return res.status(404).json({error : 'Problem not found '});

        }

        //Generate unique public_id for the vedio
        const timestamp = Math.round(new Date().getTime() / 1000);
        const publicId = `leetcode-solutions/${problemId}/${userId}_${timestamp}`;

        //Upload parameters
        const uploadParams = {
            timestamp: timestamp,
            public_id: publicId,
        }

        //Generate signature
        const signature = cloudinary.utils.api_sign_request(
           uploadParams, process.env.CLOUDINARY_API_SECRET
        );

        res.json({
            signature,
            timestamp,
            public_Id: publicId,
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            apiKey: process.env.CLOUDINARY_API_KEY,
            upload_url: `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/video/upload`,
        }); 
    }
    catch (error) {
        console.error('Error generating upload signature:', error);
        res.status(500).json({error: 'Failed to generate upload credentials'});
    }
};


const saveVedioMetadata = async (req, res) => {
  try {
    const {
      problemId,
      cloudinaryPublicId,
      cloudinaryUrl,
      secureUrl,
      duration,
    } = req.body;

    const userId = req.result._id;

    // Check if video already exists
    const existingVedio = await SolutionVedio.findOne({
      problemId,
      userId,
    });

    if (existingVedio) {
      return res.status(400).json({ error: "A video already exists for this problem" });
    }

    // Thumbnail generate karo
    const thumbnailUrl = cloudinary.url(cloudinaryPublicId, {
      resource_type: "video",
      transformation: [
        { width: 400, height: 225, crop: "fill" },
        { quality: "auto" },
        { start_offset: "auto" },
      ],
      format: "jpg",
    });

    // Save to DB
    const vedioSolution = await SolutionVedio.create({
      problemId,
      userId,
      cloudinaryPublicId,
      secureUrl,
      duration,
      thumbnailUrl,
    });

    res.status(201).json({
      message: "Video metadata saved successfully",
      vedioSolution: {
        id: vedioSolution._id,
        thumbnailUrl: vedioSolution.thumbnailUrl,
        duration: vedioSolution.duration,
        createdAt: vedioSolution.createdAt,
      },
    });

  } catch (error) {
    console.error("Error saving vedio metadata:", error);
    res.status(500).json({ error: "Failed to save vedio metadata" });
  }
};


const deleteVedio = async (req, res) => {
  try {
    const { problemId } = req.params;

    const vedioSolution = await SolutionVedio.findOne({ problemId });

    if (!vedioSolution) {
      return res.status(404).json({ error: "No video found for this problem" }); // ← .json() hona chahiye
    }

    await cloudinary.uploader.destroy(
      vedioSolution.cloudinaryPublicId,
      { resource_type: "video", invalidate: true }
    );

    await SolutionVedio.findOneAndDelete({ problemId });

    res.json({ message: "Video deleted successfully" });

  } catch (error) {
    console.error("Error deleting video:", error);
    res.status(500).json({ error: "Failed to delete video" }); // ← .json() hona chahiye
  }
};


module.exports = {generateUploadSignature, saveVedioMetadata, deleteVedio};
