const API_URL = import.meta.env.VITE_API_URL;
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function Quiz() {
    const navigate = useNavigate();
    const [submissionId] = useState(() => crypto.randomUUID());
    const [result, setResult] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { topicId } = useParams();
    const [answers, setAnswers] = useState({})
    const [questions, setQuestions] = useState([]);

    const getstatus = (score) => {
        if (score >= 80) {
            return "Strong Understanding";
        } else if (score >= 60) {
            return "Needs More Practice";
        } else {
            return "Needs Revision";
        }
    };
    const handleSubmit = async () => {
        if (questions.length === 0) {
            alert("No questions available for this topic.");
            return;
        }
        if (Object.keys(answers).length !== questions.length) {
            alert("Please answer all questions before submitting.");
            return;
        }
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            const token = localStorage.getItem("token");
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
                console.log(data.message);
                // retrysubmition is fail
                setIsSubmitting(false);
            }
        } catch (error) {
            console.log("Quiz submit error:", error);
            alert("Unable to submit quiz.");
            // allow retry if network fail
            setIsSubmitting(false);
        }

    };
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await fetch(
                    `${API_URL}/api/topics/${topicId}/questions`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();

                if (response.ok) {
                    setQuestions(data);
                } else {
                    alert(data.message);
                }
            } catch (error) {
                console.log("Question fetch error:", error);
                alert("Unable to load questions.");
            }
        };

        fetchQuestions();
    }, [topicId]);

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
                    <h1 >Quiz</h1>

                    {questions.map((question) => (
                        <div className="question-card" key={question._id}>
                            <h3>{question.questionText}</h3>
                            <div className="quiz-options">
                                {question.options.map((option) => (
                                    <label className="quiz-option" key={option}>
                                        <input
                                            type="radio"
                                            name={question._id}
                                            value={option}
                                            checked={answers[question._id] === option}
                                            onChange={() =>
                                                setAnswers({
                                                    ...answers,
                                                    [question._id]: option
                                                })
                                            }
                                        />

                                        <span>{option}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                    <button className="submit-quiz-btn" onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? "Submitted" : "Submit Quiz"}</button>
                    {result && (
                        <div className="result-card">
                            <h2>Quiz Result</h2>

                            <p>Score: {result.score}%</p>

                            <p>
                                Correct Answers:
                                {result.correctAnswers} / {result.totalQuestions}
                            </p>
                            <p>
                                Status:{getstatus(result.score)}
                            </p>
                        </div>
                    )}

                </div>
            </div>
        </>
    );
}

export default Quiz;