import * as admin from "firebase-admin";
import {utilsConfig} from "./projectConfig";

admin.initializeApp({
  projectId: utilsConfig.secretManagerConfig.projectId,
});

const firestoreDb = admin.firestore();

export {admin, firestoreDb};

// export default admin;
