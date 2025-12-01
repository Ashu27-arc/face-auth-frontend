import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  getFaceEmbedding,
  embeddingToBase64
} from "../utils/faceUtils";

export default function FaceRegister({ userData }) {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [message, setMessage] = useState("Scan your face");

  useEffect(() => {
    startCamera();
    
    // Cleanup: Stop camera when component unmounts
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = () => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(err => console.log("Play error:", err));
      }
    }).catch(err => {
      console.error("Camera error:", err);
      setMessage("Camera access denied ❌");
    });
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const captureFace = async () => {
    try {
      const emb = await getFaceEmbedding(videoRef.current);
      if (!emb) {
        setMessage("Face not detected ❌");
        return;
      }

      const base64 = embeddingToBase64(emb);
      setMessage("Face captured ✔");

      await axios.post("http://localhost:5000/api/auth/register", {
        ...userData,
        faceEmbedding: base64,
      });

      // Stop camera before reloading
      stopCamera();
      
      alert("Face updated successfully!");
      window.location.reload(); // Reload to show updated data
    } catch (err) {
      alert("Failed to update face: " + (err.response?.data?.message || "Unknown error"));
      setMessage("Failed to update face ❌");
    }
  };

  return (
    <div className="flex flex-col items-center">
      <video ref={videoRef} className="w-64 rounded shadow" />

      <p className="text-lg mt-4">{message}</p>

      <button
        onClick={captureFace}
        className="mt-4 bg-blue-600 text-white px-6 py-2 rounded"
      >
        Capture Face
      </button>
    </div>
  );
}
