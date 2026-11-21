/**
 * IndexedDB storage utility for RetinaScan AI.
 * Reliably stores complete analysis records (including original retinal images,
 * Grad-CAM overlays, CNN probability vectors, and complete LLM reports)
 * without the 5MB quota limitations of localStorage.
 */

const DB_NAME = "RetinaScanAI_DB";
const DB_VERSION = 1;
const STORE_ANALYSES = "analyses";
const STORE_ACTIVE_SESSION = "active_session";

function openDB() {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      reject(new Error("IndexedDB is not supported in this environment"));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Primary store for completed analyses history
      if (!db.objectStoreNames.contains(STORE_ANALYSES)) {
        const analysesStore = db.createObjectStore(STORE_ANALYSES, { keyPath: "id" });
        analysesStore.createIndex("timestamp", "timestamp", { unique: false });
      }

      // Store for active workspace session (to survive page refresh)
      if (!db.objectStoreNames.contains(STORE_ACTIVE_SESSION)) {
        db.createObjectStore(STORE_ACTIVE_SESSION, { keyPath: "key" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Save a completed analysis record to history.
 */
export async function saveAnalysis(record) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction([STORE_ANALYSES, STORE_ACTIVE_SESSION], "readwrite");
      const analysesStore = tx.objectStore(STORE_ANALYSES);
      const activeStore = tx.objectStore(STORE_ACTIVE_SESSION);

      analysesStore.put(record);
      activeStore.put({ key: "current_analysis", data: record });

      tx.oncomplete = () => resolve(record);
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.error("IndexedDB saveAnalysis error:", err);
    throw err;
  }
}

/**
 * Retrieve all completed analyses sorted newest first.
 */
export async function getAllAnalyses() {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_ANALYSES, "readonly");
      const store = tx.objectStore(STORE_ANALYSES);
      const request = store.getAll();

      request.onsuccess = () => {
        const items = request.result || [];
        // Sort newest first
        items.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        resolve(items);
      };
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.error("IndexedDB getAllAnalyses error:", err);
    return [];
  }
}

/**
 * Get a single analysis by its unique ID.
 */
export async function getAnalysisById(id) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_ANALYSES, "readonly");
      const store = tx.objectStore(STORE_ANALYSES);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.error("IndexedDB getAnalysisById error:", err);
    return null;
  }
}

/**
 * Delete a specific analysis record.
 */
export async function deleteAnalysis(id) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_ANALYSES, "readwrite");
      const store = tx.objectStore(STORE_ANALYSES);
      store.delete(id);

      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.error("IndexedDB deleteAnalysis error:", err);
    return false;
  }
}

/**
 * Save active analysis session so browser refresh retains it.
 */
export async function saveActiveSession(sessionData) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_ACTIVE_SESSION, "readwrite");
      const store = tx.objectStore(STORE_ACTIVE_SESSION);
      store.put({ key: "current_analysis", data: sessionData });

      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn("IndexedDB saveActiveSession error:", err);
  }
}

/**
 * Retrieve active analysis session upon page load or reload.
 */
export async function getActiveSession() {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_ACTIVE_SESSION, "readonly");
      const store = tx.objectStore(STORE_ACTIVE_SESSION);
      const request = store.get("current_analysis");

      request.onsuccess = () => resolve(request.result?.data || null);
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn("IndexedDB getActiveSession error:", err);
    return null;
  }
}

/**
 * Clear the active session (e.g., when user explicitly selects a preset).
 */
export async function clearActiveSession() {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_ACTIVE_SESSION, "readwrite");
      const store = tx.objectStore(STORE_ACTIVE_SESSION);
      store.delete("current_analysis");

      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn("IndexedDB clearActiveSession error:", err);
  }
}
