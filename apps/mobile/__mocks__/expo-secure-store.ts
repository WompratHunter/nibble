/**
 * Manual mock for expo-secure-store.
 *
 * Uses an in-memory Map so tests can read back values they stored without
 * calling native Keychain code. Reset state between tests via
 * jest.resetAllMocks() or by calling clearAll() directly.
 */
const store = new Map<string, string>();

const getItemAsync = jest.fn(async (key: string): Promise<string | null> => {
  return store.get(key) ?? null;
});

const setItemAsync = jest.fn(async (key: string, value: string): Promise<void> => {
  store.set(key, value);
});

const deleteItemAsync = jest.fn(async (key: string): Promise<void> => {
  store.delete(key);
});

/** Helper: wipe the in-memory store between tests. */
const clearAll = (): void => {
  store.clear();
};

module.exports = {
  getItemAsync,
  setItemAsync,
  deleteItemAsync,
  clearAll,
};
