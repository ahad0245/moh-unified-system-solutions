export interface User {
  _id: string;
  referenceNumber: string;
  patientName: string;
  status: 'approved' | 'pending' | 'rejected';
}

export interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}
