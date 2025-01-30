import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';

const LiveCamera = () => {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const [isDetecting, setIsDetecting] = useState(false);

    const detectFaces = async () => {
        if (!webcamRef.current) return;
        
        const imageSrc = webcamRef.current.getScreenshot();
        const formData = new FormData();
        const blob = await fetch(imageSrc).then(res => res.blob());
        formData.append('file', blob, 'frame.jpg');

        try {
            const response = await axios.post(
                process.env.REACT_APP_API_URL + '/detect',
                formData
            );
            drawFaces(response.data.results);
        } catch (error) {
            console.error('Detection error:', error);
        }
    };

    const drawFaces = (faces) => {
        const canvas = canvasRef.current;
        if (!canvas || !faces) return;

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        faces.forEach(face => {
            ctx.strokeStyle = face.label === 'mask' ? 'green' : 'red';
            ctx.lineWidth = 2;
            ctx.strokeRect(face.x, face.y, face.width, face.height);
            
            ctx.fillStyle = face.label === 'mask' ? 'green' : 'red';
            ctx.fillRect(face.x, face.y - 20, face.width, 20);
            
            ctx.fillStyle = 'white';
            ctx.font = '14px Arial';
            ctx.fillText(
                `${face.label} (${Math.round(face.confidence * 100)}%)`,
                face.x + 5,
                face.y - 5
            );
        });
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (!isDetecting) {
                setIsDetecting(true);
                detectFaces().finally(() => setIsDetecting(false));
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="position-relative">
            <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="w-100"
            />
            <canvas
                ref={canvasRef}
                className="position-absolute top-0 start-0"
                style={{ pointerEvents: 'none' }}
                width={webcamRef.current?.video?.videoWidth}
                height={webcamRef.current?.video?.videoHeight}
            />
        </div>
    );
};

export default LiveCamera;