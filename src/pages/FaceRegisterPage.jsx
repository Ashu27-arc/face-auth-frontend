import { useEffect, useRef, useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  getFaceEmbedding,
  embeddingToBase64
} from "../utils/faceUtils";
import { AuthContext } from "../context/AuthContext";

export default function FaceRegisterPage() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const videoRef = useRef(null);
  const [message, setMessage] = useState("Position your face in the camera");
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [faceEmbedding, setFaceEmbedding] = useState(null);
  const [step, setStep] = useState(1); // 1: capture face, 2: fill details

  useEffect(() => {
    startCamera();
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

  const captureFace = async () => {
    setMessage("Scanning...");
    const emb = await getFaceEmbedding(videoRef.current);
    
    if (!emb) {
      setMessage("Face not detected ❌ Try again");
      return;
    }

    const base64 = embeddingToBase64(emb);
    setFaceEmbedding(base64);
    setMessage("Face captured ✔");
    
    // Stop camera
    const stream = videoRef.current.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach(track => track.stop());
    
    // Move to next step
    setStep(2);
  };

  const submitRegistration = async () => {
    if (!userData.name || !userData.email || !userData.password) {
      alert("Please fill all fields");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        ...userData,
        faceEmbedding,
      });

      // Auto login after registration
      const loginRes = await axios.post("http://localhost:5000/api/auth/login", {
        email: userData.email,
        password: userData.password
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
        <h2 className="text-2xl font-bold mb-4">Register with Face</h2>

        {step === 1 ? (
          // Step 1: Capture Face
          <div className="flex flex-col items-center">
            <video ref={videoRef} className="w-64 rounded shadow mb-4" />
            <p className="text-lg mb-4">{message}</p>

            <button
              onClick={captureFace}
              className="w-full bg-green-600 text-white py-2 rounded mb-3"
            >
              Capture Face
            </button>

            <Link to="/register" className="text-blue-600 text-center">
              Register without Face
            </Link>
          </div>
        ) : (
          // Step 2: Fill Details
          <div>
            <p className="text-green-600 mb-4 text-center">✔ Face captured successfully!</p>

            <input
              placeholder="Name"
              value={userData.name}
              onChange={(e) => setUserData({ ...userData, name: e.target.value })}
              className="w-full p-2 border mb-3 rounded"
            />

            <input
              placeholder="Email"
              value={userData.email}
              onChange={(e) => setUserData({ ...userData, email: e.target.value })}
              className="w-full p-2 border mb-3 rounded"
            />

            <input
              placeholder="Password"
              type="password"
              value={userData.password}
              onChange={(e) => setUserData({ ...userData, password: e.target.value })}
              className="w-full p-2 border mb-3 rounded"
              autoComplete="new-password"
            />

            <button
              onClick={submitRegistration}
              className="w-full bg-blue-600 text-white py-2 rounded mb-3"
            >
              Complete Registration
            </button>

            <button
              onClick={() => {
                setStep(1);
                setFaceEmbedding(null);
                startCamera();
              }}
              className="w-full bg-gray-600 text-white py-2 rounded"
            >
              Retake Face Photo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
