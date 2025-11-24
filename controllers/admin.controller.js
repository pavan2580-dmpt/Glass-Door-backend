const jwt = require("jsonwebtoken");
const adminModel = require("../models/admin.model")

exports.login = async (req, res) => {
    try {
        const findMail = await adminModel.findOne({ email: req.body.email });
        if (!findMail) {
            return res.status(400).send({
                message: "Invalid email. Please check your email and try again."
            })
        }
        if (findMail.password !== req.body.password) {
            return res.status(400).send({
                message: "You've Entered Incorrect Password. Please try again!"
            })
        }
        const token = jwt.sign({ authId: findMail._id },
            process.env.JWT_TOKEN_KEY, { expiresIn: process.env.JWT_EXPIRY });
        res.status(200).send({
            data: { admin: findMail, token },
            error: null,
            status: 1,
            message: "Login Successful!"
        })
    } catch (error) {
        res.status(400).send({
            data: null,
            error: error,
            status: 0,
            message: "Error in LogIn."
        })
    }
}