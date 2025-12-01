import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  getFaceEmbedding,
  embeddingToBase64
} from "../utils/faceUtils";

export default function AdminFaceRegister() {
  const navigate = useNavigate();
  const { id: userId } = useParams();
  const videoRef = useRef(null);
  const [msg, setMsg] = useState("Align user's face in camera");

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(err => console.log("Play error:", err));
      }
    }).catch(err => {
      console.error("Camera error:", err);
      setMsg("Camera access denied ❌");
    });
  }, []);

  const capture = async () => {
    try {
      const emb = await getFaceEmbedding(videoRef.current);
      if (!emb) {
        setMsg("No face detected!");
        return;
      }

      const base64 = embeddingToBase64(emb);
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/auth/admin/create",
        {
          faceEmbedding: base64,
          updateFaceOnly: true,
          userId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Face registered successfully!");
      navigate("/admin");
    } catch (err) {
      alert("Failed to register face: " + (err.response?.data?.message || "Unknown error"));
    }
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-200">
      <video ref={videoRef} className="w-64 rounded shadow" />
      <p className="mt-4">{msg}</p>

      <button
        onClick={capture}
        className="mt-4 bg-blue-600 text-white px-6 py-2 rounded"
      >
        Capture Face
      </button>
    </div>
  );
}
