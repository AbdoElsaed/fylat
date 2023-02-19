import { sessionsQueue } from './bull'


// add a job to the queue
export const addSessionToQueue = async ({
    sessionId,
    hrsNum = 2,
}: {
    sessionId: string;
    hrsNum?: number;
}) => {

    // const delayedMs = hrsNum * 60 * 60 * 1000;
    console.log('before adding')
    const job = await sessionsQueue.add({ sessionId }, { delay: 60000 });
    console.log('after adding')
    console.log(`session with id ${sessionId} is added to the queue`);
    let {
        id: jobId,
        data,
        name: jobName,
        queue: { name: queueName },
    } = job;
    console.log({ jobId, data, jobName, queueName })
    return { jobId, data, jobName, queueName };
};