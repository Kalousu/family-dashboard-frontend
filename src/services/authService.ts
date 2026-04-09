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
  user?: User; // Optional, da Backend nur token zurückgibt
}

export interface LoginRequest {
  name: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  familyId?: number; // Optional, wird automatisch auf 1 gesetzt
}

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await fetchApi<{ token: string }>('/api/auth/login', 'POST', credentials);
    
    // Store token in localStorage
    localStorage.setItem('auth_token', response.token);
    
    // Create a minimal user object from credentials
    const user: User = {
      id: 0, // Will be updated when we fetch user data
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
    // Add familyId: 1 for now (existing family from DataSeeder)
    const requestData = { ...data, familyId: 1 };
    const response = await fetchApi<{ token: string }>('/api/auth/register', 'POST', requestData);
    
    // Store token in localStorage
    localStorage.setItem('auth_token', response.token);
    
    // Create user object from registration data
    const user: User = {
      id: 0, // Will be updated when we fetch user data
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
