import axios, { AxiosError } from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

import {
  addSubscriber,
  deleteSubscriber,
} from '../../../../clients/gruppo/lib/subscribers';
import { isFeatureEnabled } from '../../../../utils/featureFlags';

const axiosErrorHandler = (res: NextApiResponse, err: AxiosError | Error) => {
  if (axios.isAxiosError(err) && err.response) {
    res.status(err.response.status).json(err.response.data);
  } else {
    res
      .status(500)
      .json({ name: 'SubscribeNewsletterError', message: err.message });
  }
};

const NewsletterEndpoint = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  if (!isFeatureEnabled('NEWSLETTER')) {
    res.status(404).end();
    return;
  }

  const { query, method, body } = req;
  const groupId = Array.isArray(query.groupId)
    ? query.groupId[0]
    : query.groupId;
  const email = Array.isArray(query.email) ? query.email[0] : query.email;

  switch (method) {
    case 'POST': // To subscribe
      const subscriberMail = await addSubscriber(groupId, body).catch((err) =>
        axiosErrorHandler(res, err)
      );
      if (subscriberMail) res.json({ email: subscriberMail.data });
      break;
    // case 'GET': // to get subscription details
    //   // NOTE: The get details call is a minor security concern, because
    //   // with it it's possible to check which emails are subscribing the newsletter.
    //   // When the available methods changes, they also need to be activated from the routes of server.mjs -file and
    //   // to default handler below
    //   const subscriber = await getDetails(groupId, email).catch((err) =>
    //     axiosErrorHandler(res, err)
    //   );
    //   if (subscriber) res.json(subscriber.data);
    //   break;
    case 'DELETE': // To delete subscribtion details
      const response = await deleteSubscriber(groupId, email).catch((err) =>
        axiosErrorHandler(res, err)
      );
      if (response) {
        res.json({ email });
      }
      break;
    default:
      res.setHeader('Allow', ['POST', 'DELETE']); // Set the allowed methods here
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default NewsletterEndpoint;
