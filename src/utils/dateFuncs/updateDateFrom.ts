import {admin, firestoreDb} from "../../init";


async function updateDateFrom(
  currentTimestamp: FirebaseFirestore.Timestamp,
  docId: string
): Promise<void> {
  try {
    const docRef = firestoreDb.collection("update_time").doc(docId);

    const doc = await docRef.get();

    if (!doc.exists) {
      throw Error("doc does not exist");
    }

    const incrementedTimestamp = new admin.firestore.Timestamp(
      currentTimestamp.seconds + 1,
      currentTimestamp.nanoseconds
    );

    await docRef.update({
      date: incrementedTimestamp,
    });

    console.log(`Successfully updated date for document "${docId}".`);
  } catch (error) {
    console.error("Error when updating a document:", error);

    throw new Error(`Failed to update time in the document: ${docId}`);
  }
}


export {
  updateDateFrom,
};
