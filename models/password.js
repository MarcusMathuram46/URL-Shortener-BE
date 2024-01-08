const mongoose = require('mongoose');

const passwordResetSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  randomString: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
}, { versionKey: false });

const PasswordReset = mongoose.model('PasswordReset', passwordResetSchema);

module.exports = PasswordReset;
