import axios from "axios";
import { useState, useEffect } from "react";
import FaceRegister from "../components/FaceRegister";

export default function Profile() {
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");

  const fetchProfile = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/auth/profile",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setUser(res.data);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const updateField = async (field, value) => {
    await axios.post(
      "http://localhost:5000/api/auth/update",
      { field, value },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchProfile();
    alert("Updated!");
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="h-screen bg-gray-100 dark:bg-black flex flex-col p-4">
      <h1 className="text-3xl font-bold mb-4 text-gray-700 dark:text-white">
        Profile Settings
      </h1>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl">
        <p className="mb-2 text-gray-600 dark:text-gray-300">
          Name: {user.name}
        </p>

        <input
          placeholder="New Name"
          className="border p-2 mb-3 w-full"
          onKeyDown={(e) => {
            if (e.key === "Enter") updateField("name", e.target.value);
          }}
        />

        <p className="mb-2 text-gray-600 dark:text-gray-300">Email: {user.email}</p>

        <input
          placeholder="New Email"
          className="border p-2 mb-3 w-full"
          onKeyDown={(e) =>
            e.key === "Enter" && updateField("email", e.target.value)
          }
        />

        <input
          placeholder="New Password"
          type="password"
          className="border p-2 mb-3 w-full"
          onKeyDown={(e) =>
            e.key === "Enter" && updateField("password", e.target.value)
          }
        />

        <h2 className="mt-6 text-xl dark:text-white">Update Face</h2>
        <FaceRegister userData={user} />
      </div>
    </div>
  );
}
