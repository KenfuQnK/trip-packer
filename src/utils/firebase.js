import { initializeApp } from "firebase/app";
import {
  getFirestore,
  initializeFirestore,
  memoryLocalCache,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore";

const runtimeConfig = globalThis.__firebase_config
  ? JSON.parse(globalThis.__firebase_config)
  : null;

const envConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

function hasFirebaseConfig(config) {
  return Boolean(
    config?.apiKey &&
      config?.authDomain &&
      config?.projectId &&
      config?.storageBucket &&
      config?.messagingSenderId &&
      config?.appId,
  );
}

export const isCanvasEnvironment = Boolean(runtimeConfig);
export const firebaseConfig = runtimeConfig ?? envConfig;
export const isFirebaseReady = hasFirebaseConfig(firebaseConfig);

const app = isFirebaseReady ? initializeApp(firebaseConfig) : null;

let db = null;

if (app) {
  try {
    db = initializeFirestore(app, {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager(),
      }),
    });
  } catch {
    db = initializeFirestore(app, {
      localCache: memoryLocalCache(),
    });
  }
}

if (app && !db) {
  db = getFirestore(app);
}

export { app, db };
