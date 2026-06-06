import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ApiKeyContextType {
  apiKey: string | null;
  isLoading: boolean;
  saveApiKey: (key: string) => Promise<void>;
  deleteApiKey: () => Promise<void>;
}

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

const API_KEY_STORAGE_KEY = 'SPEAKINGENG_GEMINI_API_KEY';

export const ApiKeyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Load API Key from AsyncStorage on mount
    const loadApiKey = async () => {
      try {
        const storedKey = await AsyncStorage.getItem(API_KEY_STORAGE_KEY);
        if (storedKey) {
          setApiKey(storedKey);
        }
      } catch (error) {
        console.error('Failed to load API key from storage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadApiKey();
  }, []);

  const saveApiKey = async (key: string) => {
    try {
      await AsyncStorage.setItem(API_KEY_STORAGE_KEY, key);
      setApiKey(key);
    } catch (error) {
      console.error('Failed to save API key to storage:', error);
      throw error;
    }
  };

  const deleteApiKey = async () => {
    try {
      await AsyncStorage.removeItem(API_KEY_STORAGE_KEY);
      setApiKey(null);
    } catch (error) {
      console.error('Failed to delete API key from storage:', error);
      throw error;
    }
  };

  return (
    <ApiKeyContext.Provider value={{ apiKey, isLoading, saveApiKey, deleteApiKey }}>
      {children}
    </ApiKeyContext.Provider>
  );
};

export const useApiKey = () => {
  const context = useContext(ApiKeyContext);
  if (context === undefined) {
    throw new Error('useApiKey must be used within an ApiKeyProvider');
  }
  return context;
};
