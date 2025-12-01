import { useState, useRef } from "react";
import {
  getFaceEmbedding,
  base64ToEmbedding,
  matchEmbedding
} from "../utils/faceUtils";
import axios from "axios";

export default function AdminReAuthModal({ onSuccess, onCancel }) {
  const videoRef = useRef();
  const [msg, setMsg] = useState("Look at the camera");

  const startCamera = () => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(err => console.log("Play error:", err));
      }
    }).catch(err => {
      console.error("Camera error:", err);
      setMsg("Camera access denied");
    });
  };

  const verify = async () => {
    setMsg("Verifying...");

    const token = localStorage.getItem("token");
    const admin = await axios.get(
      "http://localhost:5000/api/auth/profile",
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const stored = base64ToEmbedding(admin.data.faceEmbedding);
    const current = await getFaceEmbedding(videoRef.current);

    if (!current) return setMsg("Face not found!");

    const score = matchEmbedding(current, stored);

    if (score > 0.85) {
      onSuccess();
    } else {
      setMsg("Face mismatch!");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl shadow-xl text-center">
        <h2 className="text-xl font-bold mb-4">Admin Verification</h2>

        <video
          ref={videoRef}
          onClick={startCamera}
          className="w-64 rounded shadow cursor-pointer"
        />

        <p className="mt-3">{msg}</p>

        <div className="flex gap-3 mt-4 justify-center">
          <button onClick={verify} className="bg-green-600 text-white px-4 py-2 rounded">
            Verify Face
          </button>

          <button onClick={onCancel} className="bg-gray-600 text-white px-4 py-2 rounded">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
