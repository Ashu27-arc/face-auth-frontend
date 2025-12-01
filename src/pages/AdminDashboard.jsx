import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import AdminReAuthModal from "../components/AdminReAuthModal";

export default function AdminDashboard() {
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [showReauth, setShowReauth] = useState(false);
    const [pendingDelete, setPendingDelete] = useState(null);

    const confirmDelete = (id) => {
        setPendingDelete(id);
        setShowReauth(true);
    };



    const fetchUsers = async () => {
        const token = localStorage.getItem("token");
        const res = await axios.get(
            "http://localhost:5000/api/auth/admin/users",
            { headers: { Authorization: `Bearer ${token}` } }
        );
        setUsers(res.data);
    };

    const deleteUser = async (id) => {
        if (!confirm("Delete user?")) return;

        const token = localStorage.getItem("token");
        await axios.delete(
            `http://localhost:5000/api/auth/admin/delete/${id}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        fetchUsers();
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        const interval = setInterval(fetchUsers, 5000); // auto-refresh
        return () => clearInterval(interval);
    }, []);


    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="flex justify-between mb-4">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <button onClick={logout} className="bg-red-600 text-white px-4 py-2 rounded">
                    Logout
                </button>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-xl font-bold mb-4">All Users</h2>

                <table className="w-full border">
                    <thead>
                        <tr className="bg-gray-200 text-left">
                            <th className="p-2 border">Name</th>
                            <th className="p-2 border">Email</th>
                            <th className="p-2 border">Role</th>
                            <th className="p-2 border">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.map((u) => (
                            <tr key={u._id} className="border">
                                <td className="p-2 border">{u.name}</td>
                                <td className="p-2 border">{u.email}</td>
                                <td className="p-2 border">{u.role}</td>

                                <td className="p-2 border">
                                    <button
                                        onClick={() => confirmDelete(u._id)}
                                        className="bg-red-500 text-white px-3 py-1 rounded mr-2"
                                    >
                                        Delete
                                    </button>

                                    <button
                                        onClick={() => navigate(`/admin/register-face/${u._id}`)}
                                        className="bg-blue-500 text-white px-3 py-1 rounded"
                                    >
                                        Add Face
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <button
                    onClick={() => navigate("/admin/create-user")}
                    className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
                >
                    Create New User
                </button>
            </div>

            {showReauth && (
                <AdminReAuthModal
                    onCancel={() => setShowReauth(false)}
                    onSuccess={async () => {
                        setShowReauth(false);
                        await deleteUser(pendingDelete);
                    }}
                />
            )}
        </div>
    );
}
