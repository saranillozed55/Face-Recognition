import Webcam from "react-webcam";
import { useCallback, useRef, useState, useEffect } from "react";
import * as faceapi from "face-api.js";

export default function Webcamcomp() {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const fileInputRef = useRef(null);

    const [modelsLoaded, setModelsLoaded] = useState(false);

    // null = haven't checked yet, true = it's you, false = no face / not you
    const [isMe, setIsMe] = useState(null);
    const [checking, setChecking] = useState(false);

    const[referenceFile, setReferenceFile] = useState(null);
    const[referencePreviewUrl, setReferencePreviewUrl] = useState(null);


    useEffect(() => {
        const loadModels = async () => {
            try {
                const MODEL_URL = "https://justadudewhohacks.github.io/face-api.js/models";
                await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
                setModelsLoaded(true);
            } catch (error) {
                console.error("Unable to load face detection model", error);
            }
        };
        loadModels();
    }, []);

    // Run face detection loop once models are ready
    useEffect(() => {
        if (!modelsLoaded) return;

        const interval = setInterval(async () => {
            const video = webcamRef.current?.video;
            const canvas = canvasRef.current;
            if (video && canvas && video.readyState === 4) {
                const displayWidth = video.clientWidth;
                const displayHeight = video.clientHeight;

                canvas.width = displayWidth;
                canvas.height = displayHeight;

                const detections = await faceapi.detectAllFaces(
                    video,
                    new faceapi.TinyFaceDetectorOptions()
                );

                const resized = faceapi.resizeResults(detections, {
                    width: displayWidth,
                    height: displayHeight,
                });

                const ctx = canvas.getContext("2d");
                ctx.clearRect(0, 0, displayWidth, displayHeight);

                resized.forEach((det) => {
                    const { x, y, width, height } = det.box;
                    ctx.strokeStyle = "#00FF00";
                    ctx.lineWidth = 3;
                    ctx.strokeRect(x, y, width, height);
                });
            }
        }, 150);

        return () => clearInterval(interval);
    }, [modelsLoaded]);

    const handleReferenceUpload = useCallback((event) => {
        
        const file = event.target.files?.[0];
        if(!file) return;

        setReferenceFile(file);
        setIsMe(null);

        if(referencePreviewUrl) {
            URL.revokeObjectURL(referencePreviewUrl)
        }

        setReferencePreviewUrl(URL.createObjectURL(file))
    },[referencePreviewUrl]);
    
    //identify logic
    const dataURLtoFile = (dataUrl, filename) => {
        const arr = dataUrl.split(",");
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    };

    const handleIdentifyClick = useCallback(async () => {
        if(!referenceFile) {
            console.error("Please upload a reference photo.");
            return;
        }
        const screenshot = webcamRef.current.getScreenshot();


        if (!screenshot) {
            console.error("Could not capture frame from webcam");
            setIsMe(false);
            return;
        }

        setChecking(true);
        const webcamFile = dataURLtoFile(screenshot, "webcam-capture.jpg");
        const formData = new FormData();
        formData.append("reference", referenceFile);
        formData.append("webcam", webcamFile)

        try {
            const response = await fetch("http://localhost:8000/api/verify", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                setIsMe(false);
                return;
            }

            const data = await response.json();
            setIsMe(data.samePerson === true);
        } catch (err) {
            console.error("Error calling identify:", err);
            setIsMe(false);
        } finally {
            setChecking(false);
        }
    }, [referenceFile]);

    return (
        <>
            <div className="flex flex-col h-screen items-center justify-center gap-4">
                <h1 className = "text-2xl font-mono text-white font-bold">
                    {checking
                        ? "Checking..."
                        : isMe === null
                        ? "Press Identify Me To Start..."
                        : isMe
                        ? "True"
                        : "False"}
                </h1>

                <div className="flex flex-col items-center gap-2">
                    <input className = "text-white font-mono" type="file" accept ="image/*" ref={fileInputRef} onChange={handleReferenceUpload}/>
                    {referencePreviewUrl && (
                        <img src = {referencePreviewUrl} alt = "Reference" style={{ width: 120, height: 120, objectFit: "cover", borderRadius: 8 }}/>
                    )}
                </div>

                <div style={{ position: "relative", width: 640, height: 480 }}>
                    <Webcam
                        className = "rounded-3xl"
                        audio={false}
                        ref={webcamRef}
                        width={640}
                        height={480}
                        screenshotFormat="image/jpeg"
                        style={{ position: "absolute", top: 0, left: 0 }}
                    />
                    <canvas
                        ref={canvasRef}
                        width={640}
                        height={480}
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            pointerEvents: "none",
                        }}
                    />
                </div>

                <div>
                    <button className ="bg-gray-500
                        font-mono text-white rounded cursor-pointer p-2" onClick={handleIdentifyClick} disabled={checking}>
                        Identify Me
                    </button>
                </div>
            </div>
        </>
    );
}