"use client"

import type React from "react"
import { Download, Share2, Home } from "lucide-react"

interface DownloadShareProps {
  imageUrl: string
  userData: {
    firstName: string
    lastName: string
  }
  onRestart: () => void
}

const DownloadShare: React.FC<DownloadShareProps> = ({ imageUrl, userData, onRestart }) => {
  // Handle download
  const handleDownload = () => {
    const link = document.createElement("a")
    link.href = imageUrl
    link.download = `IFNTI_Photo_${userData.firstName}_${userData.lastName}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Handle share
  const handleShare = async () => {
    if (navigator.share) {
      try {
        // Convert data URL to Blob
        const response = await fetch(imageUrl)
        const blob = await response.blob()
        const file = new File([blob], `IFNTI_Photo_${userData.firstName}_${userData.lastName}.png`, {
          type: "image/png",
        })

        await navigator.share({
          title: "Ma photo souvenir IFNTI",
          text: "Voici ma photo souvenir de la Journée Portes Ouvertes IFNTI!",
          files: [file],
        })
      } catch (error) {
        console.error("Error sharing:", error)
        alert("Le partage a échoué. Essayez de télécharger l'image puis de la partager manuellement.")
      }
    } else {
      alert(
        "Le partage n'est pas pris en charge par votre navigateur. Téléchargez l'image puis partagez-la manuellement.",
      )
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden transition-all">
      <div className="p-6">
        <h2 className="text-xl font-bold text-center mb-6">Votre photo souvenir</h2>

        <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
          <img src={imageUrl} alt="Photo souvenir" className="w-full h-auto" />
        </div>

        <div className="space-y-3">
          <button
            onClick={handleDownload}
            className="w-full py-3 rounded-lg flex items-center justify-center bg-green-700 text-white hover:bg-green-800 transition-colors"
          >
            <Download size={18} className="mr-2" />
            Télécharger ma photo souvenir
          </button>

          {navigator.share && (
            <button
              onClick={handleShare}
              className="w-full py-3 rounded-lg flex items-center justify-center bg-white text-green-700 border border-green-700 hover:bg-green-50 transition-colors"
            >
              <Share2 size={18} className="mr-2" />
              Partager
            </button>
          )}

          <button
            onClick={onRestart}
            className="w-full py-3 rounded-lg flex items-center justify-center bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
          >
            <Home size={18} className="mr-2" />
            Recommencer
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Merci de votre visite à la Journée Portes Ouvertes IFNTI!</p>
          <p className="mt-1">Nous espérons vous revoir bientôt.</p>
        </div>
      </div>
    </div>
  )
}

export default DownloadShare
