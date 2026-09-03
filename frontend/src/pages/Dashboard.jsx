const API_URL = import.meta.env.VITE_API_URL;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Dashboard() {
    const navigate = useNavigate();
    const [subjects, setSubjects] = useState([]);

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const response = await fetch(`${API_URL}/api/subjects`);;
                const data = await response.json();

                if (response.ok) {
                    setSubjects(data);
                } else {
                    console.log(data.message);
                }
            } catch (error) {
                console.log("Register response:", data);
            }
        };

        fetchSubjects();
    }, []);

    return (
        <>
            <Navbar />
            <div className="dashboard-page">
                <h1 className="dashboard-title">Dashboard</h1>

                <div className="dashboard-grid">
                    {subjects.map((subject) => (
                        <div
                            className="dashboard-card"
                            key={subject._id}
                            onClick={() => navigate(`/subjects/${subject._id}/topics`)}
                            style={{ cursor: "pointer" }}
                        >
                            <h3>{subject.name}</h3>
                            <p>{subject.category}</p>
                        </div>
                    ))}

                    <div
                        className="dashboard-card"
                        onClick={() => navigate("/progress")}
                    >
                        <h2>Progress</h2>
                        <p>Check your quiz performance.</p>
                    </div>
                    <div
                        className="dashboard-card"
                        onClick={() => navigate("/weak-topics")}
                        style={{ cursor: "pointer" }}
                    >
                        <h2>Weak Topics</h2>
                        <p>Review topics that need more practice.</p>
                    </div>
                </div>
            </div>
        </>

    );
}

export default Dashboard;