const User = require("../models/user");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { JWT_SECRET } = require("../config");
const PasswordReset = require("../models/password");

const userController = {
    
    signup: async (req, res) => {
        const { firstName, lastName , email, password } = req.body;

        try {
            const user = await User.findOne({ email });

            if (!user) {
                const passwordHash = await bcrypt.hash(password, 10);

                const newUser = new User({
                    firstName,
                    lastName,
                    email,
                    passwordHash
                });

                await newUser.save();
                return res.status(200).json({ message: "Activation Link Sent Successfull to your Email ,Please Active and then LOGIN", newUser });
            }

            return res.status(500).json({ message: "Email already exists please login" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal Server Error" ,error});
        }
    },

    signin: async (req, res) => {
        
        const { email, password } = req.body;
        try {
            const user = await User.findOne({ email , activated :true });

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        const passwordMatch = await bcrypt.compare(password, user.passwordHash);

        if (!passwordMatch) {
            return res.status(404).json({ message: "Password is wrong" });
        }

        const token = jwt.sign({ email, id:user._id }, JWT_SECRET);

        return res.status(200).json({ message: "Login successfully ", token, user });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal Server Error",error });
        }

    },

    activationLink: async (req, res) => {
        try {
         const { email } = req.params;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        const activationToken = Math.random().toString(36).slice(-7);

        user.activationToken=activationToken;
        await user.save();
            
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: '143.lovvable@gmail.com',
                pass: 'fnmxhibtwjgdzajq'
            },
        });

        const message = {
        from: '143.lovvable@gmail.com',
        to: email,
        subject: 'Account Activation Link',
        text: `You are requested to Activate your Account ,Click below Link to Activate
        https://main--spiffy-medovik-29bd79.netlify.app/activate/${activationToken}`
        }

        transporter.sendMail(message, (err, info) => {
            if (err) {
                res.status(404).json({ message: "something went wrong,try again !" });
            }
            res.status(200).json({ message: "Activation Link sent successfully" , info });
        })
        } catch (error) {
             console.error(error);
            res.status(500).json({ message: "Internal Server Error",error });
        }
    },

    activateAccount: async (req, res) => {
        try {
            const { activationToken } = req.params;

            const user = await User.findOne({ activationToken, activated: false });
  
            if (user) {
                user.activationToken = null,
                user.activated = true
                await user.save();
                res.json({ message: "Account Activated Succeessfully" });
            }
            else {
                res.json({ message: "Token Invalid or Already Activated" });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal Server Error",error });
        }
    },

    resetPassword: async (req, res) => {
        try {
         const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        const randomString = Math.random().toString(36).slice(-7);

        await PasswordReset.create({
            email,
            randomString
        });

        user.randomString=randomString;
        await user.save();
            
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: '143.lovvable@gmail.com',
                pass: 'fnmxhibtwjgdzajq'
            },
        });

        const message = {
        from: '143.lovvable@gmail.com',
        to: email,
        subject: 'Password Reset Link',
        text: `You are requested to change the password of user login ,So please click this url
        https://main--spiffy-medovik-29bd79.netlify.app/resetPassword/${randomString}`
        }

        transporter.sendMail(message, (err, info) => {
            if (err) {
                res.status(404).json({ message: "something went wrong,try again !" });
            }
            res.status(200).json({ message: "Email sent successfully" , info });
        })
        } catch (error) {
             console.error(error);
            res.status(500).json({ message: "Internal Server Error",error });
        }
    },

    newPassword: async (req, res) => {
        try {
            const { randomString, newPassword } = req.body;

            const stringMatches = await PasswordReset.findOne({ randomString }) || await User.findOne({randomString});

            if (!stringMatches) {
                return res.status(500).json({ message: "OTP is Incorrect" });
            }

            const passwordHash = await bcrypt.hash(newPassword, 10); 

            const user = await User.findOneAndUpdate(
                { email: stringMatches.email },
                { $set: { passwordHash } },
                { new: true }
            );

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            await PasswordReset.deleteOne({ email: stringMatches.email, randomString }); 
            user.randomString = "NULL";
            await user.save();

            return res.status(200).json({ message: 'Password reset successful' });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal Server Error", error });
        }
    },

    allusers: async (req, res) => {
        try {
            const users = await User.find();
            res.status(200).json({ message: "All users are fetched successfullly" ,users});
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal Server Error", error });
        }
    },

    getProfile: async (req, res) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({ message: "User ID not found in the request" });
        }

        const user = await User.findById(userId, {});

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "Authenticated Profile", user });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal Server Error", error: error.message });
        }
    }

};

module.exports = userController;
