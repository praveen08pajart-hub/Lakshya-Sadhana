import { useNavigate } from "react-router-dom";

function NotFound() {
    const navigate = useNavigate();

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: "12px"
            }}
        >
            <h1>404</h1>
            <h2>Page Not Found</h2>

            <button onClick={() => navigate("/")}>
                Go to Login
            </button>
        </div>
    );
}

export default NotFound;