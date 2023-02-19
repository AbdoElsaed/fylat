import { bucket, db } from './instance'

export const deleteFullSession = async (sessionId: string) => {
    try {
        // delete the firestore session document
        const docDeletingResponse = await db.collection('sessions').doc(sessionId).delete();
        const storageDeletingResponse = await bucket.deleteFiles({ prefix: `${sessionId}/` });

        console.log({ docDeletingResponse, storageDeletingResponse })

    } catch (err) {
        console.error(err)
    }
}