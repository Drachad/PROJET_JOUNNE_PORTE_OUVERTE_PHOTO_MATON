import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import PhotoCapture from './components/PhotoCapture';
import VisitorForm from './components/VisitorForm';
import Certificate from './components/Certificate';
import VisitorList from './components/VisitorList';
import { Visitor, CertificateData } from './types';
import { saveVisitor, getVisitors } from './utils/helpers';

function App() {
  const [currentStep, setCurrentStep] = useState<'form' | 'certificate' | 'list'>('form');
  const [photoData, setPhotoData] = useState<string>('');
  const [certificateData, setCertificateData] = useState<CertificateData | null>(null);
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  
  // Chargement des visiteurs au démarrage
  useEffect(() => {
    fetch('http://localhost:3001/visitors')
      .then(res => res.json())
      .then(data => {
        setVisitors(data);
      })
      .catch(err => {
        console.error("Erreur lors de la récupération des visiteurs :", err);
      });
  }, []);
  
  const handlePhotoCapture = (data: string) => {
    setPhotoData(data);
  };
  
  const handleFormSubmit = (visitor: Visitor) => {
    const certData: CertificateData = {
      ...visitor,
      eventDate: '2025-05-03',
      eventName: 'Journée Portes Ouvertes IFNTI-KBU'
    };
  
    // Sauvegarde du visiteur et ajout à la liste
    saveVisitor(visitor);

    setVisitors(prev => {
      // Vérifie que prev est bien un tableau
      if (Array.isArray(prev)) {
        return [...prev, visitor];
      } else {
        console.error("prev n'est pas un tableau", prev);
        return [visitor]; // Retourne un tableau avec juste le nouvel élément
      }
    });
    
    setCertificateData(certData);
    setCurrentStep('certificate');
  };
  
  const handleBack = () => {
    setCurrentStep('form');
    setPhotoData('');
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-6 flex justify-end">
          <button
            onClick={() => setCurrentStep(currentStep === 'list' ? 'form' : 'list')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            {currentStep === 'list' ? 'Nouveau Certificat' : 'Liste des Participants'}
          </button>
        </div>
        
        {currentStep === 'form' && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-blue-900 mb-2">Certificat de Participation</h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Bienvenue à la Journée Portes Ouvertes de l'IFNTI-KBU. Capturez votre photo et remplissez 
                le formulaire pour obtenir votre certificat de participation personnalisé.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <PhotoCapture onPhotoCapture={handlePhotoCapture} />
              <VisitorForm onSubmit={handleFormSubmit} photoData={photoData} />
            </div>
          </div>
        )}
        
        {currentStep === 'certificate' && certificateData && (
          <Certificate data={certificateData} onBack={handleBack} />
        )}
        
        {currentStep === 'list' && (
          <VisitorList visitors={visitors} />
        )}
      </main>
      
      <Footer />
    </div>
  );
}

export default App;
