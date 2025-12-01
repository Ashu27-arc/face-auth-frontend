import { useEffect, useRef } from "react";
import useFaceTracker from "../hooks/useFaceTracker";

export default function LiveCamera({ onFaceLost }) {
  const videoRef = useRef(null);
  const facePresent = useFaceTracker(videoRef);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(err => console.log("Play error:", err));
      }
    }).catch(err => {
      console.error("Camera error:", err);
    });
  }, []);

  useEffect(() => {
    let timeout;

    if (!facePresent) {
      timeout = setTimeout(() => {
        onFaceLost(); // Trigger auto-lock
      }, 5000); // 5 sec no-face → lock
    }

    return () => clearTimeout(timeout);
  }, [facePresent, onFaceLost]);

  return (
    <video
      ref={videoRef}
      className="rounded-xl w-48 shadow-lg border border-gray-300"
    />
  );
}
