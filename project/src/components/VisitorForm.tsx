import React, { useState } from 'react';
import { generateCertificateId } from '../utils/helpers';
import { Visitor } from '../types';

interface VisitorFormProps {
  onSubmit: (visitor: Visitor) => void;
  photoData: string;
}

const VisitorForm: React.FC<VisitorFormProps> = ({ onSubmit, photoData }) => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    sexe: '',
    age: '',
    profession: '',
    email: '',
    institution: '',
    telephone: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nom.trim()) newErrors.nom = 'Le nom est requis';
    if (!formData.prenom.trim()) newErrors.prenom = 'Le prénom est requis';
    if (!formData.sexe.trim()) newErrors.sexe = 'Le sexe est requis';
    if (!formData.age || isNaN(Number(formData.age))) newErrors.age = 'L\'âge est requis et doit être un nombre';
    if (!formData.profession.trim()) newErrors.profession = 'La profession est requise';
    if (!formData.institution.trim()) newErrors.institution = 'L\'institution est requise';

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    if (!formData.telephone.trim()) {
      newErrors.telephone = 'Le numéro est requis';
    } else if (!/^\+?[0-9]{8,}$/.test(formData.telephone.replace(/\s/g, ''))) {
      newErrors.telephone = 'Format de numéro invalide';
    }

    if (!photoData) {
      newErrors.photo = 'La photo est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validate()) {
      const visitor: Visitor = {
        id: crypto.randomUUID(),
        ...formData,
        age: Number(formData.age),
        photo: photoData,
        dateParticipation: new Date().toISOString(),
        certificatGenere: 0,
      };

      onSubmit(visitor);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Informations du Visiteur</h2>

      <form onSubmit={handleSubmit}>
        {/* Nom */}
        <InputField id="nom" label="Nom" value={formData.nom} onChange={handleChange} error={errors.nom} />

        {/* Prénom */}
        <InputField id="prenom" label="Prénom" value={formData.prenom} onChange={handleChange} error={errors.prenom} />

        {/* Sexe */}
        <div className="mb-4">
          <label htmlFor="sexe" className="block text-sm font-medium text-gray-700 mb-1">Sexe</label>
          <select
            id="sexe"
            name="sexe"
            value={formData.sexe}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none ${
              errors.sexe ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">-- Choisir --</option>
            <option value="Homme">Homme</option>
            <option value="Femme">Femme</option>
          </select>
          {errors.sexe && <p className="mt-1 text-sm text-red-600">{errors.sexe}</p>}
        </div>

        {/* Âge */}
        <InputField id="age" label="Âge" value={formData.age} onChange={handleChange} error={errors.age} type="number" />

        {/* Profession */}
        <InputField id="profession" label="Profession" value={formData.profession} onChange={handleChange} error={errors.profession} />

        {/* Email */}
        <InputField id="email" label="Email" value={formData.email} onChange={handleChange} error={errors.email} type="email" />

        {/* Téléphone */}
        <InputField id="telephone" label="Téléphone" value={formData.telephone} onChange={handleChange} error={errors.telephone} type="tel" />

        {/* Institution */}
        <InputField id="institution" label="Institution" value={formData.institution} onChange={handleChange} error={errors.institution} />

        {/* Erreur photo */}
        {errors.photo && <p className="mb-4 text-sm text-red-600">{errors.photo}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          Générer le Certificat
        </button>
      </form>
    </div>
  );
};

// ✅ Petit composant pour éviter la répétition :
const InputField = ({
  id,
  label,
  value,
  onChange,
  error,
  type = 'text'
}: {
  id: string;
  label: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  error?: string;
  type?: string;
}) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      className={`w-full px-3 py-2 border rounded-md focus:outline-none ${
        error ? 'border-red-500' : 'border-gray-300'
      }`}
      placeholder={`Entrez votre ${label.toLowerCase()}`}
    />
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);

export default VisitorForm;
