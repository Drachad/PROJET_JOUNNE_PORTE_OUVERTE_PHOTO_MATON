"use client"

import type React from "react"
import { useRef } from "react"
import { Download, Printer } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"
import html2canvas from "html2canvas"
import type { CertificateData } from "../types"
import { formatDate } from "../utils/helpers"

// Import des logos locaux
import ifntiLogo from "./ifnti.png"
import kbuLogo from "./kbu.png"

interface CertificateProps {
  data: CertificateData
  onBack: () => void
}

const Certificate: React.FC<CertificateProps> = ({ data, onBack }) => {
  const certificateRef = useRef<HTMLDivElement>(null)

  // Version optimisée des données pour le QR code
  const qrCodeValue = `https://ifnti.com`

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = async () => {
    if (certificateRef.current) {
      try {
        const canvas = await html2canvas(certificateRef.current, {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
          logging: true,
          onclone: (clonedDoc) => {
            // Améliore la qualité du QR code dans le rendu
            const qrCode = clonedDoc.querySelector(".qr-code-container") as HTMLElement
            if (qrCode) {
              qrCode.style.transform = "none"
              qrCode.style.imageRendering = "crisp-edges"
            }
          },
        })

        const link = document.createElement("a")
        link.download = `certificat_${data.name.replace(/\s+/g, "_")}.png`
        link.href = canvas.toDataURL("image/png")
        link.click()
      } catch (error) {
        console.error("Error generating certificate image:", error)
      }
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header avec boutons */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-600 p-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Certificat de Participation</h2>
        <div className="flex space-x-2">
          <button
            onClick={handlePrint}
            className="flex items-center bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-lg transition-all text-sm backdrop-blur-sm"
            title="Imprimer"
          >
            <Printer size={16} className="mr-1" />
            Imprimer
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg transition-all text-sm"
            title="Télécharger"
          >
            <Download size={16} className="mr-1" />
            Exporter en PNG
          </button>

          <button
            onClick={onBack}
            className="bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-lg transition-all text-sm backdrop-blur-sm"
            title="Retour"
          >
            ← Retour
          </button>
        </div>
      </div>

      {/* Certificat principal */}
      <div ref={certificateRef} className="p-8 relative bg-gradient-to-b from-white to-blue-50">
        {/* Bordure décorative */}
        <div className="absolute inset-4 border-2 border-blue-200 rounded-lg pointer-events-none"></div>
        <div className="absolute inset-6 border border-blue-100 rounded pointer-events-none"></div>

        {/* Logos */}
        <div className="flex justify-between items-start mb-6">
          <div className="w-24 h-24 bg-white rounded-lg shadow-sm flex items-center justify-center p-2">
            <img
              src={ifntiLogo || "/placeholder.svg"}
              alt="IFNTI Logo"
              className="max-w-full max-h-full object-contain"
            />
          </div>
          <div className="w-24 h-24 bg-white rounded-lg shadow-sm flex items-center justify-center p-2">
            <img src={kbuLogo || "/placeholder.svg"} alt="KBU Logo" className="max-w-full max-h-full object-contain" />
          </div>
        </div>

        {/* Titre */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2 font-serif tracking-wide">
            CERTIFICAT DE PARTICIPATION
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-blue-600 mx-auto mb-3 rounded-full"></div>
          <p className="text-lg text-blue-600 italic">Journée Portes Ouvertes IFNTI-KBU</p>
        </div>

        {/* Photo */}
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <img
              src={data.photo || "/placeholder.svg"}
              alt={data.name}
              className="w-28 h-28 rounded-full border-4 border-white shadow-lg object-cover"
            />
            <div className="absolute inset-0 rounded-full border-2 border-blue-300 pointer-events-none"></div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="text-center mb-8">
          <p className="text-md text-gray-600 mb-1">Ce certificat est décerné à</p>
          <h2 className="text-3xl font-bold text-blue-900 mb-3 font-serif">{data.name}</h2>
          <p className="text-lg text-gray-700 mb-4">
            du <span className="font-semibold text-blue-800">Lycée {data.institution}</span>
          </p>

          <div className="max-w-md mx-auto bg-white/80 rounded-lg p-4 shadow-inner border border-gray-100">
            <p className="text-gray-700">Pour sa participation active à la Journée Portes Ouvertes</p>
            <p className="text-gray-700 font-medium mt-1">le {formatDate(new Date(data.eventDate))}</p>
          </div>
        </div>

        {/* Pied de page */}
        <div className="flex justify-between items-end mt-8">
          <div className="text-xs text-gray-500 bg-white/80 px-2 py-1 rounded">ID: {data.certificateId}</div>
          <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-200 qr-code-container">
            <QRCodeSVG
              value={qrCodeValue}
              size={100} // Taille augmentée
              level="H"
              includeMargin={true}
              fgColor="#000000" // Noir pour meilleur contraste
              bgColor="#FFFFFF"
              style={{
                imageRendering: "crisp-edges",
                width: "100%",
                height: "auto",
              }}
            />
            <p className="text-xs text-center mt-2 text-gray-500">Scanner pour vérifier</p>
          </div>
        </div>

        {/* Cachet décoratif */}
        <div className="absolute bottom-4 right-4 w-16 h-16 border-4 border-red-400 rounded-full opacity-20"></div>
      </div>
    </div>
  )
}

export default Certificate
