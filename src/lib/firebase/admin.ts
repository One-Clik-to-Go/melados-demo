import * as admin from 'firebase-admin';

function formatPrivateKey(key: string | undefined): string | undefined {
  if (!key) return undefined;
  // Replace escaped \n with actual newlines if present
  return key.replace(/\\n/g, '\n');
}

export function getAdminApp(): admin.app.App {
  if (admin.apps.length > 0) {
    return admin.apps[0]!;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID || 'melados-demo-db';
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL || 'firebase-adminsdk-fbsvc@melados-demo-db.iam.gserviceaccount.com';
  const rawPrivateKey = process.env.FIREBASE_PRIVATE_KEY;
  const privateKey = formatPrivateKey(rawPrivateKey);

  if (privateKey && clientEmail) {
    try {
      return admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
    } catch (error) {
      console.warn('Failed to initialize Firebase Admin with certificate credentials, falling back to default app setup:', error);
    }
  }

  // Fallback initialization
  return admin.initializeApp({
    projectId,
  });
}

export function getAdminFirestore(): admin.firestore.Firestore {
  const app = getAdminApp();
  return admin.firestore(app);
}
