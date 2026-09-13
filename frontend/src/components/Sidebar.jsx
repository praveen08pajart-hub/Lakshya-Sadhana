import { useLocation, useNavigate } from "react-router-dom";

function Sidebar({ sidebarOpen, setSidebarOpen }) {
    const navigate = useNavigate();
    const location = useLocation();

    const handleNavigate = (path) => {
        navigate(path);
        setSidebarOpen(false);
    };

    return (
        <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
            <button
                className="sidebar-close"
                onClick={() => setSidebarOpen(false)}
            >
                <i className="fa-solid fa-xmark"></i>
            </button>

            <div className="sidebar-brand">
                <h2>Lakshya Sadhana</h2>
            </div>

            <nav className="sidebar-nav">
                <button
                    className={location.pathname === "/dashboard" ? "active" : ""}
                    onClick={() => handleNavigate("/dashboard")}
                >
                    <i className="fa-solid fa-house"></i>
                    <span>Dashboard</span>
                </button>

                <button
                    className={location.pathname === "/progress" ? "active" : ""}
                    onClick={() => handleNavigate("/progress")}
                >
                    <i className="fa-solid fa-chart-line"></i>
                    <span>Progress</span>
                </button>

                <button
                    className={location.pathname === "/weak-topics" ? "active" : ""}
                    onClick={() => handleNavigate("/weak-topics")}
                >
                    <i className="fa-solid fa-triangle-exclamation"></i>
                    <span>Weak Topics</span>
                </button>

                <button disabled>
                    <i className="fa-solid fa-clock-rotate-left"></i>
                    <span>Quiz History</span>
                </button>

                <button disabled>
                    <i className="fa-solid fa-user"></i>
                    <span>Profile</span>
                </button>
            </nav>
        </aside>
    );
}

export default Sidebar;