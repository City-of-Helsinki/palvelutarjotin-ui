import type { ParsedUrlQueryInput } from 'querystring';
import type { UrlObject } from 'url';

import queryString from 'query-string';

const isDynamic = (part: string) => part.startsWith('[') && part.endsWith(']');
const parseDynamicName = (part: string) => part.slice(1, -1);
const queryToString = (
  query: Record<string, unknown> | string | undefined,
  usedQueryParts: string[]
) => {
  if (!query) {
    return;
  }

  if (typeof query === 'string') {
    return query;
  }

  const queryWithoutUsed = Object.entries(query).reduce((acc, [key, value]) => {
    if (usedQueryParts.includes(key)) {
      return acc;
    }

    return {
      ...acc,
      [key]: value,
    };
  }, {});

  const queryAsString = queryString.stringify(queryWithoutUsed);

  return queryAsString.length > 0 ? `?${queryAsString}` : null;
};
export default function stringifyUrlObject(url: UrlObject): string {
  const usedQueryParts: string[] = [];
  const pathname = url.pathname
    ?.split('/')
    .map((part) => {
      if (!isDynamic(part)) {
        return part;
      }

      let dynamicPartName = parseDynamicName(part);

      // check if is wildcard [...slug] etc
      // TODO: fix the logic, probably won't work with wildcard and search params
      if (dynamicPartName.startsWith('...')) {
        dynamicPartName = dynamicPartName.replace('...', '');
        usedQueryParts.push(dynamicPartName);

        const wildCardParts = (url.query as ParsedUrlQueryInput)?.[
          dynamicPartName
        ];

        if (Array.isArray(wildCardParts)) {
          return wildCardParts.map((part) => part).join('/');
        }
      }

      usedQueryParts.push(dynamicPartName);
      return (url.query as ParsedUrlQueryInput)?.[dynamicPartName] ?? part;
    })
    .join('/');

  const search =
    url.search ??
    queryToString(url.query as ParsedUrlQueryInput, usedQueryParts) ??
    '';
  return `${pathname}${search}`;
}
