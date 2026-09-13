import { useNavigate } from "react-router-dom";

function Navbar({ setSidebarOpen }) {
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
    };

    return (
        <header className="topbar">
            <div className="topbar-left">
                <button
                    className="mobile-menu-btn"
                    onClick={() => setSidebarOpen(true)}
                >
                    <i className="fa-solid fa-bars"></i>
                </button>

                <div>
                    <h2>Welcome back{user?.name ? `, ${user.name}` : ""}</h2>
                    <p>Continue your learning journey</p>
                </div>
            </div>

            <div className="topbar-right">
                <button className="topbar-icon-btn">
                    <i className="fa-solid fa-bell"></i>
                </button>

                <div className="topbar-user">
                    <div className="topbar-avatar">
                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>

                    <div>
                        <strong>{user?.name || "Student"}</strong>
                        <p>{user?.email || ""}</p>
                    </div>
                </div>

                <button
                    className="topbar-logout"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>
        </header>
    );
}

export default Navbar;