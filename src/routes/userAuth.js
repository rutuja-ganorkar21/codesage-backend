const express = require('express');

const authRouter = express.Router();
const {register, login, logout, adminRegister, deleteProfile} = require('../controllers/userAuthent')
const userMiddleware = require('../middleware/userMiddleware');
const adminMiddleware = require('../middleware/adminMiddlware'); 
const { generateProfilePicSignature, saveProfilePicture, deleteProfilePicture } = require("../controllers/userSubmission");






authRouter.post('/register',register);
authRouter.post('/login',login);
authRouter.post('/logout',userMiddleware ,logout);
authRouter.post('/admin/register',adminMiddleware ,adminRegister);
authRouter.delete('/deleteProfile', userMiddleware, deleteProfilePicture);
authRouter.get('/check',userMiddleware,(req,res)=>{
    const reply ={
        firstName: req.result.firstName,
        emailId: req.result.emailId,
        _id: req.result._id,
        role:req.result.role,
        profilePicture: req.result.profilePicture, 
        createdAt: req.result.createdAt,
    }
    res.status(200).json({
        user: reply,
        message: "Valid User"
    });
})

authRouter.get("/profile-pic-signature", userMiddleware, generateProfilePicSignature);
authRouter.post("/save-profile-picture", userMiddleware, saveProfilePicture);
authRouter.delete("/delete-profile-picture", userMiddleware, deleteProfilePicture); 


// authRouter.get('getProfile',getProfile)


module.exports = authRouter;
