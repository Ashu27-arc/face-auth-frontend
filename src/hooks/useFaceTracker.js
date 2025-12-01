import {
    useEffect,
    useState
} from "react";
import {
    getFaceEmbedding
} from "../utils/faceUtils";

export default function useFaceTracker(videoRef) {
    const [facePresent, setFacePresent] = useState(false);

    useEffect(() => {
        const interval = setInterval(async () => {
            if (!videoRef.current) return;

            const emb = await getFaceEmbedding(videoRef.current);
            setFacePresent(Boolean(emb));
        }, 600); // Every 0.6 sec

        return () => clearInterval(interval);
    }, [videoRef]);

    return facePresent;
}