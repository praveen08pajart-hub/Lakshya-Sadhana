require("dotenv").config();

const mongoose = require("mongoose");

const Subject = require("./models/Subject");
const Topic = require("./models/Topic");
const Question = require("./models/Question");

async function seedData() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected");

        // 1. Create or find Java subject
        let javaSubject = await Subject.findOne({
            name: "Java"
        });

        if (!javaSubject) {
            javaSubject = await Subject.create({
                name: "Java",
                category: "Programming"
            });
        }

        // 2. Create or find OOP topic
        let oopTopic = await Topic.findOne({
            name: "OOP",
            subject: javaSubject._id
        });

        if (!oopTopic) {
            oopTopic = await Topic.create({
                name: "OOP",
                subject: javaSubject._id
            });
        }

        // 3. Add 5 MCQ questions
        const questions = [
            {
                questionText: "Which concept allows one class to use properties of another class?",
                options: [
                    "Inheritance",
                    "Encapsulation",
                    "Compilation",
                    "Looping"
                ],
                correctAnswer: "Inheritance"
            },
            {
                questionText: "Which keyword is used to create an object in Java?",
                options: [
                    "new",
                    "class",
                    "object",
                    "create"
                ],
                correctAnswer: "new"
            },
            {
                questionText: "Which OOP concept hides internal implementation details?",
                options: [
                    "Encapsulation",
                    "Inheritance",
                    "Iteration",
                    "Compilation"
                ],
                correctAnswer: "Encapsulation"
            },
            {
                questionText: "Which keyword is used to inherit a class in Java?",
                options: [
                    "extends",
                    "inherits",
                    "implements",
                    "super"
                ],
                correctAnswer: "extends"
            },
            {
                questionText: "Which OOP concept allows the same method name to behave differently?",
                options: [
                    "Polymorphism",
                    "Encapsulation",
                    "Abstraction",
                    "Constructor"
                ],
                correctAnswer: "Polymorphism"
            }
        ];

        for (const question of questions) {
            const existingQuestion = await Question.findOne({
                questionText: question.questionText,
                topic: oopTopic._id
            });

            if (!existingQuestion) {
                await Question.create({
                    ...question,
                    topic: oopTopic._id
                });
            }
        }



        // 4. Create or find Exception Handling topic
        let exceptionTopic = await Topic.findOne({
            name: "Exception Handling",
            subject: javaSubject._id
        });

        if (!exceptionTopic) {
            exceptionTopic = await Topic.create({
                name: "Exception Handling",
                subject: javaSubject._id
            });
        }

        const exceptionQuestions = [
            {
                questionText: "Which block is used to handle an exception in Java?",
                options: ["try", "catch", "throw", "final"],
                correctAnswer: "catch"
            },
            {
                questionText: "Which keyword is used to explicitly throw an exception?",
                options: ["throw", "throws", "catch", "try"],
                correctAnswer: "throw"
            },
            {
                questionText: "Which block usually executes whether an exception occurs or not?",
                options: ["finally", "catch", "throw", "extends"],
                correctAnswer: "finally"
            },
            {
                questionText: "Which keyword declares that a method may pass an exception to its caller?",
                options: ["throws", "throw", "try", "catch"],
                correctAnswer: "throws"
            },
            {
                questionText: "Which class is commonly used as the base for many Java exceptions?",
                options: ["Exception", "String", "Scanner", "System"],
                correctAnswer: "Exception"
            }
        ];

        for (const question of exceptionQuestions) {
            const existingQuestion = await Question.findOne({
                questionText: question.questionText,
                topic: exceptionTopic._id
            });

            if (!existingQuestion) {
                await Question.create({
                    ...question,
                    topic: exceptionTopic._id
                });
            }

        }

        console.log("Java Exception Handling seed completed");


        // =========================
        // COLLECTIONS TOPIC
        // =========================

        let collectionsTopic = await Topic.findOne({
            name: "Collections",
            subject: javaSubject._id
        });

        if (!collectionsTopic) {
            collectionsTopic = await Topic.create({
                name: "Collections",
                subject: javaSubject._id
            });
        }

        const collectionsQuestions = [
            {
                questionText: "Which interface stores elements in key-value pairs?",
                options: ["Map", "List", "Set", "Queue"],
                correctAnswer: "Map"
            },
            {
                questionText: "Which collection allows duplicate elements?",
                options: ["List", "Set", "Map", "TreeSet"],
                correctAnswer: "List"
            },
            {
                questionText: "Which collection does not allow duplicate elements?",
                options: ["Set", "List", "ArrayList", "Vector"],
                correctAnswer: "Set"
            },
            {
                questionText: "Which class is commonly used as a resizable array in Java?",
                options: ["ArrayList", "HashSet", "HashMap", "TreeMap"],
                correctAnswer: "ArrayList"
            },
            {
                questionText: "Which class stores data using key-value pairs?",
                options: ["HashMap", "ArrayList", "LinkedList", "HashSet"],
                correctAnswer: "HashMap"
            }
        ];

        for (const question of collectionsQuestions) {
            const existingQuestion = await Question.findOne({
                questionText: question.questionText,
                topic: collectionsTopic._id
            });

            if (!existingQuestion) {
                await Question.create({
                    ...question,
                    topic: collectionsTopic._id
                });
            }
        }

        console.log("Java Collections seed completed");

        // =========================
        // WEB TECHNOLOGY SUBJECT
        // =========================

        let webSubject = await Subject.findOne({
            name: "Web Technology"
        });

        if (!webSubject) {
            webSubject = await Subject.create({
                name: "Web Technology",
                category: "Web Development"
            });
        }

        // =========================
        // HTML TOPIC
        // =========================

        let htmlTopic = await Topic.findOne({
            name: "HTML",
            subject: webSubject._id
        });

        if (!htmlTopic) {
            htmlTopic = await Topic.create({
                name: "HTML",
                subject: webSubject._id
            });
        }

        const htmlQuestions = [
            {
                questionText: "What does HTML stand for?",
                options: [
                    "HyperText Markup Language",
                    "HighText Machine Language",
                    "Hyper Transfer Markup Language",
                    "Home Tool Markup Language"
                ],
                correctAnswer: "HyperText Markup Language"
            },
            {
                questionText: "Which HTML tag is used for the largest heading?",
                options: ["<h1>", "<h6>", "<head>", "<title>"],
                correctAnswer: "<h1>"
            },
            {
                questionText: "Which tag is used to create a hyperlink in HTML?",
                options: ["<a>", "<link>", "<href>", "<p>"],
                correctAnswer: "<a>"
            },
            {
                questionText: "Which HTML tag is used to display an image?",
                options: ["<img>", "<image>", "<src>", "<picturefile>"],
                correctAnswer: "<img>"
            },
            {
                questionText: "Which tag is used to create an unordered list?",
                options: ["<ul>", "<ol>", "<li>", "<list>"],
                correctAnswer: "<ul>"
            }
        ];

        for (const question of htmlQuestions) {
            const existingQuestion = await Question.findOne({
                questionText: question.questionText,
                topic: htmlTopic._id
            });

            if (!existingQuestion) {
                await Question.create({
                    ...question,
                    topic: htmlTopic._id
                });
            }
        }

        console.log("Web Technology HTML seed completed");

        // =========================
        // CSS TOPIC
        // =========================

        let cssTopic = await Topic.findOne({
            name: "CSS",
            subject: webSubject._id
        });

        if (!cssTopic) {
            cssTopic = await Topic.create({
                name: "CSS",
                subject: webSubject._id
            });
        }

        const cssQuestions = [
            {
                questionText: "What does CSS stand for?",
                options: [
                    "Cascading Style Sheets",
                    "Computer Style Sheets",
                    "Creative Style System",
                    "Colorful Style Sheets"
                ],
                correctAnswer: "Cascading Style Sheets"
            },
            {
                questionText: "Which property is used to change text color in CSS?",
                options: ["color", "font-color", "text-color", "background-color"],
                correctAnswer: "color"
            },
            {
                questionText: "Which property is used to change the background color?",
                options: [
                    "background-color",
                    "color",
                    "bgcolor",
                    "background-style"
                ],
                correctAnswer: "background-color"
            },
            {
                questionText: "Which CSS property controls the size of text?",
                options: ["font-size", "text-size", "font-style", "size"],
                correctAnswer: "font-size"
            },
            {
                questionText: "Which symbol is used to select a class in CSS?",
                options: [".", "#", "*", "@"],
                correctAnswer: "."
            }
        ];

        for (const question of cssQuestions) {
            const existingQuestion = await Question.findOne({
                questionText: question.questionText,
                topic: cssTopic._id
            });

            if (!existingQuestion) {
                await Question.create({
                    ...question,
                    topic: cssTopic._id
                });
            }
        }

        console.log("Web Technology CSS seed completed");

        // =========================
        // JAVASCRIPT TOPIC
        // =========================

        let jsTopic = await Topic.findOne({
            name: "JavaScript",
            subject: webSubject._id
        });

        if (!jsTopic) {
            jsTopic = await Topic.create({
                name: "JavaScript",
                subject: webSubject._id
            });
        }

        const jsQuestions = [
            {
                questionText: "Which keyword is used to declare a block-scoped variable in JavaScript?",
                options: ["let", "var", "print", "define"],
                correctAnswer: "let"
            },
            {
                questionText: "Which operator is used for strict equality in JavaScript?",
                options: ["===", "==", "=", "!="],
                correctAnswer: "==="
            },
            {
                questionText: "Which method is used to print output in the browser console?",
                options: [
                    "console.log()",
                    "print()",
                    "document.write()",
                    "alert.log()"
                ],
                correctAnswer: "console.log()"
            },
            {
                questionText: "Which symbol is commonly used for a single-line comment in JavaScript?",
                options: ["//", "/*", "#", "<!--"],
                correctAnswer: "//"
            },
            {
                questionText: "Which array method adds an element to the end of an array?",
                options: ["push()", "pop()", "shift()", "slice()"],
                correctAnswer: "push()"
            }
        ];

        for (const question of jsQuestions) {
            const existingQuestion = await Question.findOne({
                questionText: question.questionText,
                topic: jsTopic._id
            });

            if (!existingQuestion) {
                await Question.create({
                    ...question,
                    topic: jsTopic._id
                });
            }
        }

        console.log("Web Technology JavaScript seed completed");
        await mongoose.connection.close();

    } catch (error) {
        console.log("Seed error:", error.message);
        await mongoose.connection.close();
    }

}
seedData();

