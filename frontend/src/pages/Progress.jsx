const API_URL = import.meta.env.VITE_API_URL;
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Progress() {
    const navigate = useNavigate();
    const [attempts, setAttempts] = useState([]);

    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await fetch(
                    `${API_URL}/api/progress`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();

                if (response.ok) {
                    setAttempts(data);
                } else {
                    alert(data.message);
                }

            } catch (error) {
                console.log("Progress fetch error:", error);
            }
        };

        fetchProgress();
    }, []);

    return (
        <>
            <Navbar />
            <div className="dashboard-page">
                <button
                    className="back-btn"
                    onClick={() => navigate("/dashboard")}
                >
                    ← Back to Dashboard
                </button>

                <h1 className="dashboard-title">Progress</h1>
                <div className="dashboard-grid">
                    {attempts.map((attempt) => (
                        <div className="dashboard-card" key={attempt._id}>
                            <h3>{attempt.topic?.name}</h3>

                            <p>Score: {attempt.score}%</p>

                            <p>
                                Correct: {attempt.correctAnswers} / {attempt.totalQuestions}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default Progress;