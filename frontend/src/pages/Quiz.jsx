import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { handleUnauthorized } from "../utils/auth";
import { getResponseData } from "../utils/api";
import LoadingState from "../components/LoadingState";

const API_URL = import.meta.env.VITE_API_URL;

function Quiz() {
    const navigate = useNavigate();
    const { topicId } = useParams();

    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);

    const [submissionId, setSubmissionId] = useState(
        () => crypto.randomUUID()
    );

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
                    alert(
                        data.message || "Unable to load questions."
                    );
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

        if (isSubmitting) {
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

            const data = await getResponseData(response);

            if (handleUnauthorized(response, navigate)) {
                return;
            }

            if (response.ok) {
                navigate("/result", {
                    state: {
                        result: data,
                        topicId: topicId
                    }
                });
            } else {
                alert(
                    data.message || "Unable to submit quiz."
                );
            }

        } catch (error) {
            console.log("Quiz submit error:", error);

            alert("Unable to submit quiz.");

        } finally {
            setIsSubmitting(false);
        }
    };

    const answeredCount = Object.keys(answers).length;

    const progressPercentage =
        questions.length > 0
            ? Math.round(
                (answeredCount / questions.length) * 100
            )
            : 0;

    if (loading) {
        return (
            <>
                <Navbar />

                <div className="quiz-page">
                    <div className="quiz-container">
                        <LoadingState
                            title="Loading quiz"
                            message="Getting your questions ready..."
                        />
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

                    {questions.length > 0 && (
                        <div className="quiz-progress">

                            <div className="quiz-progress-info">
                                <span>Quiz Progress</span>

                                <span>
                                    {answeredCount} of{" "}
                                    {questions.length} answered
                                </span>
                            </div>

                            <div className="quiz-progress-track">
                                <div
                                    className="quiz-progress-fill"
                                    style={{
                                        width: `${progressPercentage}%`
                                    }}
                                ></div>
                            </div>

                        </div>
                    )}

                    {questions.length === 0 ? (
                        <div className="question-card">
                            <p>
                                No questions are available for this
                                topic yet.
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
                                            className={`quiz-option ${answers[question._id] === option
                                                    ? "selected"
                                                    : ""
                                                }`}
                                            key={option}
                                        >
                                            <input
                                                type="radio"
                                                name={question._id}
                                                value={option}
                                                disabled={isSubmitting}
                                                checked={
                                                    answers[question._id] ===
                                                    option
                                                }
                                                onChange={() =>
                                                    setAnswers(
                                                        (previous) => ({
                                                            ...previous,
                                                            [question._id]:
                                                                option
                                                        })
                                                    )
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
                            disabled={isSubmitting}
                        >
                            {isSubmitting
                                ? "Submitting..."
                                : "Submit Quiz"}
                        </button>
                    )}

                </div>
            </div>
        </>
    );
}

export default Quiz;