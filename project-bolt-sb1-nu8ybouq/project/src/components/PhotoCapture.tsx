import React, { useRef, useState, useEffect } from 'react';

export const PhotoCapture: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    return () => {
      // Cleanup function to stop the camera when component unmounts
      if (isCapturing) {
        stopCamera();
      }
    };
  }, [isCapturing]);
  
  const startCamera = async () => {
    setError(null);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setIsCapturing(true);
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Unable to access camera. Please ensure you have given permission and have a working camera.');
    }
  };
  
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    
    setIsCapturing(false);
  };
  
  const capturePhoto = () => {
    if (!canvasRef.current || !videoRef.current) return;
    
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw the current video frame on the canvas
    const context = canvas.getContext('2d');
    if (context) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert canvas to data URL
      const dataUrl = canvas.toDataURL('image/png');
      setCapturedImage(dataUrl);
      
      // Stop camera after capturing
      stopCamera();
    }
  };
  
  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };
  
  const savePhoto = () => {
    if (!capturedImage) return;
    
    try {
      // In a real app, you'd probably upload this to a server or store it
      // For now, we'll just store it in localStorage
      localStorage.setItem('visitor_photo', capturedImage);
      
      alert('Photo saved successfully!');
    } catch (err) {
      console.error('Error saving photo:', err);
      setError('Error saving photo. Please try again.');
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Photo Capture</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="flex flex-col items-center">
        {capturedImage ? (
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Captured Image</h3>
            <img
              src={capturedImage}
              alt="Captured"
              className="max-w-full h-auto border rounded"
            />
          </div>
        ) : (
          <div className="relative w-full max-w-lg mb-4">
            <video
              ref={videoRef}
              className={`w-full h-auto border rounded ${isCapturing ? 'block' : 'hidden'}`}
              autoPlay
              playsInline
              muted
            />
            
            {!isCapturing && (
              <div className="bg-gray-100 border rounded flex items-center justify-center" style={{ height: '320px' }}>
                <p className="text-gray-500">Camera is not active</p>
              </div>
            )}
          </div>
        )}
        
        <canvas ref={canvasRef} className="hidden" />
        
        <div className="flex space-x-4 mt-4">
          {!isCapturing && !capturedImage && (
            <button onClick={startCamera} className="btn btn-primary">
              Start Camera
            </button>
          )}
          
          {isCapturing && (
            <>
              <button onClick={capturePhoto} className="btn btn-primary">
                Capture
              </button>
              <button onClick={stopCamera} className="btn btn-secondary">
                Cancel
              </button>
            </>
          )}
          
          {capturedImage && (
            <>
              <button onClick={savePhoto} className="btn btn-primary">
                Save Photo
              </button>
              <button onClick={retakePhoto} className="btn btn-secondary">
                Retake
              </button>
            </>
          )}
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-gray-50 rounded">
        <h3 className="text-lg font-medium mb-2">Instructions</h3>
        <ol className="list-decimal ml-5 space-y-2">
          <li>Click "Start Camera" to activate your device's camera</li>
          <li>Position your face in the frame, ensuring good lighting</li>
          <li>Click "Capture" to take the photo</li>
          <li>Review the captured image</li>
          <li>Click "Save Photo" to store the image or "Retake" if needed</li>
        </ol>
      </div>
    </div>
  );
};