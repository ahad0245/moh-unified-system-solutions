// Fix: Defining types for AuthContext and UserRequest
export interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

export type RequestStatus = 'Pending' | 'Approved' | 'Rejected';

export interface UserRequest {
  id: string;
  userName: string;
  requestType: string;
  details: string;
  status: RequestStatus;
  createdAt: string;
}
