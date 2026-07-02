import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { getModuleStatuses, setModuleStatus as persistModuleStatus } from '../lib/progress';

const ProgressContext = createContext(null);

export function ProgressProvider({ children }) {
  const { user } = useAuth();
  const [statuses, setStatuses] = useState({});

  const refresh = useCallback(async () => {
    if (!user) {
      setStatuses({});
      return;
    }
    const data = await getModuleStatuses(user);
    setStatuses(data);
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const updateModuleStatus = useCallback(
    async (moduleId, statut) => {
      if (!user) return;
      await persistModuleStatus(user, moduleId, statut);
      setStatuses((prev) => ({ ...prev, [moduleId]: statut }));
    },
    [user]
  );

  return (
    <ProgressContext.Provider value={{ statuses, updateModuleStatus, refresh }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress doit être utilisé à l’intérieur de ProgressProvider');
  return ctx;
}
