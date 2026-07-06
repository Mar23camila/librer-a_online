/**
 * devTools: Herramientas de debugging para contextos en desarrollo.
 * Facilita inspeccionar estado y acciones de contextos en la consola.
 */

const isDev = import.meta.env.DEV;

export function createContextDevTools(contextName) {
  return {
    log: (action, state, previousState = null) => {
      if (!isDev) return;
      console.group(`[${contextName}] ${action}`);
      console.log("Previous State:", previousState);
      console.log("Current State:", state);
      console.groupEnd();
    },

    logAction: (action, payload = null) => {
      if (!isDev) return;
      console.log(`🔵 [${contextName}] Action: ${action}`, payload || "");
    },

    logError: (action, error) => {
      if (!isDev) return;
      console.error(`❌ [${contextName}] Error in ${action}:`, error);
    },

    logWarning: (message) => {
      if (!isDev) return;
      console.warn(`⚠️  [${contextName}] ${message}`);
    },
  };
}

/**
 * Crear un objeto de contexto completo para DevTools.
 * Uso en componentes de debugging.
 */
export function createContextSnapshot(contextName, state, actions = {}) {
  return {
    __context: contextName,
    __timestamp: new Date().toISOString(),
    state,
    actions: Object.keys(actions),
  };
}

/**
 * Exportar estado de múltiples contextos para análisis.
 */
export function exportContextsState(contexts) {
  if (!isDev) return null;
  const snapshot = {};
  Object.entries(contexts).forEach(([name, state]) => {
    snapshot[name] = createContextSnapshot(name, state);
  });
  return snapshot;
}
