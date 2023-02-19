import admin, { ServiceAccount } from "firebase-admin";
import serviceAccount from "./serviceAccountKey.json";

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as ServiceAccount),
    });
  } catch (error: any) {
    console.log("Firebase admin initialization error", error.stack);
  }
}

const db = admin.firestore();
const storage = admin.storage();
const bucket = storage.bucket(process.env.FIREBASE_STORAGE_BUCKET);



export { db, bucket }