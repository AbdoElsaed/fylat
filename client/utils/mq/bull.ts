import Bull from "bull";
import { deleteFullSession } from "@/utils/db";
import { eventEmitter } from './emitter'

const sessionsQueue = new Bull(
  "todelete-sessions",
  process.env.UPSTASH_REDIS_URL as string
);

// when job is completed
sessionsQueue.on("completed", (job, result) => {
  console.log(`Job ${job.id} completed`);
});

// processing a job
sessionsQueue.process(async (job, done) => {
  const { sessionId } = job.data;
  console.log(`job ${job.id} of session ${sessionId} is being processed`);
  try {
    await deleteFullSession(sessionId);
    console.log(`session ${sessionId} is deleted successfully`);
    eventEmitter.emit('session-deleted', sessionId)
  } catch (err) {
    console.error(err);
  }
});

// add a job to the queue
export const addSessionToQueue = async ({
  sessionId,
  hrsNum = 2,
}: {
  sessionId: string;
  hrsNum?: number;
}) => {
  // const delayedMs = hrsNum * 60 * 60 * 1000;
  // const currTime = new Date().getTime();
  // const timeMs = currTime + 20000;
  // const calculatedMs = timeMs - currTime;
  const job = await sessionsQueue.add({ sessionId }, { delay: 90000 });
  console.log(`session with id ${sessionId} is added to the queue`);
  let {
    id: jobId,
    data,
    name: jobName,
    queue: { name: queueName },
  } = job;
  return { jobId, data, jobName, queueName };
};
