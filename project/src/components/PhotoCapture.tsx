import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, RefreshCw } from 'lucide-react';

interface PhotoCaptureProps {
  onPhotoCapture: (photoData: string) => void;
  initialPhoto?: string;
}

const PhotoCapture: React.FC<PhotoCaptureProps> = ({ onPhotoCapture, initialPhoto }) => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [photoTaken, setPhotoTaken] = useState<string | null>(initialPhoto || null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (isCameraActive) {
      startCamera();
    } else {
      stopCamera();
    }
    
    return () => {
      stopCamera();
    };
  }, [isCameraActive]);
  
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setError(null);
    } catch (err) {
      setError("Impossible d'accéder à la caméra. Veuillez vérifier les permissions.");
      setIsCameraActive(false);
      console.error(err);
    }
  };
  
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };
  
  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const photoData = canvas.toDataURL('image/jpeg');
        setPhotoTaken(photoData);
        onPhotoCapture(photoData);
        setIsCameraActive(false);
      }
    }
  };
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const photoData = e.target?.result as string;
        setPhotoTaken(photoData);
        onPhotoCapture(photoData);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const resetPhoto = () => {
    setPhotoTaken(null);
    onPhotoCapture('');
  };
  
  return (
    <div className="flex flex-col items-center bg-white rounded-lg shadow-md p-4 max-w-md mx-auto">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Photo du Participant</h2>
      
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4 w-full">
          {error}
        </div>
      )}
      
      <div className="relative w-full h-64 mb-4 bg-gray-100 rounded-md overflow-hidden">
        {isCameraActive ? (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="w-full h-full object-cover"
          />
        ) : photoTaken ? (
          <img 
            src={photoTaken} 
            alt="Photo du participant" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-gray-400">
            <Camera size={48} />
          </div>
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>
      
      <div className="flex flex-wrap gap-2 w-full justify-center">
        {!photoTaken ? (
          <>
            <button
              onClick={() => setIsCameraActive(prev => !prev)}
              className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              <Camera size={18} className="mr-2" />
              {isCameraActive ? "Désactiver la caméra" : "Activer la caméra"}
            </button>
            
            {isCameraActive && (
              <button
                onClick={takePhoto}
                className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                Prendre la photo
              </button>
            )}
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              <Upload size={18} className="mr-2" />
              Télécharger une photo
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </>
        ) : (
          <button
            onClick={resetPhoto}
            className="flex items-center bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            <RefreshCw size={18} className="mr-2" />
            Changer de photo
          </button>
        )}
      </div>
    </div>
  );
};

export default PhotoCapture;