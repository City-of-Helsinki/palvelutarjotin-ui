import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(
  _: NextApiRequest | undefined,
  res: Pick<NextApiResponse, 'status'>
) {
  const packageVersion = process.env.APP_VERSION ?? '';
  const release = process.env.NEXT_PUBLIC_RELEASE ?? '';
  const commitHash = process.env.NEXT_PUBLIC_COMMITHASH ?? '';
  const buildTime = process.env.BUILD_TIME ?? '';

  res.status(200).json({
    status: 'ok',
    release,
    packageVersion,
    commitHash,
    buildTime,
  });
}
