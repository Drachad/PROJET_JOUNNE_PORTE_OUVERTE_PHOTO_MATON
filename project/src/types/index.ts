export interface Visitor {
  id: string;
  nom: string;
  prenom: string;
  sexe: string;
  age: number;
  profession: string;
  email: string;
  photo: string;
  institution: string;
  telephone: string;
  dateParticipation: string;
  certificatGenere: number;
}

export interface CertificateData extends Visitor {
  eventDate: string;
  eventName: string;
}
