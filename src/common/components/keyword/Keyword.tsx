import { UrlObject } from 'url';

import classNames from 'classnames';
import capitalize from 'lodash/capitalize';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import * as React from 'react';

import styles from './keyword.module.scss';

export type KeywordProps = {
  keyword: string | JSX.Element;
  href: string | UrlObject | null;
  itemType: 'button' | 'link' | 'static';
  color?: 'grey' | 'black' | 'green' | 'red' | 'yellow';
};

type NavigationKeywordProps = Omit<KeywordProps, 'itemType' | 'color'> & {
  href: string | UrlObject;
};

const KeywordLink: React.FC<NavigationKeywordProps> = ({
  href,
  keyword: label,
  ...rest
}) => {
  return (
    <NextLink legacyBehavior href={href}>
      <a className={styles.keyword} {...rest}>
        {label}
      </a>
    </NextLink>
  );
};

const KeywordButton: React.FC<NavigationKeywordProps> = ({
  href,
  keyword: label,
  ...rest
}) => {
  const router = useRouter();

  const handleButtonClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    router.push(href);
  };
  return (
    <button className={styles.keyword} onClick={handleButtonClick} {...rest}>
      {label}
    </button>
  );
};

const Keyword: React.FC<KeywordProps> = ({
  itemType = 'link',
  keyword,
  href,
  color = 'grey',
  ...rest
}) => {
  const label = typeof keyword === 'string' ? capitalize(keyword) : keyword;

  if (itemType === 'link') {
    if (!href) {
      throw new Error("When itemType is set to 'link', the 'href' is required");
    }
    return <KeywordLink keyword={label} href={href} {...rest} />;
  } else if (itemType === 'button') {
    if (!href) {
      throw new Error(
        "When itemType is set to 'button', the 'href' is required"
      );
    }
    return <KeywordButton keyword={label} href={href} {...rest} />;
  } else if (itemType === 'static') {
    if (href) {
      throw new Error(
        "When itemType is set to 'static', the 'href' should be set to null."
      );
    }
    return (
      <label
        className={classNames(styles.keyword, {
          [styles[`keyword-${color}`]]: true,
        })}
        {...rest}
      >
        {label}
      </label>
    );
  }

  return null;
};

export default Keyword;
