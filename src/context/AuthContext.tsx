import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserRole, WorkerProfile } from '../types';
import { db } from '../db/db';

interface AuthContextType {
  role: UserRole;
  activeWorker: WorkerProfile | null;
  assessorName: string;
  loginAsDemoWorker: (workerId?: string) => Promise<void>;
  loginAsDemoAssessor: () => void;
  loginAsDemoAdmin: () => void;
  logout: () => void;
  setActiveWorker: (worker: WorkerProfile | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>(() => {
    return (localStorage.getItem('skillsetu_role') as UserRole) || 'guest';
  });

  const [activeWorker, setActiveWorkerState] = useState<WorkerProfile | null>(null);
  const [assessorName] = useState('Rajesh Sharma (Senior Assessor)');

  // Load initial active worker if role is worker
  useEffect(() => {
    const loadDefaultWorker = async () => {
      const storedWorkerId = localStorage.getItem('skillsetu_active_worker_id') || 'w-101';
      const worker = await db.workers.get(storedWorkerId);
      if (worker) {
        setActiveWorkerState(worker);
      } else {
        const firstWorker = await db.workers.toCollection().first();
        if (firstWorker) setActiveWorkerState(firstWorker);
      }
    };
    loadDefaultWorker();
  }, [role]);

  const loginAsDemoWorker = async (workerId = 'w-101') => {
    setRole('worker');
    localStorage.setItem('skillsetu_role', 'worker');
    localStorage.setItem('skillsetu_active_worker_id', workerId);
    const worker = await db.workers.get(workerId);
    if (worker) setActiveWorkerState(worker);
  };

  const loginAsDemoAssessor = () => {
    setRole('assessor');
    localStorage.setItem('skillsetu_role', 'assessor');
  };

  const loginAsDemoAdmin = () => {
    setRole('admin');
    localStorage.setItem('skillsetu_role', 'admin');
  };

  const logout = () => {
    setRole('guest');
    localStorage.setItem('skillsetu_role', 'guest');
    setActiveWorkerState(null);
  };

  const setActiveWorker = (worker: WorkerProfile | null) => {
    setActiveWorkerState(worker);
    if (worker) {
      localStorage.setItem('skillsetu_active_worker_id', worker.id);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        role,
        activeWorker,
        assessorName,
        loginAsDemoWorker,
        loginAsDemoAssessor,
        loginAsDemoAdmin,
        logout,
        setActiveWorker
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
