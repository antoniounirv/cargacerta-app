'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Helper function to get SDKs
function getSdks(firebaseApp: FirebaseApp) {
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp)
  };
}

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  if (getApps().length > 0) {
    return getSdks(getApp());
  }

  // If no app is initialized, create one.
  // This logic correctly handles both automatic initialization from App Hosting
  // and local development using the config object, without duplication.
  try {
    // Firebase App Hosting provides environment variables that initializeApp() uses automatically.
    const app = initializeApp();
    return getSdks(app);
  } catch (e) {
    if (process.env.NODE_ENV === "production") {
      console.warn('Automatic Firebase initialization failed, falling back to config object.', e);
    }
    // Fallback for local development or if auto-init fails.
    const app = initializeApp(firebaseConfig);
    return getSdks(app);
  }
}


export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';