import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminCreateUser() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const submit = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/auth/admin/create",
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("User created successfully!");
      navigate("/admin");
    } catch (err) {
      alert("Failed to create user: " + (err.response?.data?.message || "Unknown error"));
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gray-200">
      <div className="p-8 bg-white rounded-xl shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Create User</h2>

        <input placeholder="Name" className="w-full p-2 border mb-3 rounded"
          onChange={(e) => setData({ ...data, name: e.target.value })}
        />

        <input placeholder="Email" className="w-full p-2 border mb-3 rounded"
          onChange={(e) => setData({ ...data, email: e.target.value })}
        />

        <input placeholder="Password" type="password" className="w-full p-2 border mb-3 rounded"
          onChange={(e) => setData({ ...data, password: e.target.value })}
        />

        <select
          className="w-full p-2 border mb-3 rounded"
          onChange={(e) => setData({ ...data, role: e.target.value })}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <button onClick={submit} className="w-full bg-blue-600 text-white py-2 rounded">
          Create
        </button>
      </div>
    </div>
  );
}
