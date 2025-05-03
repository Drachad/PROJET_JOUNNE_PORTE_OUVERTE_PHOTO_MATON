"use client"

import type React from "react"
import { useState } from "react"
import { generateCertificateId } from "../utils/helpers"
import type { Visitor } from "../types"

interface VisitorFormProps {
  onSubmit: (visitor: Visitor) => void
  photoData: string
}

const VisitorForm: React.FC<VisitorFormProps> = ({ onSubmit, photoData }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    institution: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Le nom est requis"
    }

    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format d'email invalide"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Le numéro de téléphone est requis"
    } else if (!/^\+?[0-9]{8,}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Format de numéro invalide"
    }

    if (!formData.institution.trim()) {
      newErrors.institution = "L'institution est requise"
    }

    if (!photoData) {
      newErrors.photo = "La photo est requise"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validate()) {
      const visitor: Visitor = {
        id: crypto.randomUUID(),
        ...formData,
        photo: photoData,
        certificateId: generateCertificateId(),
        timestamp: Date.now(),
      }

      onSubmit(visitor)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Informations du Visiteur</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nom Complet
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Entrez votre nom complet"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Entrez votre email"
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Numéro de Téléphone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.phone ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Entrez votre numéro de téléphone"
          />
          {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="institution" className="block text-sm font-medium text-gray-700 mb-1">
            Institution / École
          </label>
          <input
            type="text"
            id="institution"
            name="institution"
            value={formData.institution}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.institution ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Entrez votre institution"
          />
          {errors.institution && <p className="mt-1 text-sm text-red-600">{errors.institution}</p>}
        </div>

        {errors.photo && <p className="mb-4 text-sm text-red-600">{errors.photo}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          Générer le Certificat
        </button>
      </form>
    </div>
  )
}

export default VisitorForm
