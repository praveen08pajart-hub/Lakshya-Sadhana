import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getResponseData } from "../utils/api";

const API_URL = import.meta.env.VITE_API_URL;

function Register() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                `${API_URL}/api/auth/register`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        password
                    })
                }
            );

            const data = await getResponseData(response);

            if (response.ok) {
                navigate("/");
            } else {
                setError(
                    data.message ||
                    "Registration failed. Please try again."
                );
            }

        } catch (error) {
            console.log("Registration error:", error);

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

                <h1>Create Account</h1>
                <p>Start your learning journey</p>

                <form onSubmit={handleSubmit}>

                    <input
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) =>
                            setName(e.target.value)
                        }
                        required
                    />

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
                            placeholder="Create a password"
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
                            aria-label={
                                showPassword
                                    ? "Hide password"
                                    : "Show password"
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
                            ? "Creating account..."
                            : "Register"}
                    </button>

                </form>

                <p>
                    Already have an account?{" "}
                    <span
                        onClick={() =>
                            navigate("/")
                        }
                    >
                        Login
                    </span>
                </p>

            </div>
        </div>
    );
}

export default Register;