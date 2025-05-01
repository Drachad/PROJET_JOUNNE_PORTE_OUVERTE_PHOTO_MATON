"use client"

import type React from "react"
import { useState } from "react"
import { User } from "lucide-react"

interface UserFormProps {
  onSubmit: (firstName: string, lastName: string) => void
}

const UserForm: React.FC<UserFormProps> = ({ onSubmit }) => {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [errors, setErrors] = useState({ firstName: false, lastName: false })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    const newErrors = {
      firstName: !firstName.trim(),
      lastName: !lastName.trim(),
    }

    setErrors(newErrors)

    // If no errors, submit
    if (!newErrors.firstName && !newErrors.lastName) {
      onSubmit(firstName, lastName)
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 transition-all">
      <div className="flex items-center justify-center mb-6">
        <div className="bg-green-100 p-3 rounded-full">
          <User size={32} className="text-green-700" />
        </div>
      </div>

      <h2 className="text-xl font-bold text-center mb-6">Bienvenue au Photomaton IFNTI</h2>

      <p className="text-gray-600 mb-6 text-center">
        Commencez par saisir votre nom et prénom pour créer votre photo souvenir
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
            Nom
          </label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
              errors.lastName ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Entrez votre nom"
          />
          {errors.lastName && <p className="mt-1 text-sm text-red-500">Veuillez saisir votre nom</p>}
        </div>

        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
            Prénom
          </label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
              errors.firstName ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Entrez votre prénom"
          />
          {errors.firstName && <p className="mt-1 text-sm text-red-500">Veuillez saisir votre prénom</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-green-700 text-white py-2 px-4 rounded-md hover:bg-green-800 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Continuer
        </button>
      </form>
    </div>
  )
}

export default UserForm
