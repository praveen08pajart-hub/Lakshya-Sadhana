const API_URL = import.meta.env.VITE_API_URL;
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState(""); //store input value
    const [password, setPassword] = useState("");

    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));

                navigate("/dashboard"); //login success
            } else {
                alert(data.message);
            }



        } catch (error) {
            console.log("Login error:", error)
        }
    };
    return (
        <div className="login-page">
            <div className="login-card">

                <h1>Welcome Back</h1>
                <p>Login to continue your learning journey</p>

                <form onSubmit={handleSubmit}>

                    <input type="email"
                        placeholder="enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <div className="password-field">
                        <input type={showPassword ? "text" : "password"}
                            placeholder="enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            className="password-eye"
                            onClick={() =>
                                setShowPassword(!showPassword)
                            }>
                            {showPassword ? (
                                <i class="fa-solid fa-eye-slash"></i>

                            ) : (
                                <i class="fa-solid fa-eye"></i>)}
                        </button>
                    </div>

                    <button type="submit">
                        Login
                    </button>

                </form>

                <p>
                    Don't have an account?{" "}
                    <span onClick={() => navigate("/register")}>
                        Register
                    </span>
                </p>
            </div >
        </div >
    );
}
export default Login;