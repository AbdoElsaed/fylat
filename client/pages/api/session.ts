// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { addSessionToQueue, eventEmitter } from "@/utils/mq";


type resType = {
  done: boolean;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<resType>
) {
  try {
    const reqMethod = req.method;
    const { id: sessionId, toDelete } = JSON.parse(req.body);


    switch (reqMethod) {
      case "POST":

        // add session to MQ to be automatically deleted after specific time
        if (toDelete) {
          const data = await addSessionToQueue({
            sessionId,
          });
          console.log({ data });
          res.status(200).json({ done: true })
        }

      default:
        console.log("blabla");
    }

    eventEmitter.on('session-deleted', (sessionId: string) => {
      res.write(`data: {"sessionId": "${sessionId}"}\n\n`)
    })

  } catch (err) {
    console.error(err);
  }
}
