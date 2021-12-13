import axios, { AxiosError } from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

import {
  addSubscriber,
  deleteSubscriber,
  getDetails,
} from '../../../../clients/gruppo/lib/subscribers';

const axiosErrorHandler = (res: NextApiResponse, err: AxiosError | Error) => {
  if (axios.isAxiosError(err) && err.response) {
    res.status(err.response.status).json(err.response.data);
  } else {
    res.status(500).json({ error: 'An error occured' });
  }
};

const NewsletterEndpoint = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const { query, method, body } = req;
  const groupId = Array.isArray(query.groupId)
    ? query.groupId[0]
    : query.groupId;
  const email = Array.isArray(query.email) ? query.email[0] : query.email;
  switch (method) {
    case 'GET':
      const subscriber = await getDetails(groupId, email).catch((err) =>
        axiosErrorHandler(res, err)
      );
      if (subscriber) res.json(subscriber.data);
      break;
    case 'POST':
      const subscriberMail = await addSubscriber(groupId, body).catch((err) =>
        axiosErrorHandler(res, err)
      );
      if (subscriberMail) res.json({ email: subscriberMail.data });
      break;
    case 'DELETE':
      const response = await deleteSubscriber(groupId, email).catch((err) =>
        axiosErrorHandler(res, err)
      );
      if (response) {
        res.json({ email });
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default NewsletterEndpoint;
