import { initializeApp } from "firebase/app";
import { getFirestore, doc, deleteDoc } from "firebase/firestore";
import {
  getStorage,
  uploadBytes,
  uploadBytesResumable,
  ref,
  getDownloadURL,
  deleteObject,
  listAll,
  StorageReference,
} from "firebase/storage";

const app = initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
});

const db = getFirestore(app);
const storage = getStorage(app);

const uploadFileToStorage = async (f: File, sessionId: string) => {
  try {
    const fileRef = ref(storage, `${sessionId}/${f.name}`);
    const metaData = { contentType: f.type };
    let { ref: reference, state } = await uploadBytesResumable(
      fileRef,
      f,
      metaData
    );
    return { reference, state };
  } catch (err) {
    console.error(err);
  }
};

const getDownloadedFileUrl = async (ref: any) => {
  const url = await getDownloadURL(ref);
  return url;
};

const deleteSessionFiles = async (sessionId: string) => {
  const folderRef = ref(storage, `${sessionId}`);
  listAll(folderRef).then((res) => {
    const { items } = res;
    items.forEach(async (item) => {
      await deleteObject(item);
    });
  });
};

const deleteSessionFully = async (sessionId: string) => {
  try {
    await deleteDoc(doc(db, "sessions", sessionId));
    await deleteSessionFiles(sessionId);
    return { isDeleted: true };
  } catch (err) {
    console.error(err);
    return { isDeleted: false };
  }
};

export {
  db,
  storage,
  uploadFileToStorage,
  getDownloadedFileUrl,
  deleteSessionFiles,
  deleteSessionFully,
};
