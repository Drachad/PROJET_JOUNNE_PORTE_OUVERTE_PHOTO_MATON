"use client"

import { useState } from "react"
import UserForm from "./components/UserForm"
import PhotoCapture from "./components/PhotoCapture"
import PhotoFrame from "./components/PhotoFrame"
import DownloadShare from "./components/DownloadShare"
import { School } from "lucide-react"

// Application steps
enum Step {
  USER_FORM = 0,
  PHOTO_CAPTURE = 1,
  PREVIEW = 2,
  DOWNLOAD = 3,
}

// Main App component
function App() {
  // State for tracking the current step
  const [currentStep, setCurrentStep] = useState<Step>(Step.USER_FORM)

  // User data state
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
  })

  // Photo data state
  const [photoData, setPhotoData] = useState<string | null>(null)

  // Final image state
  const [finalImage, setFinalImage] = useState<string | null>(null)

  // Handle user form submission
  const handleUserFormSubmit = (firstName: string, lastName: string) => {
    setUserData({ firstName, lastName })
    setCurrentStep(Step.PHOTO_CAPTURE)
  }

  // Handle photo capture or upload
  const handlePhotoCapture = (photoDataUrl: string) => {
    setPhotoData(photoDataUrl)
    setCurrentStep(Step.PREVIEW)
  }

  // Handle photo frame generation
  const handlePhotoGenerated = (imageDataUrl: string) => {
    setFinalImage(imageDataUrl)
    setCurrentStep(Step.DOWNLOAD)
  }

  // Handle restart
  const handleRestart = () => {
    setCurrentStep(Step.USER_FORM)
    setPhotoData(null)
    setFinalImage(null)
  }

  // Render the current step
  const renderStep = () => {
    switch (currentStep) {
      case Step.USER_FORM:
        return <UserForm onSubmit={handleUserFormSubmit} />

      case Step.PHOTO_CAPTURE:
        return <PhotoCapture onCapture={handlePhotoCapture} onBack={() => setCurrentStep(Step.USER_FORM)} />

      case Step.PREVIEW:
        return (
          <PhotoFrame
            userData={userData}
            photoData={photoData!}
            onGenerated={handlePhotoGenerated}
            onBack={() => setCurrentStep(Step.PHOTO_CAPTURE)}
          />
        )

      case Step.DOWNLOAD:
        return <DownloadShare imageUrl={finalImage!} userData={userData} onRestart={handleRestart} />

      default:
        return <UserForm onSubmit={handleUserFormSubmit} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-green-700 text-white p-4 shadow-md">
        <div className="container mx-auto flex items-center justify-center">
          <School className="mr-2" size={24} />
          <h1 className="text-xl font-bold">Photomaton IFNTI</h1>
        </div>
      </header>

      {/* Progress indicator */}
      <div className="bg-white py-2 shadow-sm">
        <div className="container mx-auto">
          <div className="flex justify-between px-4">
            {["Identité", "Photo", "Prévisualisation", "Téléchargement"].map((step, index) => (
              <div
                key={step}
                className={`flex flex-col items-center ${index <= currentStep ? "text-green-700" : "text-gray-400"}`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs mb-1 ${
                    index < currentStep
                      ? "bg-green-700 text-white"
                      : index === currentStep
                        ? "border-2 border-green-700"
                        : "border border-gray-300"
                  }`}
                >
                  {index < currentStep ? "✓" : index + 1}
                </div>
                <span className="text-xs hidden sm:block">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-grow container mx-auto px-4 py-6">{renderStep()}</main>

      {/* Footer */}
      <footer className="bg-gray-200 py-3 text-center text-sm text-gray-600">
        <p>Journée Portes Ouvertes – IFNTI Sokodé © {new Date().getFullYear()}</p>
      </footer>
    </div>
  )
}

export default App
