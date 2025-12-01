import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const submit = async () => {
        try {
            const res = await axios.post("http://localhost:5000/api/auth/login", {
                email,
                password
            });

            await login(res.data.token);
            
            // Navigate based on user role
            const userRes = await axios.get("http://localhost:5000/api/auth/profile", {
                headers: { Authorization: `Bearer ${res.data.token}` }
            });
            
            if (userRes.data.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/dashboard");
            }

        } catch (err) {
            alert("Login failed: " + (err.response?.data?.message || "Unknown error"));
        }
    };

    return (
        <div className="h-screen flex justify-center items-center bg-gray-200">
            <div className="p-8 bg-white shadow-lg rounded-xl w-96">
                <h2 className="text-2xl font-bold mb-4">Login</h2>

                <input onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full p-2 border mb-3 rounded" />

                <input onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    type="password"
                    className="w-full p-2 border mb-3 rounded"
                    autoComplete="current-password" />

                <button onClick={submit}
                    className="w-full bg-blue-600 text-white py-2 rounded">
                    Login
                </button>

                <Link to="/face-login" className="block mt-3 text-green-600 font-semibold text-center">
                    Login With Face Scanner
                </Link>

                <Link to="/register" className="block mt-3 text-blue-600 text-center">
                    Create Account
                </Link>
            </div>
        </div>
    );
}