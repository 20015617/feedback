const UserModel = require("../models/UserModel.js");
const Bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const config = require("../config/properties.js")
const jwtTokenVerify = require("../middleware/jwtTokenVerify");
const FeedbackModel = require("../models/FeedbackModel.js");

module.exports = (app) => {
    app.post("/signup", async (req, res) => {
        try {
            const { email, password } = req.body;
            const exist = await UserModel.findOne({ email })
            if (exist) {
                return res.status(400).json({
                    success: false,
                    message: "User Already exist with this Email"
                }).end();
            }
            req.body.password = Bcrypt.hashSync(password, 10);

            new UserModel(req.body).save()
                .then(response => {

                    const token = jwt.sign({
                        email: response?.email
                    },
                        config.secretKey, {
                        expiresIn: "7 days",
                    });
                    return res.status(200).json({
                        success: true,
                        token,
                        role: response.role
                    })
                })
                .catch(error => {
                    return res.status(400).json({
                        success: false,
                        message: "Something went wrong, Please try again",
                        error: error
                    });
                })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Something went wrong, Please try again",
                error: error
            });
        }
    });

    app.post("/login", async (req, res) => {
        try {
            const { email, password } = req.body;

            const user = await UserModel.findOne({ email });
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "This email is not registered.",
                    error: {}
                }).end();
            };

            if (!Bcrypt.compareSync(password, user.password)) {
                return res.status(401).json({
                    success: false,
                    message: "Please enter correct Password",
                }).end();
            }

            const token = jwt.sign({
                email: user.email
            },
                config.secretKey, {
                expiresIn: "7 days",
            });

            return res.status(200).json({
                success: true,
                message: "User Authenticated Successfully",
                token: token,
                role: user?.role
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Something went wrong, Please try again",
                error: error
            });
        }
    });

    app.post("/submitFeedback", jwtTokenVerify, async (req, res) => {
        try {
            const { feedback } = req.body;
            if (!feedback) {
                return res.status(400).json({
                    success: false,
                    message: "Feedback is required"
                }).end();
            }
            new FeedbackModel({
                feedback,
                userId: req?.auth?._id
            }).save().then(result => {
                return res.status(200).json({
                    success: true,
                    message: "Feedback submitted."
                }).end();
            })
                .catch(error => {
                    return res.status(400).json({
                        success: false,
                        message: "Error in submitting feedback",
                        error
                    }).end();
                })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Something went wrong, Please try again",
                error: error
            });
        }
    })

    app.get("/getEmployeeFeedback", jwtTokenVerify, async (req, res) => {
        try {
            const feedbacks = await FeedbackModel.find({ userId: req.auth._id }).select('_id feedback createdAt updatedAt')
            return res.status(200).json({
                success: true,
                response: feedbacks
            }).end();
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Something went wrong, Please try again",
                error: error
            });
        }
    })

    app.get("/getManagerFeedbacks", jwtTokenVerify, async (req, res) => {
        try {
            const { role } = req.auth;
            if (role !== 'manager') {
                return res.status(400).json({
                    success: false,
                    message: "Unauthorized access.",
                });
            }
            const feedbacks = await FeedbackModel.find().populate({
                path: "userId",
                select: "_id name email"
            }).select('_id feedback createdAt updatedAt')
            return res.status(200).json({
                success: true,
                response: feedbacks
            }).end();
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Something went wrong, Please try again",
                error: error
            });
        }
    })
}