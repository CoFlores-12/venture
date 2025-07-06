"use client"
import { useState, useEffect, createContext, useContext } from 'react';
import { useRouter } from 'next/navigation';

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check admin session on mount
  useEffect(() => {
    // Don't check session on login page
    if (typeof window !== 'undefined' && window.location.pathname === '/admin/login') {
      setLoading(false);
      return;
    }
    
    checkAdminSession();
  }, []);

  const checkAdminSession = async () => {
    try {
      const response = await fetch('/api/admin/auth/check', {
        method: 'GET',
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setAdmin(data.admin);
      } else {
        // 401 is expected when no session exists, not an error
        setAdmin(null);
      }
    } catch (error) {
      console.error('Error checking admin session:', error);
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password, adminCode) => {
    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password, adminCode }),
      });

      const data = await response.json();

      if (data.success) {
        setAdmin(data.admin);
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Error de conexión' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/admin/auth', {
        method: 'DELETE',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setAdmin(null);
      router.push('/admin/login');
    }
  };

  const value = {
    admin,
    loading,
    login,
    logout,
    checkAdminSession
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}; 