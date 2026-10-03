
import { useLocation, useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import {
    getLearningStatus,
    getLearningStatusClass
} from "../utils/learningStatus";

function Result() {
    const navigate = useNavigate();
    const location = useLocation();

    const result = location.state?.result;
    const topicId = location.state?.topicId;

    if (!result) {
        return (
            <DashboardLayout>
                <div className="result-page">
                    <div className="result-card result-empty">
                        <div className="result-icon">
                            <i className="fa-solid fa-circle-info"></i>
                        </div>

                        <h2>No Quiz Result Available</h2>

                        <p>
                            Complete a quiz first to view your result.
                        </p>

                        <button
                            className="result-primary-btn"
                            onClick={() => navigate("/subjects")}
                        >
                            <i className="fa-solid fa-book-open"></i>
                            Go to Subjects
                        </button>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    const status = getLearningStatus(result.score);
    const statusClass = getLearningStatusClass(result.score);

    return (
        <DashboardLayout>
            <div className="result-page">

                <div className="result-heading">
                    <p className="result-eyebrow">
                        Quiz Completed
                    </p>

                    <h1>Quiz Result</h1>

                    <p>
                        Here's how you performed in this attempt.
                    </p>
                </div>

                <div className="result-card">

                    <div className="result-trophy">
                        <i className="fa-solid fa-chart-simple"></i>
                    </div>

                    <h2>Your Result</h2>

                    <div className="result-score-circle">
                        <span>{result.score}%</span>
                        <small>Score</small>
                    </div>

                    <div
                        className={`result-status ${statusClass}`}
                    >
                        {status}
                    </div>

                    <div className="result-details">

                        <div className="result-detail-item">
                            <i className="fa-solid fa-circle-check"></i>

                            <div>
                                <span>Correct Answers</span>

                                <strong>
                                    {result.correctAnswers} /{" "}
                                    {result.totalQuestions}
                                </strong>
                            </div>
                        </div>

                        <div className="result-detail-item">
                            <i className="fa-solid fa-percent"></i>

                            <div>
                                <span>Final Score</span>
                                <strong>{result.score}%</strong>
                            </div>
                        </div>

                    </div>

                    <div className="result-actions">

                        <button
                            className="result-primary-btn"
                            onClick={() =>
                                navigate(`/quiz/${topicId}`)
                            }
                        >
                            <i className="fa-solid fa-rotate-right"></i>
                            Practice Again
                        </button>

                        <button
                            className="result-secondary-btn"
                            onClick={() => navigate("/progress")}
                        >
                            <i className="fa-solid fa-chart-line"></i>
                            View Progress
                        </button>

                    </div>

                    <button
                        className="result-back-btn"
                        onClick={() => navigate("/subjects")}
                    >
                        <i className="fa-solid fa-arrow-left"></i>
                        Back to Subjects
                    </button>

                </div>
            </div>
        </DashboardLayout>
    );
}

export default Result;