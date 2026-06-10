import type { NextApiRequest, NextApiResponse } from 'next';

import getEnvValue from '../../utils/getEnvValue';

export default function handler(_: NextApiRequest, res: NextApiResponse) {
  const packageVersion = process.env.APP_VERSION ?? '';
  const release = getEnvValue('NEXT_PUBLIC_SENTRY_RELEASE') ?? '';
  const commitHash = getEnvValue('NEXT_PUBLIC_COMMITHASH') ?? '';
  const buildTime = process.env.BUILD_TIME ?? '';

  res.status(200).json({
    status: 'ok',
    release,
    packageVersion,
    commitHash,
    buildTime,
  });
}
