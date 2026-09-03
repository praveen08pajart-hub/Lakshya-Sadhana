const API_URL = import.meta.env.VITE_API_URL;
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function Topics() {
    const navigate = useNavigate();
    const [topics, setTopics] = useState([]);
    const { subjectId } = useParams();

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const token = localStorage.getItem("token");
                console.log("Token exists:", !!token);
                const response = await fetch(
                    `${API_URL}/api/subjects/${subjectId}/topics`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();


                if (response.ok) {
                    setTopics(data);
                } else {
                    console.log(data.message);
                }
            } catch (error) {
                console.log("Topic fetch error:", error);
            }
        };

        fetchTopics();
    }, [subjectId]);

    return (
        <>

            <Navbar />
            <button
                className="back-btn"
                onClick={() => navigate("/dashboard")}
            >
                ← Back to Dashboard
            </button>

            <div className="dashboard-page">
                <h1 className="dashboard-title">Topics</h1>
                <div className="dashboard-grid">
                    {topics.map((topic) => (
                        <div

                            className="dashboard-card"
                            key={topic._id}
                            onClick={() => navigate(`/quiz/${topic._id}`)}
                        >
                            <h3>{topic.name}</h3>
                            <p>Start quiz</p>
                        </div>
                    ))}
                </div>

            </div>
        </>
    );
}

export default Topics;