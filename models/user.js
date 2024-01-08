const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName:String,
    email: String,
    passwordHash: String,
    randomString: String,
    total_URLs: {
        type: Number,
        default :0,
    },
    activationToken: String,
    activated: {
        type: Boolean,
        default:false,
    },
}, { versionKey: false });

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.passwordHash;
    }
});

const User = mongoose.model('User', userSchema);


module.exports = User;