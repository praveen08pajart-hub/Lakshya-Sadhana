import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getResponseData } from "../utils/api";

const API_URL = import.meta.env.VITE_API_URL;

function Login() {
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                `${API_URL}/api/auth/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );

            const data = await getResponseData(response);

            if (response.ok) {
                localStorage.setItem(
                    "token",
                    data.token
                );

                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );

                navigate("/dashboard");
            } else {
                setError(
                    data.message ||
                    "Login failed. Please check your details."
                );
            }

        } catch (error) {
            console.log("Login error:", error);

            setError(
                "Unable to connect to server. Please try again."
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">

                <h1>Welcome Back</h1>

                <p>
                    Login to continue your learning journey
                </p>

                <form onSubmit={handleSubmit}>

                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        required
                    />

                    <div className="password-field">

                        <input
                            type={
                                showPassword
                                    ? "text"
                                    : "password"
                            }
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            required
                        />

                        <button
                            type="button"
                            className="password-eye"
                            onClick={() =>
                                setShowPassword(
                                    !showPassword
                                )
                            }
                        >
                            {showPassword ? (
                                <i className="fa-solid fa-eye-slash"></i>
                            ) : (
                                <i className="fa-solid fa-eye"></i>
                            )}
                        </button>

                    </div>

                    {error && (
                        <p className="form-error">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Logging in..."
                            : "Login"}
                    </button>

                </form>

                <p>
                    Don't have an account?{" "}
                    <span
                        onClick={() =>
                            navigate("/register")
                        }
                    >
                        Register
                    </span>
                </p>

            </div>
        </div>
    );
}

export default Login;