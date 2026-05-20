const express = require('express');
const adminMiddleware = require('../middleware/adminMiddlware');
const vedioRouter = express.Router();
const {generateUploadSignature, saveVedioMetadata, deleteVedio} = require("../controllers/vedioSection")


vedioRouter.get("/create/:problemId",adminMiddleware,generateUploadSignature);
vedioRouter.post("/save",adminMiddleware,saveVedioMetadata);
vedioRouter.delete("/delete/:problemId",adminMiddleware,deleteVedio);

module.exports = vedioRouter;