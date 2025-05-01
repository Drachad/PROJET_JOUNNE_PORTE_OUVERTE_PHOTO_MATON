"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { ArrowLeft, Download } from "lucide-react"
import { formatDate } from "../utils/dateUtils"
import { generateFramedPhoto } from "../utils/canvasUtils"

interface PhotoFrameProps {
  userData: {
    firstName: string
    lastName: string
  }
  photoData: string
  onGenerated: (imageDataUrl: string) => void
  onBack: () => void
}

const PhotoFrame: React.FC<PhotoFrameProps> = ({ userData, photoData, onGenerated, onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(true)

  useEffect(() => {
    const generatePreview = async () => {
      if (!canvasRef.current || !photoData) return

      setIsProcessing(true)

      try {
        const imageUrl = await generateFramedPhoto(
          canvasRef.current,
          photoData,
          userData.firstName,
          userData.lastName,
          formatDate(new Date()),
        )

        setPreviewImageUrl(imageUrl)
      } catch (error) {
        console.error("Error generating preview:", error)
      } finally {
        setIsProcessing(false)
      }
    }

    generatePreview()
  }, [photoData, userData])

  const handleGenerate = async () => {
    if (!canvasRef.current || !previewImageUrl) return

    setIsGenerating(true)

    try {
      // We already have the preview image, so we can just pass it to the parent
      onGenerated(previewImageUrl)
    } catch (error) {
      console.error("Error generating final image:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden transition-all">
      {/* Back button */}
      <div className="p-4 bg-gray-50 border-b">
        <button onClick={onBack} className="flex items-center text-gray-600 hover:text-gray-900">
          <ArrowLeft size={16} className="mr-1" />
          <span>Retour à la capture</span>
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        <h2 className="text-xl font-bold text-center mb-6">Prévisualisation</h2>

        <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
          <canvas ref={canvasRef} className="w-full h-auto hidden" />

          {isProcessing ? (
            <div className="bg-gray-100 p-8 flex flex-col items-center justify-center h-80">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mb-4"></div>
              <p className="text-gray-500">Traitement de l'image en cours...</p>
              <p className="text-gray-400 text-sm mt-2">Détourage et application du style IFNTI</p>
            </div>
          ) : previewImageUrl ? (
            <img src={previewImageUrl || "/placeholder.svg"} alt="Prévisualisation" className="w-full h-auto" />
          ) : (
            <div className="bg-gray-100 p-8 flex items-center justify-center">
              <p className="text-gray-500">Erreur lors de la génération de la prévisualisation</p>
            </div>
          )}
        </div>

        <button
          onClick={handleGenerate}
          disabled={!previewImageUrl || isGenerating || isProcessing}
          className={`w-full py-3 rounded-full flex items-center justify-center ${
            !previewImageUrl || isGenerating || isProcessing
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-green-700 text-white hover:bg-green-800"
          } transition-colors`}
        >
          <Download size={18} className="mr-2" />
          {isGenerating ? "Génération en cours..." : "Continuer vers le téléchargement"}
        </button>
      </div>
    </div>
  )
}

export default PhotoFrame
