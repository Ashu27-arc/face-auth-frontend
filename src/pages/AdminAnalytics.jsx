import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminAnalytics() {
  const [logs, setLogs] = useState([]);

  const fetchLogs = async () => {
    const token = localStorage.getItem("token");

    const res = await axios.get(
      "http://localhost:5000/api/auth/admin/logs",
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setLogs(res.data);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4">Analytics</h1>

      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-3">Login Activity</h2>

        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">User</th>
              <th className="p-2 border">Method</th>
              <th className="p-2 border">Time</th>
            </tr>
          </thead>

          <tbody>
            {logs.map((log) => (
              <tr key={log._id} className="border">
                <td className="p-2 border">{log.userId.name}</td>
                <td className="p-2 border">{log.method}</td>
                <td className="p-2 border">{new Date(log.time).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
}
