import { useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
    };

    return (
        <nav className="navbar">
            <h2 onClick={() => navigate("/dashboard")}>
                Lakshya Sadhana
            </h2>

            <div className="navbar-actions">
                <button onClick={() => navigate("/dashboard")}>
                    Dashboard
                </button>

                <button onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </nav>
    );
}

export default Navbar;