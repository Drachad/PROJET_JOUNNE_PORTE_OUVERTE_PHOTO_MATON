import React, { useState } from "react";
import { Users, Search, Download } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Visitor } from "../types";
import { formatDate } from "../utils/helpers";
import html2canvas from "html2canvas";
import ifntiLogo from './ifnti.png';
import kbuLogo from './kbu.png';


interface VisitorListProps {
  visitors: Visitor[];
}

const VisitorList: React.FC<VisitorListProps> = ({ visitors }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null);

  const filteredVisitors = visitors.filter(
    (visitor) =>
      (visitor.nom + " " + visitor.prenom)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      visitor.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownloadCertificate = async (visitor: Visitor) => {
    setSelectedVisitor(visitor);
    await new Promise((resolve) => setTimeout(resolve, 100));

    const certificateElement = document.getElementById(
      `certificate-${visitor.id}`
    );
    if (certificateElement) {
      try {
        const canvas = await html2canvas(certificateElement, {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
        });

        const link = document.createElement("a");
        link.download = `certificat_${visitor.nom}_${visitor.prenom}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      } catch (error) {
        console.error("Erreur lors de la génération du certificat :", error);
      }
    }

    setSelectedVisitor(null);
  };

  const handleClearStorage = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Users className="w-6 h-6 text-blue-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-800">
            Liste des Participants
          </h2>
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
            onClick={handleClearStorage}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
          >
            Vider le stockage
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                Photo
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                Nom
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                Sexe
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                Âge
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                Profession
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                Institution
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                Contact
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                Date
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredVisitors.map((visitor) => (
              <tr key={visitor.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <img
                    src={visitor.photo}
                    alt={visitor.nom}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </td>
                <td className="px-4 py-3 font-medium text-gray-900">
                  {visitor.nom} {visitor.prenom}
                </td>
                <td className="px-4 py-3 text-gray-500">{visitor.sexe}</td>
                <td className="px-4 py-3 text-gray-500">{visitor.age}</td>
                <td className="px-4 py-3 text-gray-500">
                  {visitor.profession}
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {visitor.institution}
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm text-gray-900">{visitor.email}</div>
                  <div className="text-sm text-gray-500">
                    {visitor.telephone}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {formatDate(new Date(visitor.dateParticipation))}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleDownloadCertificate(visitor)}
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <Download size={18} className="mr-1" />
                    Certificat
                  </button>
                  <a href="http://localhost:3001/visitors/export/pdf" target="_blank">
                        <button>Télécharger PDF</button>
                  </a>

                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredVisitors.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Aucun participant trouvé
          </div>
        )}
      </div>
      {selectedVisitor && (
  <div
    style={{
      position: "absolute",
      top: "-9999px",
      left: "-9999px",
      opacity: 0,
      pointerEvents: "none",
      zIndex: -1,
    }}
  >
    <div
      id={`certificate-${selectedVisitor.id}`}
      className="p-12 relative bg-white font-serif text-gray-800"
      style={{
        width: "1472px",   // ✅ Largeur fixe
        height: "1738px",  // ✅ Hauteur fixe
        backgroundImage: `
          radial-gradient(circle at 20% 30%, rgba(249, 115, 22, 0.03) 0%, transparent 70%),
          radial-gradient(circle at 80% 70%, rgba(59, 130, 246, 0.03) 0%, transparent 70%)
        `,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
      }}
    >
      {/* Bordures décoratives */}
      <div className="absolute inset-6 border-2 border-gray-200 rounded-lg pointer-events-none"></div>
      <div className="absolute inset-10 border-2 border-blue-500/30 rounded-lg pointer-events-none"></div>
      <div className="absolute inset-14 border-2 border-orange-400/20 rounded-lg pointer-events-none"></div>
      
      {/* Éléments décoratifs aux coins */}
      <div className="absolute top-20 left-20 w-28 h-28 border-t-4 border-l-4 border-orange-500/30 rounded-tl-xl"></div>
      <div className="absolute top-20 right-20 w-28 h-28 border-t-4 border-r-4 border-orange-500/30 rounded-tr-xl"></div>
      <div className="absolute bottom-20 left-20 w-28 h-28 border-b-4 border-l-4 border-blue-600/30 rounded-bl-xl"></div>
      <div className="absolute bottom-20 right-20 w-28 h-28 border-b-4 border-r-4 border-blue-600/30 rounded-br-xl"></div>

      <div className="flex-1">
        {/* Logos */}
        <div className="flex justify-between items-start mb-12 mt-6">
          <div className="w-36 h-36 bg-white rounded-lg shadow-lg flex items-center justify-center p-4 border border-gray-100">
            <img 
              src={ifntiLogo || "/placeholder.svg"}
              alt="IFNTI Logo" 
              className="max-w-full max-h-full object-contain"
            />
          </div>
          <div className="w-36 h-36 bg-white rounded-lg shadow-lg flex items-center justify-center p-4 border border-gray-100">
            <img 
              src={kbuLogo || "/placeholder.svg"}
              alt="KBU Logo" 
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>

        {/* Titre */}
        <div className="text-center mb-14">
          <h1 className="text-5xl font-bold text-gray-800 mb-4 font-serif tracking-wider">
            CERTIFICAT DE PARTICIPATION
          </h1>
          <div className="w-40 h-2 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-400 mx-auto mb-5 rounded-full"></div>
          <p className="text-2xl text-blue-600 italic font-medium">
            Journée Portes Ouvertes
          </p>
        </div>

        {/* Photo */}
        <div className="flex items-center justify-center mb-12">
          <div className="relative">
            <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-orange-400 via-blue-500 to-orange-400 opacity-70"></div>
            <img 
              src={selectedVisitor.photo || "/placeholder.svg"} 
              alt={selectedVisitor.nom} 
              className="relative w-44 h-44 rounded-full border-4 border-white shadow-lg object-cover"
            />
          </div>
        </div>

        {/* Contenu principal */}
        <div className="text-center mb-12">
          <p className="text-2xl text-gray-600 mb-3">
            Ce certificat est décerné à
          </p>
          <h2 className="text-5xl font-bold text-blue-700 mb-5 font-serif">
            {selectedVisitor.nom} {selectedVisitor.prenom}
          </h2>
          <p className="text-2xl text-gray-700 mb-8">
            de <span className="font-semibold text-orange-600">
              {selectedVisitor.institution}
            </span>
          </p>

          <div className="max-w-2xl mx-auto bg-white rounded-xl p-8 shadow-md border border-gray-100">
            <p className="text-gray-700 text-xl">
              Pour sa participation active à la Journée Portes Ouvertes
            </p>
            <p className="text-gray-700 font-medium mt-3 text-xl">
              le {formatDate(new Date(selectedVisitor.dateParticipation))}
            </p>
          </div>
        </div>

        {/* Signatures */}
        <div className="flex justify-around mt-20">
          <div className="text-center w-72">
            {/* Signature du directeur IFNTI */}
            <div className="h-24 mb-3 flex items-end justify-center">
              <div className="w-56 flex flex-col items-center">
                <div className="text-blue-700 italic font-medium text-xl mb-3" style={{ fontFamily: 'cursive' }}>
                  Dr. Kodjo Aziagba
                </div>
                <div className="w-48 h-0.5 bg-gray-400"></div>
              </div>
            </div>
            <p className="text-xl font-semibold text-gray-700">Directeur IFNTI</p>
          </div>
          
          <div className="text-center w-72">
            {/* Signature du représentant KBU */}
            <div className="h-24 mb-3 flex items-end justify-center">
              <div className="w-56 flex flex-col items-center">
                <div className="text-blue-700 italic font-medium text-xl mb-3" style={{ fontFamily: 'cursive' }}>
                  Prof. Samuel Nyamekye
                </div>
                <div className="w-48 h-0.5 bg-gray-400"></div>
              </div>
            </div>
            <p className="text-xl font-semibold text-gray-700">Représentant KBU</p>
          </div>
        </div>
      </div>

      {/* Pied de page - Poussé vers le bas */}
      <div className="flex justify-between items-end mt-auto mb-8">
        <div className="text-lg text-gray-500 bg-gray-100 px-5 py-3 rounded-lg border border-gray-200">
          ID: <span className="font-medium">{selectedVisitor.id}</span>
        </div>
        
        <div className="flex items-center">
          {/* Cachet décoratif */}
          <div className="relative w-32 h-32 mr-8">
            <div className="absolute inset-0 rounded-full border-4 border-orange-500 opacity-30 transform rotate-12"></div>
            <div className="absolute inset-2 rounded-full border-4 border-blue-600 opacity-30 transform -rotate-6"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-400 opacity-60 rotate-[-20deg]">OFFICIEL</span>
            </div>
          </div>
          
          <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 qr-code-container">
            <QRCodeSVG
              value={`https://ifnti.com/verify/${selectedVisitor.id}`}
              size={130}
              level="H"
              includeMargin={true}
              fgColor="#1d4ed8" // Bleu foncé pour le QR code
              bgColor="#FFFFFF"
              style={{ 
                imageRendering: 'crisp-edges',
                width: '100%',
                height: 'auto'
              }}
            />
            <p className="text-sm text-center mt-2 text-gray-600 font-medium">Scanner pour vérifier</p>
          </div>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default VisitorList;
