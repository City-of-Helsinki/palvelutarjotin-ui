import { UrlObject } from 'url';

import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { ROUTES } from '../../../domain/app/routes/constants';
import { KEYWORD_QUERY_PARAMS } from '../../../domain/events/constants';
import {
  KeywordOptions,
  useKeywordOptions,
} from '../../../domain/events/eventSearchForm/useKeywordOptions';
import { KeywordFieldsFragment } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import { Language } from '../../../types';
import getLocalisedString from '../../../utils/getLocalisedString';
import Keyword from './Keyword';
import styles from './keyword.module.scss';

type KeywordsListProps = {
  keywords: KeywordFieldsFragment[];
};

const KeywordsList: React.FC<KeywordsListProps> = ({ keywords }) => {
  const locale = useLocale();
  const { t } = useTranslation();
  const keywordOptions = useKeywordOptions();
  const keywordsPropArr = getKeywordsProps(keywords, keywordOptions, locale);

  return (
    <ul className={styles.keywordsList}>
      {keywordsPropArr.map((k) => (
        <li key={k.id}>
          <Keyword
            href={{ pathname: ROUTES.HOME, query: k.query }}
            keyword={k.label}
            aria-label={t('event:keywords.labelKeywordLink', {
              keyword: k.label,
            })}
          />
        </li>
      ))}
    </ul>
  );
};

// Kultus uses many keyword sets, so keywords need to be mapped to correct keyword query parameter
// E.g. Kirjastovierailu -> "?additionalCriteria=kultus%3A20", Jooga -> "?categories=yso%3Ap3111"
const getKeywordsProps = (
  keywords: KeywordFieldsFragment[],
  keywordOptions: KeywordOptions,
  locale: Language
): { label: string; query: UrlObject['query']; id: string }[] => {
  const keywordTypeMappers: {
    keywordOptionsKey: keyof KeywordOptions;
    queryKey: string;
  }[] = [
    {
      queryKey: KEYWORD_QUERY_PARAMS.ADDITIONAL_CRITERIA,
      keywordOptionsKey: 'additionalCriteriaKeywords',
    },
    {
      queryKey: KEYWORD_QUERY_PARAMS.TARGET_GROUPS,
      keywordOptionsKey: 'targetGroups',
    },
    {
      queryKey: KEYWORD_QUERY_PARAMS.CATEGORIES,
      keywordOptionsKey: 'categoryKeywords',
    },
  ];

  // match keywords from keyword sets to get correct query parameter
  return keywords.map((keyword) => {
    const label = getLocalisedString(keyword.name || {}, locale);

    let keywordProps:
      | { label: string; query: UrlObject['query']; id: string }
      | undefined;

    keywordTypeMappers.every(({ keywordOptionsKey, queryKey }) => {
      if (
        keywordOptions[keywordOptionsKey].find((k) => k.value === keyword.id)
      ) {
        keywordProps = {
          id: keyword.id ?? '',
          query: {
            [queryKey]: keyword.id ? [keyword.id] : null,
          },
          label,
        };
        return false;
      }
      return true;
    });

    return keywordProps
      ? keywordProps
      : {
          id: keyword.id ?? '',
          query: {
            categories: keyword.id ? [keyword.id] : null,
          },
          label,
        };
  });
};

export default KeywordsList;
