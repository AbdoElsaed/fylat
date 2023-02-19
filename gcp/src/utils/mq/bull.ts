import Queue from 'bull'
import dotenv from 'dotenv'


dotenv.config();

const sessionsQueue = new Queue(
    "todelete-sessions",
    process.env.UPSTASH_REDIS_URL as string
);


// when job is completed
// sessionsQueue.on("completed", async (job, result) => {
//     console.log(`Job ${job.id} completed`);
//     const j = await sessionsQueue.getJob(job.id);
//     await j?.remove();
//     console.log(`Job ${job.id} is deleted`);
//     process.exit(1);
// });


// processing a job
sessionsQueue.process(async (job, done) => {
    const { sessionId } = job.data;
    console.log(`job ${job.id} of session ${sessionId} is being processed`);
    try {

        // await deleteFullSession(sessionId);
        console.log(`session ${sessionId} is deleted successfully`);
        // eventEmitter.emit('session-deleted', sessionId)
    } catch (err) {
        console.error(err);
    }
});


(async () => {

    console.log('before');
    const sessionId = '123'
    let j = await sessionsQueue.add({ sessionId }, { delay: 60000, jobId: sessionId })
    console.log('after');

})()


export { sessionsQueue }