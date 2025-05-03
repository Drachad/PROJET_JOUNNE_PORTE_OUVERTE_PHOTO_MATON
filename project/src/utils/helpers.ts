export interface Visitor {
  id: string;
  nom: string;
  prenom: string;
  sexe?: string;
  age?: number;
  profession?: string;
  email?: string;
  telephone?: string;
  dateParticipation: string;
  certificatGenere?: number;
}

/**
 * Generate a unique certificate ID
 */
export const generateCertificateId = (): string => {
  const timestamp = Date.now().toString(36);
  const randomChars = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `IFNTI-${timestamp}-${randomChars}`;
};

/**
 * Format date to localized string
 */
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Save visitor data to backend (SQLite)
 */
export const saveVisitor = async (visitor: Visitor): Promise<void> => {
  await fetch('http://localhost:3001/visitors', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(visitor),
  });
};

/**
 * Get all visitors from backend
 */
export const getVisitors = async (): Promise<Visitor[]> => {
  const response = await fetch('http://localhost:3001/visitors');
  return await response.json();
};

/**
 * Get a visitor by ID from backend
 */
export const getVisitorById = async (id: string): Promise<Visitor | null> => {
  const visitors = await getVisitors();
  return visitors.find((visitor) => visitor.id === id) || null;
};
