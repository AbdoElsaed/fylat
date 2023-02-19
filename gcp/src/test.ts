import { addSessionToQueue } from './utils/mq'

const testMq = async () => {
    const j = await addSessionToQueue({ sessionId: '123' })
    console.log(j)
}


(async () => {
    await testMq()
})()