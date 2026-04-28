import AsyncStorage from '@react-native-async-storage/async-storage';

// In-memory fallback for environments where native AsyncStorage is missing (e.g., mismatched versions, incomplete linking)
const memoryStorage: Record<string, string> = {};

const isNativeAvailable = () => {
  try {
    return !!AsyncStorage;
  } catch {
    return false;
  }
};

const SafeStorage = {
  getItem: async (key: string) => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value;
    } catch (e) {
      console.warn(`SafeStorage: Falling back to memory for getItem(${key})`, e);
      return memoryStorage[key] || null;
    }
  },
  setItem: async (key: string, value: string) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      console.warn(`SafeStorage: Falling back to memory for setItem(${key})`, e);
      memoryStorage[key] = value;
    }
  },
  removeItem: async (key: string) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.warn(`SafeStorage: Falling back to memory for removeItem(${key})`, e);
      delete memoryStorage[key];
    }
  },
  clear: async () => {
    try {
      await AsyncStorage.clear();
    } catch (e) {
      console.warn('SafeStorage: Falling back to memory for clear()', e);
      Object.keys(memoryStorage).forEach(key => delete memoryStorage[key]);
    }
  }
};

export default SafeStorage;
