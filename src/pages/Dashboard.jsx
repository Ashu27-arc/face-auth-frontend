import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import LiveCamera from "../components/LiveCamera";

export default function Dashboard() {
  const { logout } = useContext(AuthContext);
  const [locked, setLocked] = useState(false);

  const handleFaceLost = () => {
    setLocked(true);   // Blur UI
    logout();          // Remove token
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gray-100 relative">
      
      {/* Camera (always visible) */}
      <div className="absolute top-4 right-4 bg-white p-2 rounded-xl shadow-md">
        <LiveCamera onFaceLost={handleFaceLost} />
      </div>

      {/* Main UI */}
      <div className={`p-10 bg-white rounded-xl shadow-xl w-96 
           ${locked ? "blurred pointer-events-none" : "unblurred"}`}>

        <h1 className="text-3xl font-bold text-green-600 mb-4">
          Dashboard 🎉
        </h1>

        {!locked ? (
          <>
            <p className="mb-4 text-gray-700">Face detected — session active.</p>

            <button
              onClick={logout}
              className="bg-red-600 text-white px-6 py-2 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <p className="text-red-600 font-semibold">Session Locked — No face detected!</p>
        )}

      </div>
    </div>
  );
}
