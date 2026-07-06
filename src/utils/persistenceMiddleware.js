/**
 * persistenceMiddleware: Centraliza la lógica de persistencia en localStorage.
 * Proporciona funciones reutilizables para guardar y cargar estado.
 */

const STORAGE_PREFIX = "pv_";

export function getPersisted(key, defaultValue = null) {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch (err) {
    console.warn(`Error reading persisted state for ${key}:`, err);
    return defaultValue;
  }
}

export function setPersisted(key, value) {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.error(`Error persisting state for ${key}:`, err);
    return false;
  }
}

export function removePersisted(key) {
  try {
    localStorage.removeItem(STORAGE_PREFIX + key);
    return true;
  } catch (err) {
    console.error(`Error removing persisted state for ${key}:`, err);
    return false;
  }
}

export function clearAllPersisted() {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
    return true;
  } catch (err) {
    console.error("Error clearing persisted state:", err);
    return false;
  }
}

/**
 * Crea una clave de almacenamiento prefijada.
 * Uso: const key = createStorageKey('cart', userId) -> 'pv_cart_<userId>'
 */
export function createStorageKey(namespace, ...parts) {
  return namespace + (parts.length > 0 ? "_" + parts.join("_") : "");
}
