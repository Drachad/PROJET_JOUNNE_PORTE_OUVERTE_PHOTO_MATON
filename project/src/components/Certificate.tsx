import React, { useRef } from 'react';
import { Download, Printer } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';
import { CertificateData } from '../types';
import { formatDate } from '../utils/helpers';

// Import des logos locaux
import ifntiLogo from './ifnti.png';
import kbuLogo from './kbu.png';

interface CertificateProps {
  data: CertificateData;
  onBack: () => void;
}

const Certificate: React.FC<CertificateProps> = ({ data, onBack }) => {
  const certificateRef = useRef<HTMLDivElement>(null);

  // Version optimisée des données pour le QR code
  const qrCodeValue = `https://ifnti.com`;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    if (certificateRef.current) {
      try {
        // Définir des dimensions fixes pour garantir la cohérence
        const width = certificateRef.current.offsetWidth;
        const height = certificateRef.current.offsetHeight;
        
        const canvas = await html2canvas(certificateRef.current, {
          scale: 3, // Augmenter l'échelle pour une meilleure qualité
          width: width,
          height: height,
          useCORS: true,
          backgroundColor: '#ffffff',
          logging: true,
          onclone: (clonedDoc) => {
            // Améliore la qualité du QR code dans le rendu
            const qrCode = clonedDoc.querySelector('.qr-code-container') as HTMLElement;
            if (qrCode) {
              qrCode.style.transform = 'none';
              qrCode.style.imageRendering = 'crisp-edges';
            }
            
            // S'assurer que le clone a les mêmes dimensions
            const clonedCertificate = clonedDoc.querySelector('#certificate-container') as HTMLElement;
            if (clonedCertificate) {
              clonedCertificate.style.width = `${width}px`;
              clonedCertificate.style.height = `${height}px`;
            }
          }
        });

        const link = document.createElement('a');
        link.download = `certificat_${data.nom}_${data.prenom.replace(/\s+/g, '_')}.png`;
        link.href = canvas.toDataURL('image/png', 1.0); // Qualité maximale
        link.click();
      } catch (error) {
        console.error('Error generating certificate image:', error);
      }
    }
  };

  console.log('Certificate data:', data);

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
      {/* Header avec boutons */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-500 p-5 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white tracking-wide">Certificat de Participation</h2>
        <div className="flex space-x-3">
          <button 
            onClick={handlePrint}
            className="flex items-center bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all text-sm backdrop-blur-sm border border-white/30"
            title="Imprimer"
          >
            <Printer size={18} className="mr-2" />
            Imprimer
          </button>
          
          <button 
            onClick={handleDownload}
            className="flex items-center bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-all text-sm shadow-md"
            title="Télécharger"
          >
            <Download size={18} className="mr-2" />
            Télécharger
          </button>
          
          <button 
            onClick={onBack}
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all text-sm backdrop-blur-sm border border-white/30"
            title="Retour"
          >
            ← Retour
          </button>
        </div>
      </div>
      
      {/* Certificat principal */}
      <div 
        id="certificate-container"
        ref={certificateRef}
        className="p-10 relative bg-white"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(249, 115, 22, 0.03) 0%, transparent 70%),
            radial-gradient(circle at 80% 70%, rgba(59, 130, 246, 0.03) 0%, transparent 70%)
          `,
          width: '100%',
          height: 'auto',
          minHeight: '800px' // Hauteur minimale pour garantir la cohérence
        }}
      >
        {/* Bordures décoratives */}
        <div className="absolute inset-4 border-2 border-gray-200 rounded-lg pointer-events-none"></div>
        <div className="absolute inset-6 border-2 border-blue-500/30 rounded-lg pointer-events-none"></div>
        <div className="absolute inset-8 border-2 border-orange-400/20 rounded-lg pointer-events-none"></div>
        
        {/* Éléments décoratifs aux coins */}
        <div className="absolute top-16 left-16 w-20 h-20 border-t-4 border-l-4 border-orange-500/30 rounded-tl-xl"></div>
        <div className="absolute top-16 right-16 w-20 h-20 border-t-4 border-r-4 border-orange-500/30 rounded-tr-xl"></div>
        <div className="absolute bottom-16 left-16 w-20 h-20 border-b-4 border-l-4 border-blue-600/30 rounded-bl-xl"></div>
        <div className="absolute bottom-16 right-16 w-20 h-20 border-b-4 border-r-4 border-blue-600/30 rounded-br-xl"></div>
        
        {/* Logos */}
        <div className="flex justify-between items-start mb-10 mt-4">
          <div className="w-28 h-28 bg-white rounded-lg shadow-lg flex items-center justify-center p-3 border border-gray-100">
            <img 
              src={ifntiLogo || "/placeholder.svg"}
              alt="IFNTI Logo" 
              className="max-w-full max-h-full object-contain"
            />
          </div>
          <div className="w-28 h-28 bg-white rounded-lg shadow-lg flex items-center justify-center p-3 border border-gray-100">
            <img 
              src={kbuLogo || "/placeholder.svg"}
              alt="KBU Logo" 
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
        
        {/* Titre */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-3 font-serif tracking-wider">
            ATTESTATION DE PARTICIPATION
          </h1>
          <div className="w-32 h-1.5 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-400 mx-auto mb-4 rounded-full"></div>
          <p className="text-xl text-blue-600 italic font-medium">
            {data.eventName}
          </p>
        </div>
        
        {/* Photo */}
        <div className="flex items-center justify-center mb-8">
          <div className="relative">
            <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-orange-400 via-blue-500 to-orange-400 opacity-70"></div>
            <img 
              src={data.photo || "/placeholder.svg"} 
              alt={data.nom} 
              className="relative w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
            />
          </div>
        </div>
        
        {/* Contenu principal */}
        <div className="text-center mb-10">
          <p className="text-lg text-gray-600 mb-2">
            Ce certificat est décerné à
          </p>
          <h2 className="text-4xl font-bold text-blue-700 mb-4 font-serif">
            {data.nom} {data.prenom}
          </h2>
          <p className="text-xl text-gray-700 mb-6">
             de <span className="font-semibold text-orange-600"> {data.institution}</span>
          </p>
          
          <div className="max-w-xl mx-auto bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <p className="text-gray-700 text-lg">
              Pour sa participation active à la Journée Portes Ouvertes
            </p>
            <p className="text-gray-700 font-medium mt-3 text-lg">
              le {formatDate(new Date(data.eventDate))}
            </p>
          </div>
        </div>
        
        {/* Signatures */}
        <div className="flex justify-around mt-8 mb-8">
          <div className="text-center w-64">
            {/* Signature du directeur IFNTI */}
            <div className="h-20 mb-2 flex items-end justify-center">
              <div className="w-48 flex flex-col items-center">
                <div className="text-blue-700 italic font-medium text-lg mb-2" style={{ fontFamily: 'cursive' }}>
                  Mr. TEOURI SABIROU
                </div>
                <div className="w-40 h-0.5 bg-gray-400"></div>
              </div>
            </div>
            <p className="text-lg font-semibold text-gray-700">Directeur IFNTI</p>
          </div>
          
          <div className="text-center w-64">
            {/* Signature du représentant KBU */}
            <div className="h-20 mb-2 flex items-end justify-center">
              <div className="w-48 flex flex-col items-center">
                <div className="text-blue-700 italic font-medium text-lg mb-2" style={{ fontFamily: 'cursive' }}>
                Mr. TEOURI JOSUE
                </div>
                <div className="w-40 h-0.5 bg-gray-400"></div>
              </div>
            </div>
            <p className="text-lg font-semibold text-gray-700">Directeur KBU</p>
          </div>
        </div>
        
        {/* Pied de page */}
        <div className="flex justify-between items-end mt-8">
          <div className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-lg border border-gray-200">
            ID: <span className="font-medium">{data.id}</span>
          </div>
          
          <div className="flex items-center">
            {/* Cachet décoratif */}
            <div className="relative w-24 h-24 mr-6">
              <div className="absolute inset-0 rounded-full border-4 border-orange-500 opacity-30 transform rotate-12"></div>
              <div className="absolute inset-2 rounded-full border-4 border-blue-600 opacity-30 transform -rotate-6"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-gray-400 opacity-60 rotate-[-20deg]">OFFICIEL</span>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200 qr-code-container">
              <QRCodeSVG
                value={qrCodeValue}
                size={110}
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
  );
};

export default Certificate;