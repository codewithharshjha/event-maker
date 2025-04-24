"use client"
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { User } from '@/types/type';

// -----------------------
// Types
// -----------------------


type RegisterData = {
  name: string;
  email: string;
  password: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  register: (formData: RegisterData) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
};

// -----------------------
// Context
// -----------------------

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// -----------------------
// Provider
// -----------------------

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
console.log("from middleware",token)
      try {
        axios.defaults.headers.common['x-auth-token'] = token;
        const res = await axios.get<User>('/api/me');
        console.log(res.data)
        setUser(res.data);
      } catch (err) {
        console.error('Failed to load user', err);
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['x-auth-token'];
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const register = async (formData: RegisterData): Promise<boolean> => {
    try {
      const res = await axios.post<{ token: string }>(
        '/api/register',
        formData
      );
      localStorage.setItem('token', res.data.token);
      axios.defaults.headers.common['x-auth-token'] = res.data.token;

      const userRes = await axios.get<User>('/api/me');
      setUser(userRes.data);

      toast.success('Registration successful!');
      return true;
    } catch (err: any) {
      const errorMsg = err.response?.data?.msg || 'Registration failed';
      toast.error(errorMsg);
      return false;
    }
  };

  const login = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const res = await axios.post('/api/login', {
        email,
        password,
      });
      console.log("from login ",res.data)
     if(res.status !==200){
      
      return false
     }
      localStorage.setItem('token', res.data.token);
    axios.defaults.headers.common['x-auth-token'] = res.data.token;
console.log('header name changes',axios.defaults.headers.common['x-auth-token'])
      const userRes = await axios.get<User>('/api/me');
console.log('from auth',userRes)
      setUser(userRes.data);

      toast.success('Login successful!');
      return true;
    } catch (err: any) {
      const errorMsg = err.response?.data?.msg || 'Login failed';
      toast.error(errorMsg);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['x-auth-token'];
    setUser(null);
    toast.info('You have been logged out');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
