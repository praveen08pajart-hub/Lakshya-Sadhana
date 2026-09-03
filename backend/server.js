// load the env varaible from .env
require("dotenv").config();

//   1.import the package..
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors")
const bcrypt = require("bcryptjs");

// import the middleware check before run the route
const auth = require("./middleware/auth");

//import database model
const Subject = require("./models/Subject");
const User = require("./models/User");
const Question = require("./models/Question");
const Attempt = require("./models/Attempt")
const Topic = require("./models/Topic");

//express app
const app = express();
const port = 5000;

//global middleware
app.use(express.json())

app.use(cors({
    origin: process.env.FRONTEND_URL
}))

// Temporary check
console.log("Frontend URL:", process.env.FRONTEND_URL);

// 7. CONNECT TO MONGODB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB is connected");
    })
    .catch((error) => {
        console.log("MongoDB connection error:", error.message);
    });
//bad req use 400 and good or valid req is 201
app.post("/api/subjects", async (req, res) => {
    try {
        const newSubject = await Subject.create({
            name: req.body.name,
            category: req.body.category
        });
        res.status(201).json(newSubject);
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
});




app.get("/api/hello", (req, res) => {
    res.send("hello from Lakshya Sadhana");
})

app.get("/api/subjects", async (req, res) => {
    try {
        const subjects = await Subject.find();
        res.json(subjects);
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
})

// mongodb connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("mongoDB is connected");
    })
    .catch((error) => {
        console.log("mongoDB connection error:", error.message);
    })



app.post("/api/auth/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        //  validation
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "name, email and password are required"
            });
        }
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            })
        }
        //next step was :hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name: name,
            email: email,
            password: hashedPassword
        });
        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        });
        // ..
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
})

// login
app.post("/api/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "email and password are required"
            });
        }
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password"
            })
        }
        const isPasswordCorrect = await bcrypt.compare(
            password, user.password
        );
        if (!isPasswordCorrect) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        // next : create JWT token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(200).json({
            message: "Login successful",
            token: token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});

app.get("/api/profile", auth, (req, res) => {
    res.status(200).json({
        message: "protected route accessed",
        userId: req.user.id
    });
})

app.post("/api/quiz/submit", auth, async (req, res) => {
    try {
        const { topicId, answers } = req.body;
        if (!topicId || !answers) {
            return res.status(400).json({
                message: "topicID and answers are required"
            })
        }
        const questions = await Question.find({
            topic: topicId
        });
        if (questions.length === 0) {
            return res.status(400).json({
                message: "No questions available for this topic"
            });
        }
        if (Object.keys(answers).length !== questions.length) {
            return res.status(400).json({
                message: "Please answer all questions before submitting"
            });
        }

        let correctAnswers = 0;
        for (const question of questions) {
            const userAnswer = answers[question._id.toString()];

            if (userAnswer === question.correctAnswer) {
                correctAnswers++;
            }
        }
        const totalQuestions = questions.length;
        const score = totalQuestions === 0 ? 0 : Math.round((correctAnswers / totalQuestions) * 100);

        const attempt = await Attempt.create({
            user: req.user.id,
            topic: topicId,
            score: score,
            totalQuestions: totalQuestions,
            correctAnswers: correctAnswers
        });

        res.status(200).json({
            message: "Quiz submitted successfully",
            score: score,
            correctAnswers: correctAnswers,
            totalQuestions: totalQuestions,
            attemptId: attempt._id
        })

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
})

app.post("/api/questions", auth, async (req, res) => {
    try {
        const { questionText, options, correctAnswer, topic } = req.body;
        if (!questionText || !options || !correctAnswer || !topic) {
            return res.status(400).json({
                message: "All question field are required"
            });

        }
        const newQuestion = await Question.create({
            questionText,
            options,
            correctAnswer,
            topic
        });
        res.status(201).json({
            message: "Question created successfully",
            question: newQuestion
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }

});

//
app.get("/api/topics/:topicId/questions", auth, async (req, res) => {
    try {
        const questions = await Question.find({
            topic: req.params.topicId
        }).select("-correctAnswer");
        res.status(200).json(questions);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
})

app.get("/api/subjects/:subjectId/topics", auth, async (req, res) => {
    try {
        const topics = await Topic.find({
            subject: req.params.subjectId
        });

        res.status(200).json(topics);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

app.post("/api/topics", auth, async (req, res) => {
    try {
        const { name, subject } = req.body;
        if (!name || !subject) {
            return res.status(400).json({
                message: "name and subject are required"
            });
        }
        const newtopic = await Topic.create({
            name, subject
        });
        res.status(201).json({
            message: "Topic created successfully",
            topic: newtopic
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
})

app.get("/api/progress", auth, async (req, res) => {
    try {
        const attempts = await Attempt.find({
            user: req.user.id
        })
            .populate("topic")
            .sort({ createdAt: -1 }); //nearest first
        res.status(200).json(attempts);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

//for weak section
app.get("/api/weak-topics", auth, async (req, res) => {
    try {
        const weakAttempts = await Attempt.find({
            user: req.user.id,
            score: { $lt: 60 }  //mongoose command less than 60 
        })
            .populate("topic")
            .sort({ createdAt: -1 });

        res.status(200).json(weakAttempts);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})


//info about no:
//200 ok, 201 created, 400 bad req,401 unauthorized, 404 not found and 500 for sever error