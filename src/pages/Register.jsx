import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function Register() {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);
    const [data, setData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const submit = async () => {
        try {
            await axios.post("http://localhost:5000/api/auth/register", data);
            
            // Auto login after registration
            const loginRes = await axios.post("http://localhost:5000/api/auth/login", {
                email: data.email,
                password: data.password
            });
            
            await login(loginRes.data.token);
            alert("Registration successful! Welcome!");
            navigate("/dashboard");
        } catch (err) {
            alert("Registration failed: " + (err.response?.data?.message || "Unknown error"));
        }
    };

    return (
        <div className="h-screen flex justify-center items-center bg-gray-200">
            <div className="p-8 bg-white shadow-lg rounded-xl w-96">
                <h2 className="text-2xl font-bold mb-4">Register</h2>

                <input placeholder="Name"
                    onChange={(e) => setData({ ...data, name: e.target.value })}
                    className="w-full p-2 border mb-3 rounded" />

                <input placeholder="Email"
                    onChange={(e) => setData({ ...data, email: e.target.value })}
                    className="w-full p-2 border mb-3 rounded" />

                <input placeholder="Password" type="password"
                    onChange={(e) => setData({ ...data, password: e.target.value })}
                    className="w-full p-2 border mb-3 rounded"
                    autoComplete="new-password" />

                <button onClick={submit}
                    className="w-full bg-blue-600 text-white py-2 rounded">
                    Register
                </button>

                <Link to="/face-register" className="block mt-3 text-green-600 font-semibold text-center">
                    Register with Face Scanner
                </Link>

                <Link to="/login" className="block mt-2 text-blue-600 text-center">
                    Already have an account? Login
                </Link>
            </div>
        </div>
    );
}
