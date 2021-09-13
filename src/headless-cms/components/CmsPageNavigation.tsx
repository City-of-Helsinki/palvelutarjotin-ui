/* eslint-disable jsx-a11y/anchor-is-valid */
import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import Container from '../../domain/app/layout/Container';
import { ROUTES } from '../../domain/app/routes/constants';
import { NavigationObject } from '../../pages/cms-page/[...slug]';
import { uriToBreadcrumbs } from '../utils';
import styles from './cmsPage.module.scss';

const CmsPageNavigation: React.FC<{
  navigation?: NavigationObject[][];
}> = ({ navigation }): JSX.Element => {
  const router = useRouter();

  const isActiveLink = (uri: string) => {
    const breadcrumbs = uriToBreadcrumbs(`${router.asPath}/`);
    return breadcrumbs.some((b) => b === uri);
  };

  return (
    <>
      {navigation?.map((navigationArray, index) => {
        return (
          <div className={styles.navigationRowContainer} key={index}>
            <Container>
              <nav>
                <div className={styles.navigationRow} key={index}>
                  {navigationArray
                    ?.sort((a, b) => a.title.localeCompare(b.title))
                    .map((n) => {
                      const uri = ROUTES.CMS_PAGE.replace('/:slug', n.uri);
                      return (
                        <Link key={n.uri} locale={n.locale} href={uri}>
                          <a
                            className={classNames({
                              [styles.activeLink]: isActiveLink(uri),
                            })}
                          >
                            <span>{n.title}</span>
                          </a>
                        </Link>
                      );
                    })}
                </div>
              </nav>
            </Container>
          </div>
        );
      })}
    </>
  );
};

export default CmsPageNavigation;
