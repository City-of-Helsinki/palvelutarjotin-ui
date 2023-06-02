// eslint-disable-next-line @next/next/no-document-import-in-page
import { DocumentProps } from 'next/document';

import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from '../constants';

export default function documentLang({ __NEXT_DATA__ }: DocumentProps): string {
  const { props } = __NEXT_DATA__;

  const lang = Object.values(SUPPORTED_LANGUAGES).find(
    (l) => l === props.initialLanguage
  );

  return lang || DEFAULT_LANGUAGE;
}
