/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {
  scheduleCallback24Sync,
} from "./callback24Sync/callback24Sync";
import {scheduleFacebookSync} from "./facebookSync/facebookSync";
import {scheduleGmailSync} from "./gamilSync/gmailSync";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


export {
  scheduleCallback24Sync,
  scheduleGmailSync,
  scheduleFacebookSync,
};
