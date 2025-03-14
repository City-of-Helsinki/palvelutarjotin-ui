import type { NextApiRequest, NextApiResponse } from 'next';

import {
  getAuthorizationHeader,
  getPreviewDataMaxAge,
} from '../../domain/app/ssr/jwtTokenUtils';

const Preview = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!req.query.secret || !req.query.uri) {
    return res.status(401).json({ message: 'Invalid token' });
  }
  // test
  const token = req.query.secret.toString();
  const maxAge = getPreviewDataMaxAge(token);

  res.setPreviewData(
    { token: getAuthorizationHeader(token), maxAge },
    { maxAge }
  );
  res.redirect(302, req.query.uri as string);
};

export default Preview;
