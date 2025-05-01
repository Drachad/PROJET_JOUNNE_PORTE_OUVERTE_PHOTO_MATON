"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Camera, Upload, ArrowLeft, CameraIcon, Info } from "lucide-react"

interface PhotoCaptureProps {
  onCapture: (photoDataUrl: string) => void
  onBack: () => void
}

const PhotoCapture: React.FC<PhotoCaptureProps> = ({ onCapture, onBack }) => {
  const [mode, setMode] = useState<"select" | "camera" | "upload">("select")
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const [showTip, setShowTip] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Clean up function for camera stream
  const stopCameraStream = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
  }

  // Initialize camera
  const startCamera = async () => {
    try {
      setError(null)
      setMode("camera")
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
      })

      setStream(mediaStream)

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
      setError("Impossible d'accéder à la caméra. Veuillez vérifier vos permissions.")
      setMode("select")
    }
  }

  // Take photo
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return

    setIsCapturing(true)

    const video = videoRef.current
    const canvas = canvasRef.current

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw video frame to canvas
    const context = canvas.getContext("2d")
    if (context) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height)

      // Get data URL
      const photoDataUrl = canvas.toDataURL("image/png")

      // Stop camera stream
      stopCameraStream()

      // Send photo data to parent
      onCapture(photoDataUrl)
    }

    setIsCapturing(false)
  }

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (file) {
      const reader = new FileReader()

      reader.onload = (e) => {
        const result = e.target?.result as string
        if (result) {
          onCapture(result)
        }
      }

      reader.onerror = () => {
        setError("Erreur lors de la lecture du fichier.")
      }

      reader.readAsDataURL(file)
    }
  }

  // Trigger file input click
  const triggerFileUpload = () => {
    fileInputRef.current?.click()
  }

  // Handle back button
  const handleBack = () => {
    stopCameraStream()
    if (mode === "select") {
      onBack()
    } else {
      setMode("select")
    }
  }

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopCameraStream()
    }
  }, [])

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden transition-all">
      {/* Back button */}
      <div className="p-4 bg-gray-50 border-b">
        <button onClick={handleBack} className="flex items-center text-gray-600 hover:text-gray-900">
          <ArrowLeft size={16} className="mr-1" />
          <span>{mode === "select" ? "Retour au formulaire" : "Retour aux options"}</span>
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        {mode === "select" && (
          <div className="space-y-6">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-green-100 p-3 rounded-full">
                <CameraIcon size={32} className="text-green-700" />
              </div>
            </div>

            <h2 className="text-xl font-bold text-center mb-6">Choisissez une option</h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <button
                onClick={startCamera}
                className="flex flex-col items-center p-6 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
              >
                <Camera size={36} className="text-green-700 mb-3" />
                <span className="font-medium">Prendre une photo</span>
                <span className="text-sm text-gray-500 mt-1">Utiliser la caméra</span>
              </button>

              <button
                onClick={triggerFileUpload}
                className="flex flex-col items-center p-6 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
              >
                <Upload size={36} className="text-green-700 mb-3" />
                <span className="font-medium">Télécharger</span>
                <span className="text-sm text-gray-500 mt-1">Choisir une image</span>
              </button>

              <input type="file" ref={fileInputRef} accept="image/*" onChange={handleFileUpload} className="hidden" />
            </div>

            <div className="mt-4">
              <button
                onClick={() => setShowTip(!showTip)}
                className="flex items-center text-sm text-gray-600 hover:text-green-700"
              >
                <Info size={16} className="mr-1" />
                <span>Conseils pour une meilleure photo</span>
              </button>

              {showTip && (
                <div className="mt-2 p-3 bg-blue-50 rounded-md text-sm text-gray-700">
                  <p>Pour un meilleur résultat:</p>
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>Tenez-vous devant un fond uni (idéalement blanc ou clair)</li>
                    <li>Assurez-vous d'être bien éclairé(e) de face</li>
                    <li>Évitez les vêtements de la même couleur que le fond</li>
                    <li>Cadrez-vous au centre de l'image</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {mode === "camera" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-center mb-4">Prendre une photo</h2>

            <div className="relative bg-black rounded-lg overflow-hidden">
              {error ? (
                <div className="p-4 text-center text-red-500">{error}</div>
              ) : (
                <>
                  <video ref={videoRef} autoPlay playsInline className="w-full h-auto" />
                  <canvas ref={canvasRef} className="hidden" />
                </>
              )}
            </div>

            <button
              onClick={capturePhoto}
              disabled={!stream || isCapturing}
              className={`w-full py-3 rounded-full flex items-center justify-center ${
                !stream || isCapturing
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-green-700 text-white hover:bg-green-800"
              } transition-colors`}
            >
              {isCapturing ? "Capture en cours..." : "Prendre la photo"}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default PhotoCapture
