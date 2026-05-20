// const mongoose = require("mongoose");
// const { Schema } = mongoose;

// const problemSchema = new Schema({
//   title: {
//     type: String,
//     required: true,
//   },
//   description: {
//     type: String,
//     required: true,
//   },
//   difficulty: {
//     type: String,
//     enum: ["easy", "medium", "hard"],
//     required: true,
//   },
//   tags: {
//     type: [
//       {
//         type: String,
//         enum: [
//           "array",
//           "string",
//           "dynamic programming",
//           "greedy",
//           "backtracking",
//           "tree",
//           "graph",
//           "hash table",
//           "two pointers",
//           "sliding window",
//           "divide and conquer",
//         ],
//       },
//     ],
//     required: true,
//   },
//   visibleTestCases: [
//     {
//       input: {
//         type: String,
//         required: true,
//       },
//       output: {
//         type: String,
//         required: true,
//       },
//       explanation: {
//         type: String,
//         required: true,
//       },
//     },
//   ],
//   hiddenTestCases: [
//     {
//       input: {
//         type: String,
//         required: true,
//       },
//       output: {
//         type: String,
//         required: true,
//       },
//     },
//   ],
//   referenceSolution: [
//     {
//       language: {
//         type: String,
//         enum:["JavaScript","Java","C++"],
//         required: true,
//       },
//       completeCode: {
//         type: String,
//         required: true,
//       },
//     },
//   ],
//   startCode: [
//     {
//       language: {
//         type: String,
//         enum:["JavaScript","Java","C++"],
//         required: true,
//       },
//       initialCode: {
//         type: String,
//         required: true,
//       },
//     },
//   ],
//   problemCreater: {
//     type: Schema.Types.ObjectId,
//     ref: "user",
//     required: true,
//   },
// });

// const Problem = mongoose.model("Problem", problemSchema);

// module.exports = Problem;

const mongoose = require("mongoose");
const { Schema } = mongoose;

const problemSchema = new Schema(
{
  title: {
    type: String,
    required: true,
    trim: true,
  },

  description: {
    type: String,
    required: true,
    trim: true,
  },

  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    required: true,
    lowercase: true,
  },

  tags: {
    type: [
      {
        type: String,
        enum: [
          "array",
          "string",
          "linked list",
          "queue",
          "stack",
          "dynamic programming",
          "graph",
          "tree",
          "greedy",
          "sliding window",
          "hash table",
          "two pointers",
          
        ],
        lowercase: true,
        trim: true,
      },
    ],
    required: true,
    default: [],
  },

  visibleTestCases: [
    {
      input: {
        type: String,
        required: true,
        trim: true,
      },

      output: {
        type: String,
        required: true,
        trim: true,
      },

      explanation: {
        type: String,
        required: true,
        trim: true,
      },
    },
  ],

  hiddenTestCases: [
    {
      input: {
        type: String,
        required: true,
        trim: true,
      },

      output: {
        type: String,
        required: true,
        trim: true,
      },
    },
  ],

  referenceSolution: [
    {
      language: {
        type: String,
        enum: ["javascript", "java", "cpp"],
        required: true,
        lowercase: true,
        trim: true,
      },

      completeCode: {
        type: String,
        required: true,
      },
    },
  ],

  startCode: [
    {
      language: {
        type: String,
        enum: ["javascript", "java", "cpp"],
        required: true,
        lowercase: true,
        trim: true,
      },

      initialCode: {
        type: String,
        required: true,
      },
    },
  ],

  problemCreater: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  editorial: {
    type: String,
    default: '',
  },
},
{
  timestamps: true,
}
);

const Problem = mongoose.models.Problem || mongoose.model("Problem", problemSchema);

module.exports = Problem; 
