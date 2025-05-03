import React, { useState } from 'react';
import { Header } from './components/Header';
import { VisitorForm } from './components/VisitorForm';
import { VisitorList } from './components/VisitorList';
import { PhotoCapture } from './components/PhotoCapture';
import { Certificate } from './components/Certificate';
import { Footer } from './components/Footer';

function App() {
  const [activeTab, setActiveTab] = useState('check-in');

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header setActiveTab={setActiveTab} activeTab={activeTab} />
      <main className="container mx-auto py-6 px-4 flex-grow">
        {activeTab === 'check-in' && <VisitorForm />}
        {activeTab === 'visitors' && <VisitorList />}
        {activeTab === 'photo' && <PhotoCapture />}
        {activeTab === 'certificate' && <Certificate />}
      </main>
      <Footer />
    </div>
  );
}

export default App;