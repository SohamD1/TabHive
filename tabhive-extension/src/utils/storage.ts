/**
 * Utility functions for Chrome storage operations
 */

/**
 * Gets the API key from storage
 * @returns The API key if it exists, or empty string if not
 */
export async function getApiKeyFromStorage(): Promise<string> {
  try {
    const result = await chrome.storage.local.get('openaiApiKey');
    return result.openaiApiKey || '';
  } catch (error) {
    console.error('Error retrieving API key from storage:', error);
    return '';
  }
}

/**
 * Sets the API key in storage
 * @param apiKey - The API key to store
 */
export async function setApiKeyInStorage(apiKey: string): Promise<void> {
  try {
    await chrome.storage.local.set({ 'openaiApiKey': apiKey });
    console.log('API key stored successfully');
  } catch (error) {
    console.error('Error storing API key:', error);
    throw error;
  }
}

/**
 * Gets a value from storage by key
 * @param key - The key to retrieve
 * @returns The value if it exists, or null if not
 */
export async function getFromStorage<T>(key: string): Promise<T | null> {
  try {
    const result = await chrome.storage.local.get(key);
    return result[key] || null;
  } catch (error) {
    console.error(`Error retrieving ${key} from storage:`, error);
    return null;
  }
}

/**
 * Sets a value in storage
 * @param key - The key to store under
 * @param value - The value to store
 */
export async function setInStorage<T>(key: string, value: T): Promise<void> {
  try {
    const data: { [key: string]: T } = {};
    data[key] = value;
    await chrome.storage.local.set(data);
  } catch (error) {
    console.error(`Error storing ${key} in storage:`, error);
    throw error;
  }
}

/**
 * Removes a value from storage
 * @param key - The key to remove
 */
export async function removeFromStorage(key: string): Promise<void> {
  try {
    await chrome.storage.local.remove(key);
  } catch (error) {
    console.error(`Error removing ${key} from storage:`, error);
    throw error;
  }
}

/**
 * Clears all values from storage
 */
export async function clearStorage(): Promise<void> {
  try {
    await chrome.storage.local.clear();
  } catch (error) {
    console.error('Error clearing storage:', error);
    throw error;
  }
} 