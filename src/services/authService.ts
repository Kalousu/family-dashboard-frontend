import { fetchApi } from './api';

export interface User {
  id: number;
  name: string;
  email: string;
  familyId: number;
  userRole: string;
  userPfp: string;
}

export interface AuthResponse {
  token: string;
  user?: User;
}

export interface LoginRequest {
  name: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  familyId?: number;
  userPfp?: string;
  pfpColour?: string;
}

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await fetchApi<{ token: string }>('/api/auth/authenticate', 'POST', credentials);
    
    localStorage.setItem('auth_token', response.token);
    
    const user: User = {
      id: 0,
      name: credentials.name,
      email: '',
      familyId: 1,
      userRole: 'USER',
      userPfp: 'user'
    };
    localStorage.setItem('user', JSON.stringify(user));
    
    return { token: response.token, user };
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const requestData = { ...data, familyId: 1 };
    const response = await fetchApi<{ token: string }>('/api/auth/register', 'POST', requestData);
    
    localStorage.setItem('auth_token', response.token);
    
    const user: User = {
      id: 0,
      name: data.name,
      email: data.email,
      familyId: 1,
      userRole: 'USER',
      userPfp: 'user'
    };
    localStorage.setItem('user', JSON.stringify(user));
    
    return { token: response.token, user };
  },

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  },

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  },

  getUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
};
