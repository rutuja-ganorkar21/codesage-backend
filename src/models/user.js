// const mongoose = require('mongoose');
// const {Schema} = mongoose;

// const userSchema = new Schema({
//     firstName:{
//         type: String,
//         required: true,
//         minLength: 3,
//         maxLength: 20
//     },
//     lastName:{
//         type: String,
//         minLength: 3,
//         maxLength: 20   
//     },
//     emailId:{
//         type: String,
//         required: true,
//         unique: true,
//         trim: true,
//         lowercase: true,
//         immutable: true,
//     },
//     age:{
//         type:Number,
//         min:6,
//         max:80
//     },
//     role:{
//         type:String,
//         enum:['user','admin'],
//         default:'user'
//     },
//     problemSolved:{
//         type:[String]
//     },
//     password:{
//         type:String
//     }
// },{
//     timestamps:true,
//     required:true

// });

// const User = mongoose.model("user",userSchema)

// module.exports = User;

const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    firstName:{
        type: String,
        required: true,
        minLength: 3,
        maxLength: 20
    },
    lastName:{
        type: String,
        minLength: 3,
        maxLength: 20   
    },
    emailId:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        immutable: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email']
    },
    age:{
        type:Number,
        min:6,
        max:80
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    },
    problemSolved:{
        type:[{
        type:Schema.Types.ObjectId,
        ref: "Problem",
       }],
       
    },
    password:{
        type:String,
        required:true
    },
    profilePicture: {
        type: String,
        default: "",
    },
},{
    timestamps:true
});

userSchema.post('findOneAndDelete', async function (userInfo) {
    if (userInfo) {
        await mongoose.model('submission').deleteMany({ userId: userInfo._id})
    }
});

const User = mongoose.model("user",userSchema);
module.exports = User;