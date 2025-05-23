import { AxiosError, isAxiosError } from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

import { addSubscriber } from '../../../../clients/gruppo/lib/subscribers';
import { isFeatureEnabled } from '../../../../utils/featureFlags';

const axiosErrorHandler = (res: NextApiResponse, err: AxiosError | Error) => {
  if (isAxiosError(err) && err.response) {
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

  /*
    NOTE: Because of security concerns, we should allow the POST (subscribe to a newsletter) only, 
    until we have an implemention for the  account / subscription deletion feature.
    
    Unsubscribing (also via a POST -method) from the newsletter is done via Gruppo's own email templates.
    The details needs to be fetched (via a GET -method) when deciding, 
    whether to show or not to show the unsubscribe and account deletion links
  */

  switch (method) {
    case 'POST': {
      // To subscribe
      if (!groupId) {
        throw new Error('GroupId cannot be undefined');
      }
      const subscriberMail = await addSubscriber(groupId, body).catch((err) =>
        axiosErrorHandler(res, err)
      );
      if (subscriberMail) res.json({ email: subscriberMail.data });
      break;
    }
    // case 'GET': // to get subscription details
    //   const email = Array.isArray(query.email) ? query.email[0] : query.email;
    //   const subscriber = await getDetails(groupId, email).catch((err) =>
    //     axiosErrorHandler(res, err)
    //   );
    //   if (subscriber) res.json(subscriber.data);
    //   break;
    // case 'DELETE': // To delete subscribtion details
    //   const email = Array.isArray(query.email) ? query.email[0] : query.email;
    //   const response = await deleteSubscriber(groupId, email).catch((err) =>
    //     axiosErrorHandler(res, err)
    //   );
    //   if (response) {
    //     res.json({ email });
    //   }
    //   break;
    default:
      // res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      res.setHeader('Allow', ['POST']); // NOTE: Set the allowed methods here
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default NewsletterEndpoint;
