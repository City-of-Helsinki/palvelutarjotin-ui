import classNames from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import styles from './cmsSidebarContentCard.module.scss';

type Props = {
  title: string;
  url: string;
  image?: string;
  imageAlt?: string;
};

const CmsSidebarContentCard: React.FC<Props> = ({
  title,
  url,
  image,
  imageAlt,
}) => {
  return (
    <div
      className={classNames(styles.container, {
        [styles.withoutImage]: !Boolean(image),
      })}
    >
      {image && (
        <div className={styles.image}>
          <Image
            src={image}
            alt={imageAlt ?? ''}
            layout="fill"
            objectFit="cover"
          />
        </div>
      )}
      <h2 className={styles.title}>
        <Link href={url}>
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a>{title}</a>
        </Link>
      </h2>
    </div>
  );
};

export default CmsSidebarContentCard;
