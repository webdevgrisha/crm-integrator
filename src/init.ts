import * as admin from "firebase-admin";

admin.initializeApp();

const firestoreDb = admin.firestore();

export {admin, firestoreDb};

// export default admin;
