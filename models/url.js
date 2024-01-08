const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema(
  {
    longURL: {
      type: String,
      required: true,
    },
    shortURL: {
      type: String,
      required: true,
      unique: true
    },
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    visitHistory: [{ timestamp: { type: Number } }],
    totalClicks : {
        type: Number,
        default: 0, 
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const URL_Short = mongoose.model('URL-Short', urlSchema);

module.exports = URL_Short;
