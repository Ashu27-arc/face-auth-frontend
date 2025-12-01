import * as blazeface from "@tensorflow-models/blazeface";
import * as tf from "@tensorflow/tfjs";

// Load model once
let model = null;

export const loadModel = async () => {
    if (!model) {
        model = await blazeface.load();
    }
    return model;
};

// Generate embedding (128-d)
export const getFaceEmbedding = async (video) => {
    const net = await loadModel();
    const predictions = await net.estimateFaces(video, false);

    if (!predictions || predictions.length === 0) return null;

    // Get face box
    const face = predictions[0];
    const [x, y] = face.topLeft;
    const [w, h] = [
        face.bottomRight[0] - face.topLeft[0],
        face.bottomRight[1] - face.topLeft[1],
    ];

    // Create tensor from video
    const input = tf.browser.fromPixels(video);

    // Crop to face
    const cropped = tf.image.cropAndResize(
        input.expandDims(0),
        [
            [y / input.shape[0], x / input.shape[1], (y + h) / input.shape[0], (x + w) / input.shape[1]]
        ],
        [0],
        [128, 128]
    );

    // Convert to grayscale + flatten
    const gray = cropped.mean(3);
    const emb = gray.flatten().div(255); // normalize

    const arr = Array.from(await emb.data());

    return arr;
};

// Convert array → base64
export const embeddingToBase64 = (arr) => {
    return btoa(JSON.stringify(arr));
};

// Convert base64 → array
export const base64ToEmbedding = (str) => {
    return JSON.parse(atob(str));
};

// Cosine similarity
export const matchEmbedding = (emb1, emb2) => {
    if (!emb1 || !emb2) return 0;

    let dot = 0,
        mag1 = 0,
        mag2 = 0;

    for (let i = 0; i < emb1.length; i++) {
        dot += emb1[i] * emb2[i];
        mag1 += emb1[i] * emb1[i];
        mag2 += emb2[i] * emb2[i];
    }

    return dot / (Math.sqrt(mag1) * Math.sqrt(mag2));
};