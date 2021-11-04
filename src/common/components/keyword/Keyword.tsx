import { UrlObject } from 'url';

import Link from 'next/link';
import * as React from 'react';

import styles from './keyword.module.scss';

type KeywordProps = {
  keyword: string | JSX.Element;
  href: string | UrlObject;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
};

const Keyword: React.FC<KeywordProps> = ({ href, keyword, ...rest }) => {
  return (
    <Link href={href}>
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a className={styles.keyword} {...rest}>
        {keyword}
      </a>
    </Link>
  );
};

export default Keyword;
