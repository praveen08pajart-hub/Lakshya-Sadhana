import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { handleUnauthorized } from "../utils/auth";
import { getResponseData } from "../utils/api";

const API_URL = import.meta.env.VITE_API_URL;

function Quiz() {
    const navigate = useNavigate();
    const { topicId } = useParams();

    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [result, setResult] = useState(null);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);

    const [submissionId, setSubmissionId] = useState(
        () => crypto.randomUUID()
    );

    const getStatus = (score) => {
        if (score >= 80) {
            return "Strong Understanding";
        } else if (score >= 60) {
            return "Needs More Practice";
        } else {
            return "Needs Revision";
        }
    };

    // Fetch questions
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    navigate("/");
                    return;
                }

                setLoading(true);

                const response = await fetch(
                    `${API_URL}/api/topics/${topicId}/questions`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await getResponseData(response);
                if (handleUnauthorized(response, navigate)) {
                    return;
                }

                if (response.ok) {
                    setQuestions(data);
                } else {
                    alert(data.message);
                }

            } catch (error) {
                console.log("Question fetch error:", error);
                alert("Unable to load questions.");
            } finally {
                setLoading(false);
            }
        };

        // Reset quiz whenever topic changes
        setAnswers({});
        setResult(null);
        setIsSubmitting(false);
        setSubmissionId(crypto.randomUUID());

        fetchQuestions();

    }, [topicId, navigate]);

    // Submit quiz
    const handleSubmit = async () => {
        if (questions.length === 0) {
            alert("No questions available for this topic.");
            return;
        }

        if (Object.keys(answers).length !== questions.length) {
            alert("Please answer all questions before submitting.");
            return;
        }

        if (isSubmitting || result) {
            return;
        }

        setIsSubmitting(true);

        try {
            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/");
                return;
            }

            const response = await fetch(
                `${API_URL}/api/quiz/submit`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        topicId: topicId,
                        answers: answers,
                        submissionId: submissionId
                    })
                }
            );

            const data = await response.json();

            if (response.ok) {
                setResult(data);
            } else {
                alert(data.message);

                // Allow retry if submission failed
                setIsSubmitting(false);
            }

        } catch (error) {
            console.log("Quiz submit error:", error);

            alert("Unable to submit quiz.");

            // Allow retry after network error
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />

                <div className="quiz-page">
                    <div className="quiz-container">
                        <p>Loading quiz...</p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />

            <div className="quiz-page">
                <div className="quiz-container">

                    <button
                        className="back-btn"
                        onClick={() => navigate(-1)}
                    >
                        ← Back
                    </button>

                    <h1>Quiz</h1>

                    {questions.length === 0 ? (
                        <div className="question-card">
                            <p>
                                No questions are available for this topic yet.
                            </p>
                        </div>
                    ) : (
                        questions.map((question) => (
                            <div
                                className="question-card"
                                key={question._id}
                            >
                                <h3>
                                    {question.questionText}
                                </h3>

                                <div className="quiz-options">

                                    {question.options?.map((option) => (
                                        <label
                                            className="quiz-option"
                                            key={option}
                                        >
                                            <input
                                                type="radio"
                                                name={question._id}
                                                value={option}
                                                disabled={Boolean(result)}
                                                checked={
                                                    answers[question._id] ===
                                                    option
                                                }
                                                onChange={() =>
                                                    setAnswers((previous) => ({
                                                        ...previous,
                                                        [question._id]: option
                                                    }))
                                                }
                                            />

                                            <span>
                                                {option}
                                            </span>
                                        </label>
                                    ))}

                                </div>
                            </div>
                        ))
                    )}

                    {questions.length > 0 && (
                        <button
                            className="submit-quiz-btn"
                            onClick={handleSubmit}
                            disabled={isSubmitting || Boolean(result)}
                        >
                            {result
                                ? "Submitted"
                                : isSubmitting
                                    ? "Submitting..."
                                    : "Submit Quiz"}
                        </button>
                    )}

                    {result && (
                        <div className="result-card">

                            <h2>Quiz Result</h2>

                            <p>
                                Score: {result.score}%
                            </p>

                            <p>
                                Correct Answers:{" "}
                                {result.correctAnswers} /{" "}
                                {result.totalQuestions}
                            </p>

                            <p>
                                Status: {getStatus(result.score)}
                            </p>

                            <button
                                className="practice-again-btn"
                                onClick={() =>
                                    navigate("/weak-topics")
                                }
                            >
                                Check Weak Topics
                                <i className="fa-solid fa-arrow-right"></i>
                            </button>

                        </div>
                    )}

                </div>
            </div>
        </>
    );
}

export default Quiz;