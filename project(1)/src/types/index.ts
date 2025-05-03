export interface Visitor {
  id: string
  name: string
  email: string
  phone: string
  institution: string
  photo: string // Base64 encoded image
  certificateId: string
  timestamp: number
}

export interface CertificateData extends Visitor {
  eventDate: string
  eventName: string
}
