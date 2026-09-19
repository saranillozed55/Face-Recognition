
import Webcam from "react-webcam";
import { useCallback, useRef, useState } from "react";

export default function Webcamcomp() {
    const webcamRef = useRef(null);
    const mediaRecorderRef = useRef(null);

    const [capturing, setCapturing] = useState(false);
    const [recordedChunks, setRecordedChunks] = useState([]);

    const handleDataAvailable = useCallback(({ data }) => {
        if (data.size > 0) {
            setRecordedChunks((prev) => prev.concat(data));
        }
    }, []);

    const handleStartCaptureClick = useCallback(() => {
        setCapturing(true);

        mediaRecorderRef.current = new MediaRecorder(
            webcamRef.current.stream,
            {
                mimeType: "video/webm"
            }
        );

        mediaRecorderRef.current.addEventListener(
            "dataavailable",
            handleDataAvailable
        );

        mediaRecorderRef.current.start();
    }, [handleDataAvailable]);


    const handleStopCaptureClick = useCallback(() => {
        mediaRecorderRef.current.stop();
        setCapturing(false);
    }, []);

    const handleDownload = useCallback(() => {
        if (recordedChunks.length) {
            const blob = new Blob(recordedChunks, {
                type: "video/webm"
            });

            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");

            document.body.appendChild(a);
            a.style = "display: none";
            a.href = url;
            a.download = "react-webcam-stream-capture.webm";

            a.click();

            window.URL.revokeObjectURL(url);
            setRecordedChunks([]);
        }
    }, [recordedChunks]);

    return (
        <>
            <div className="flex flex-col h-screen items-center justify-center gap-y-5">
                <Webcam
                    audio={false}
                    ref={webcamRef}
                />
                <div className = "">
                    {capturing ? ( <button className = "bg-gray-800 rounded text-white" onClick={handleStopCaptureClick}> Stop Capture </button>) : (
                    <button className ="bg-gray-800 rounded text-white" onClick={handleStartCaptureClick}>
                        Start Capture
                    </button>
                    )}
                </div>

            {/* {recordedChunks.length > 0 && (
                <button onClick={handleDownload}>
                    Download
                </button>
            )} */}

            </div>
        </>
    );
}