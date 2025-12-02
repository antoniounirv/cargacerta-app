'use client';
import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'

// IMPORTANTE: NÃO MODIFIQUE ESTA FUNÇÃO
export function initializeFirebase() {
  if (!getApps().length) {
    // Importante! initializeApp() é chamado sem argumentos porque o Firebase App Hosting
    // se integra com a função initializeApp() para fornecer as variáveis de ambiente necessárias para
    // popular o FirebaseOptions em produção. É crucial que tentemos chamar initializeApp()
    // sem argumentos.
    let firebaseApp;
    try {
      // Tenta inicializar via variáveis de ambiente do Firebase App Hosting
      firebaseApp = initializeApp();
    } catch (e) {
      // Em produção, apenas avisa, pois é normal usar o firebaseConfig para inicializar
      // durante o desenvolvimento
      if (process.env.NODE_ENV === "production") {
        console.warn('A inicialização automática falhou. Recorrendo ao objeto de configuração do Firebase.', e);
      }
      // Em desenvolvimento, ou se a inicialização automática falhar, inicializa com o objeto de configuração populado do .env
      firebaseApp = initializeApp(firebaseConfig);
    }

    return getSdks(firebaseApp);
  }

  // Se já estiver inicializado, retorna os SDKs com o App já inicializado
  return getSdks(getApp());
}

export function getSdks(firebaseApp: FirebaseApp) {
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp)
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
