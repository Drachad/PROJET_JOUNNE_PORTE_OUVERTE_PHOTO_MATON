export interface Visitor {
  id: string;
  name: string;
  email: string;
  phone: string;
  purpose: string;
  hostName: string;
  checkInTime: Date;
  checkOutTime?: Date;
  photoUrl?: string;
}

export interface TabProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}