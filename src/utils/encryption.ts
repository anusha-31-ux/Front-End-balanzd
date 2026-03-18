import CryptoJS from 'crypto-js';

/**
 * Encryption key - from environment variable
 */
const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'DRINK_HOT_WATER';

/**
 * Encrypts data using AES encryption
 * @param data - Data to encrypt (will be converted to JSON string)
 * @returns Encrypted string
 */
export const encryptData = (data: unknown): string => {
  try {
    // Convert data to JSON string
    const jsonString = JSON.stringify(data);
    
    // Encrypt using AES
    const encrypted = CryptoJS.AES.encrypt(jsonString, ENCRYPTION_KEY).toString();
    
    return encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
};

/**
 * Decrypts data using AES decryption
 * @param encryptedData - Encrypted string to decrypt
 * @returns Decrypted data (parsed from JSON)
 */
export const decryptData = <T = unknown>(encryptedData: string): T => {
  try {
    // Decrypt using AES
    const decrypted = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
    
    // Convert to UTF8 string
    const jsonString = decrypted.toString(CryptoJS.enc.Utf8);
    
    if (!jsonString) {
      throw new Error('Decryption resulted in empty string');
    }
    
    // Parse JSON string back to object
    const data = JSON.parse(jsonString);
    
    return data;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
};
