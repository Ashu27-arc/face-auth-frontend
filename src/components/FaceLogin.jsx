import { useEffect, useRef, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  getFaceEmbedding,
  base64ToEmbedding,
  matchEmbedding
} from "../utils/faceUtils";
import { AuthContext } from "../context/AuthContext";

export default function FaceLogin() {
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [msg, setMsg] = useState("Show your face");

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
      setMsg("Camera access denied");
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

  const attemptLogin = async () => {
    setMsg("Scanning...");

    try {
      // Step 1: Get all user embeddings
      const res = await axios.get("http://localhost:5000/api/auth/users");
      const users = res.data;

      // Step 2: Capture current face
      const currentEmbedding = await getFaceEmbedding(videoRef.current);
      if (!currentEmbedding) {
        setMsg("No face detected");
        return;
      }

      let bestUser = null;
      let bestScore = 0;

      for (const user of users) {
        if (!user.faceEmbedding) continue;

        const stored = base64ToEmbedding(user.faceEmbedding);
        const similarity = matchEmbedding(currentEmbedding, stored);

        if (similarity > bestScore) {
          bestScore = similarity;
          bestUser = user;
        }
      }

      if (bestScore > 0.85) {
        const token = (await axios.post("http://localhost:5000/api/auth/face-login", {
          userId: bestUser._id
        })).data.token;

        await login(token);
        
        // Navigate based on user role
        const userRes = await axios.get("http://localhost:5000/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Stop camera before navigating
        stopCamera();
        
        if (userRes.data.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      } else {
        setMsg("Face not matched");
      }
    } catch (error) {
      console.error("Login error:", error);
      setMsg("Login failed. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center">
      <video ref={videoRef} className="w-64 rounded shadow" />
      <p className="text-lg mt-4">{msg}</p>

      <button
        onClick={attemptLogin}
        className="mt-4 bg-green-600 text-white px-6 py-2 rounded"
      >
        Login with Face
      </button>
    </div>
  );
}
