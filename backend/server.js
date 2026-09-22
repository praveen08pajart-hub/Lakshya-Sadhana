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
const port = process.env.PORT || 5000;

//global middleware
app.use(express.json())

const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://lakshya-sadhana-frontend.onrender.com"
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    }
}));

// 7. CONNECT TO MONGODB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB is connected");
    })
    .catch((error) => {
        console.log("MongoDB connection error:", error.message);
    });
//bad req use 400 and good or valid req is 201
app.post("/api/subjects", auth, async (req, res) => {
    try {
        const { name, category } = req.body;

        if (!name || !category) {
            return res.status(400).json({
                message: "name and category are required"
            });
        }

        if (
            typeof name !== "string" ||
            typeof category !== "string"
        ) {
            return res.status(400).json({
                message: "Invalid subject data"
            });
        }

        if (
            name.trim() === "" ||
            category.trim() === ""
        ) {
            return res.status(400).json({
                message: "Subject fields cannot be empty"
            });
        }

        const newSubject = await Subject.create({
            name: name.trim(),
            category: category.trim()
        });

        res.status(201).json(newSubject);

    } catch (error) {
        console.log("Create subject error:", error);

        res.status(500).json({
            message: "Unable to create subject"
        });
    }
});




app.get("/api/hello", (req, res) => {
    res.send("hello from Lakshya Sadhana");
})

app.get("/api/subjects", auth, async (req, res) => {
    try {
        const subjects = await Subject.find();
        res.json(subjects);
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
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
        if (
            typeof name !== "string" ||
            typeof email !== "string" ||
            typeof password !== "string"
        ) {
            return res.status(400).json({
                message: "Invalid registration data"
            });
        }

        if (
            name.trim() === "" ||
            email.trim() === "" ||
            password.trim() === ""
        ) {
            return res.status(400).json({
                message: "Fields cannot be empty"
            });
        }

        const cleanName = name.trim();
        const cleanEmail = email.trim().toLowerCase();
        const existingUser = await User.findOne({
            email: cleanEmail
        }); if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            })
        }
        //next step was :hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name: cleanName,
            email: cleanEmail,
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
        if (
            typeof email !== "string" ||
            typeof password !== "string"
        ) {
            return res.status(400).json({
                message: "Invalid login data"
            });
        }

        if (
            email.trim() === "" ||
            password.trim() === ""
        ) {
            return res.status(400).json({
                message: "Email and password cannot be empty"
            });
        }

        const cleanEmail = email.trim().toLowerCase();
        const user = await User.findOne({
            email: cleanEmail
        });

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

app.get("/api/profile", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            name: user.name,
            email: user.email
        });

    } catch (error) {
        console.log("Profile error:", error);

        res.status(500).json({
            message: "Unable to load profile"
        });
    }
});
app.post("/api/quiz/submit", auth, async (req, res) => {
    try {
        const { topicId, answers, submissionId } = req.body;
        if (!topicId || !answers || !submissionId) {
            return res.status(400).json({
                message: "topicId, answers and submissionId are required"
            })
        }
        if (!mongoose.Types.ObjectId.isValid(topicId)) {
            return res.status(400).json({
                message: "Invalid topicId"
            });
        }

        if (
            typeof answers !== "object" ||
            answers === null ||
            Array.isArray(answers)
        ) {
            return res.status(400).json({
                message: "Answers must be a valid object"
            });
        }
        if (
            typeof submissionId !== "string" ||
            submissionId.trim() === ""
        ) {
            return res.status(400).json({
                message: "Invalid submissionId"
            });
        }
        const topicExists = await Topic.exists({
            _id: topicId
        });

        if (!topicExists) {
            return res.status(404).json({
                message: "Topic not found"
            });
        }
        // 2. Check duplicate submission
        const existingAttempt = await Attempt.findOne({
            user: req.user.id,
            submissionId: submissionId
        });

        if (existingAttempt) {
            return res.status(409).json({
                message: "Quiz already submitted"
            });
        }

        //get question
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

        const validQuestionIds = new Set(
            questions.map((question) =>
                question._id.toString()
            )
        );

        const submittedQuestionIds = Object.keys(answers);

        const hasInvalidQuestion = submittedQuestionIds.some(
            (questionId) => !validQuestionIds.has(questionId)
        );

        if (hasInvalidQuestion) {
            return res.status(400).json({
                message: "Invalid question submitted"
            });
        }

        let correctAnswers = 0;
        const hasInvalidAnswer = questions.some((question) => {
            const userAnswer =
                answers[question._id.toString()];

            return !question.options.includes(userAnswer);
        });

        if (hasInvalidAnswer) {
            return res.status(400).json({
                message: "Invalid answer submitted"
            });
        }
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
            submissionId: submissionId,
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
        if (error.code === 11000) {
            return res.status(409).json({
                message: "Quiz already submitted"
            });
        }

        console.log("Quiz submit error:", error);

        res.status(500).json({
            message: "Unable to submit quiz"
        });
    }
})

app.post("/api/questions", auth, async (req, res) => {
    try {
        const {
            questionText,
            options,
            correctAnswer,
            topic
        } = req.body;

        // Required fields
        if (!questionText || !options || !correctAnswer || !topic) {
            return res.status(400).json({
                message: "All question fields are required"
            });
        }

        // Validate question text
        if (
            typeof questionText !== "string" ||
            questionText.trim() === ""
        ) {
            return res.status(400).json({
                message: "Invalid question text"
            });
        }

        // Validate options
        if (
            !Array.isArray(options) ||
            options.length < 2 ||
            options.some(
                (option) =>
                    typeof option !== "string" ||
                    option.trim() === ""
            )
        ) {
            return res.status(400).json({
                message: "At least two valid answer options are required"
            });
        }

        // Validate correct answer
        if (
            typeof correctAnswer !== "string" ||
            correctAnswer.trim() === ""
        ) {
            return res.status(400).json({
                message: "Invalid correct answer"
            });
        }

        // Correct answer must exist in options
        const cleanOptions = options.map((option) => option.trim());
        const cleanCorrectAnswer = correctAnswer.trim();

        if (!cleanOptions.includes(cleanCorrectAnswer)) {
            return res.status(400).json({
                message: "Correct answer must be one of the options"
            });
        }

        // Validate topic ID format
        if (!mongoose.Types.ObjectId.isValid(topic)) {
            return res.status(400).json({
                message: "Invalid topicId"
            });
        }

        // Check topic exists
        const topicExists = await Topic.exists({
            _id: topic
        });

        if (!topicExists) {
            return res.status(404).json({
                message: "Topic not found"
            });
        }

        // Create question
        const newQuestion = await Question.create({
            questionText: questionText.trim(),
            options: cleanOptions,
            correctAnswer: cleanCorrectAnswer,
            topic
        });

        res.status(201).json({
            message: "Question created successfully",
            question: newQuestion
        });

    } catch (error) {
        console.log("Create question error:", error);

        res.status(500).json({
            message: "Unable to create question"
        });
    }
});

app.get("/api/topics/:topicId/questions", auth, async (req, res) => {
    try {
        const { topicId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(topicId)) {
            return res.status(400).json({
                message: "Invalid topicId"
            });
        }

        const topicExists = await Topic.exists({
            _id: topicId
        });

        if (!topicExists) {
            return res.status(404).json({
                message: "Topic not found"
            });
        }

        const questions = await Question.find({
            topic: topicId
        }).select("-correctAnswer");

        res.status(200).json(questions);

    } catch (error) {
        console.log("Questions fetch error:", error);

        res.status(500).json({
            message: "Unable to load questions"
        });
    }
});
app.get("/api/subjects/:subjectId/topics", auth, async (req, res) => {
    try {
        const { subjectId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(subjectId)) {
            return res.status(400).json({
                message: "Invalid subjectId"
            });
        }

        const subjectExists = await Subject.exists({
            _id: subjectId
        });

        if (!subjectExists) {
            return res.status(404).json({
                message: "Subject not found"
            });
        }

        const topics = await Topic.find({
            subject: subjectId
        });

        res.status(200).json(topics);

    } catch (error) {
        console.log("Topics fetch error:", error);

        res.status(500).json({
            message: "Unable to load topics"
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
        if (typeof name !== "string") {
            return res.status(400).json({
                message: "Invalid topic name"
            });
        }

        if (name.trim() === "") {
            return res.status(400).json({
                message: "Topic name cannot be empty"
            });
        }
        if (!mongoose.Types.ObjectId.isValid(subject)) {
            return res.status(400).json({
                message: "Invalid subjectId"
            });
        }

        const subjectExists = await Subject.exists({
            _id: subject
        });

        if (!subjectExists) {
            return res.status(404).json({
                message: "Subject not found"
            });
        }
        const newtopic = await Topic.create({
            name: name.trim(),
            subject
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
            .sort({ createdAt: -1 });

        const latestAttempts = [];
        const seenTopics = new Set();

        for (const attempt of attempts) {
            if (!attempt.topic) {
                continue;
            }

            const topicId = attempt.topic._id.toString();

            if (!seenTopics.has(topicId)) {
                seenTopics.add(topicId);
                latestAttempts.push(attempt);
            }
        }

        res.status(200).json(latestAttempts);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// quiz history
app.get("/api/quiz-history", auth, async (req, res) => {
    try {
        const attempts = await Attempt.find({
            user: req.user.id
        })
            .populate("topic")
            .sort({ createdAt: -1 });

        res.status(200).json(attempts);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// Weak Topics
app.get("/api/weak-topics", auth, async (req, res) => {
    try {
        // Get all attempts for this user, newest first
        const attempts = await Attempt.find({
            user: req.user.id
        })
            .populate("topic")
            .sort({ createdAt: -1 });

        const latestAttempts = [];
        const seenTopics = new Set();

        // Keep only the latest attempt for each topic
        for (const attempt of attempts) {
            if (!attempt.topic) {
                continue;
            }

            const topicId = attempt.topic._id.toString();

            if (!seenTopics.has(topicId)) {
                seenTopics.add(topicId);
                latestAttempts.push(attempt);
            }
        }

        // Show only topics whose latest score is below 60
        const weakTopics = latestAttempts.filter(
            (attempt) => attempt.score < 60
        );

        res.status(200).json(weakTopics);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});