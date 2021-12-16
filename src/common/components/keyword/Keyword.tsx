import { UrlObject } from 'url';

import capitalize from 'lodash/capitalize';
import Link from 'next/link';
import { useRouter } from 'next/router';
import * as React from 'react';

import styles from './keyword.module.scss';

type KeywordProps = {
  keyword: string | JSX.Element;
  href: string | UrlObject;
  itemType: 'button' | 'link';
};

const Keyword: React.FC<KeywordProps> = ({
  href,
  keyword,
  itemType = 'link',
  ...rest
}) => {
  const router = useRouter();
  const label = typeof keyword === 'string' ? capitalize(keyword) : keyword;
  const handleButtonClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    router.push(href);
  };

  return itemType === 'link' ? (
    <Link href={href}>
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a className={styles.keyword} {...rest}>
        {label}
      </a>
    </Link>
  ) : itemType === 'button' ? (
    <button className={styles.keyword} onClick={handleButtonClick} {...rest}>
      {label}
    </button>
  ) : null;
};

export default Keyword;
