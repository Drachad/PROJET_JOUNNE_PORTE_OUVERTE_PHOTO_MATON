"use client"

import type React from "react"
import { useState } from "react"
import { Users, Search, Download } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"
import type { Visitor } from "../types"
import { formatDate } from "../utils/helpers"
import html2canvas from "html2canvas"

interface VisitorListProps {
  visitors: Visitor[]
}

const VisitorList: React.FC<VisitorListProps> = ({ visitors }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null)

  const filteredVisitors = visitors.filter(
    (visitor) =>
      visitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDownloadCertificate = async (visitor: Visitor) => {
    setSelectedVisitor(visitor)
    await new Promise((resolve) => setTimeout(resolve, 100))

    const certificateElement = document.getElementById(`certificate-${visitor.id}`)
    if (certificateElement) {
      try {
        const canvas = await html2canvas(certificateElement, {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
        })

        const link = document.createElement("a")
        link.download = `certificat_${visitor.name.replace(/\s+/g, "_")}.png`
        link.href = canvas.toDataURL("image/png")
        link.click()
      } catch (error) {
        console.error("Erreur lors de la génération du certificat :", error)
      }
    }

    setSelectedVisitor(null)
  }

  // Add this function to generate CSV content
  const generateCSV = (): string => {
    const headers = ["Nom", "Email", "Téléphone", "Institution", "ID Certificat", "Date"]

    const csvRows = [
      headers.join(","),
      ...visitors.map((visitor) => {
        const date = new Date(visitor.timestamp).toLocaleDateString("fr-FR")
        return [
          `"${visitor.name.replace(/"/g, '""')}"`,
          `"${visitor.email.replace(/"/g, '""')}"`,
          `"${visitor.phone.replace(/"/g, '""')}"`,
          `"${visitor.institution.replace(/"/g, '""')}"`,
          visitor.certificateId,
          date,
        ].join(",")
      }),
    ]

    return csvRows.join("\n")
  }

  // Update the export all function
  const handleExportAll = () => {
    const csvContent = generateCSV()
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)

    link.setAttribute("href", url)
    link.setAttribute("download", `participants_${new Date().toISOString().slice(0, 10)}.csv`)
    link.style.visibility = "hidden"

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Update the clear storage function
  const handleClearStorage = async () => {
    if (confirm("Êtes-vous sûr de vouloir supprimer tous les participants ?")) {
      try {
        await import("../api").then(({ clearVisitors }) => clearVisitors())
        window.location.reload()
      } catch (error) {
        console.error("Error clearing visitors:", error)
        alert("Une erreur est survenue lors de la suppression des données.")
      }
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Users className="w-6 h-6 text-blue-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-800">Liste des Participants</h2>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={handleExportAll}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
          >
            Exporter tous
          </button>
          <button
            onClick={handleClearStorage}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
          >
            Vider la base
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Photo</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Nom</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Institution</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Contact</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Date</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredVisitors.map((visitor) => (
              <tr key={visitor.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <img
                    src={visitor.photo || "/placeholder.svg"}
                    alt={visitor.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900">{visitor.name}</div>
                  <div className="text-sm text-gray-500">{visitor.certificateId}</div>
                </td>
                <td className="px-4 py-3 text-gray-500">{visitor.institution}</td>
                <td className="px-4 py-3">
                  <div className="text-sm text-gray-900">{visitor.email}</div>
                  <div className="text-sm text-gray-500">{visitor.phone}</div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">{formatDate(new Date(visitor.timestamp))}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleDownloadCertificate(visitor)}
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <Download size={18} className="mr-1" />
                    Certificat
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredVisitors.length === 0 && (
          <div className="text-center py-8 text-gray-500">Aucun participant trouvé</div>
        )}
      </div>

      {selectedVisitor && (
        <div className="hidden">
          <div
            id={`certificate-${selectedVisitor.id}`}
            className="bg-white p-12 relative"
            style={{ width: "800px", height: "1131px" }}
          >
            <div className="absolute inset-0 border-8 border-double border-blue-900/20"></div>

            <div className="flex justify-between items-start mb-12">
              <img
                src="https://images.pexels.com/photos/207691/pexels-photo-207691.jpeg"
                alt="IFNTI Logo"
                className="w-28 h-auto"
              />
              <img
                src="https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg"
                alt="KBU Logo"
                className="w-28 h-auto"
              />
            </div>

            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-blue-900 mb-3">CERTIFICAT DE PARTICIPATION</h1>
              <p className="text-xl text-gray-600">Journée Portes Ouvertes IFNTI-KBU</p>
            </div>

            <div className="flex items-center justify-center mb-8">
              <img
                src={selectedVisitor.photo || "/placeholder.svg"}
                alt={selectedVisitor.name}
                className="w-32 h-32 rounded-full border-4 border-blue-900 object-cover"
              />
            </div>

            <div className="text-center mb-12">
              <p className="text-lg text-gray-600 mb-4">Ce certificat est décerné à</p>
              <h2 className="text-3xl font-bold text-blue-900 mb-4">{selectedVisitor.name}</h2>
              <p className="text-xl text-gray-600">
                de <span className="font-semibold">{selectedVisitor.institution}</span>
              </p>
              <p className="text-lg text-gray-600 mt-6">
                pour sa participation à la Journée Portes Ouvertes
                <br />
                le {formatDate(new Date("2025-05-03"))}
              </p>
            </div>

            <div className="absolute bottom-8 right-8 bg-white p-3 rounded-xl shadow-lg">
              <QRCodeSVG
                value={`https://ifnti.com/verify/${selectedVisitor.certificateId}`}
                size={100}
                level="H"
                includeMargin={true}
              />
            </div>

            <div className="absolute bottom-8 left-8 text-sm text-gray-500">ID: {selectedVisitor.certificateId}</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default VisitorList
