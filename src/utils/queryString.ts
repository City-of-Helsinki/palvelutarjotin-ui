import { assertUnreachable } from './typescript.utils';
import { SUPPORTED_LANGUAGES } from '../constants';

type QueryParamValue = string | string[];

export type QueryParams = {
  returnPath?: QueryParamValue;
};

export type QueryParam = keyof QueryParams;

const langPathRegExp = new RegExp(
  `/(${Object.values(SUPPORTED_LANGUAGES).join('|')})`
);

const stripLanguageFromPath = (path: string) =>
  path.replace(langPathRegExp, '');

const getParamValue = ({
  param,
  value,
}: {
  param: QueryParam;
  value: string;
}) => {
  switch (param) {
    case 'returnPath':
      return stripLanguageFromPath(value);
    default:
      return assertUnreachable(param, 'Unknown query parameter');
  }
};

export const addParamsToQueryString = (
  queryString: string,
  queryParams: QueryParams
): string => {
  const [query, hash] = queryString?.split('#') ?? [queryString, undefined];

  const searchParams = new URLSearchParams(query);
  Object.entries(queryParams).forEach(([key, values]) => {
    const param = key as QueryParam;
    if (Array.isArray(values)) {
      values.forEach((value) =>
        searchParams.append(param, getParamValue({ param, value }))
      );
    } else if (values) {
      searchParams.append(param, getParamValue({ param, value: values }));
    }
  });
  return '?' + searchParams.toString() + (hash ? `#${hash}` : '');
};
