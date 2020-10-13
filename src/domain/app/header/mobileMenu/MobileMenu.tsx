import classNames from 'classnames';
import React from 'react';

import { SUPPORTED_LANGUAGES } from '../../../../constants';
import useLocale from '../../../../hooks/useLocale';
import { i18n, useTranslation } from '../../../../i18n';
import { Language } from '../../../../types';
import styles from './mobileMenu.module.scss';

export const testIds = {
  menu: 'mobile-menu',
};

interface Props {
  id?: string;
  isMenuOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<Props> = ({ id, isMenuOpen, onClose }) => {
  const { t } = useTranslation();
  const locale = useLocale();

  const changeLanguage = (newLanguage: Language) => {
    i18n.changeLanguage(newLanguage);
    onClose();
  };

  return (
    <div
      aria-hidden={!isMenuOpen}
      className={classNames(styles.mobileMenu, {
        [styles.menuOpen]: isMenuOpen,
      })}
      data-testid={testIds.menu}
      id={id}
      style={{ visibility: isMenuOpen ? undefined : 'hidden' }}
    >
      <div className={styles.linksWrapper}></div>
      <div className={styles.languageSelect}>
        <ul>
          {Object.values(SUPPORTED_LANGUAGES).map((language) => (
            <li
              key={language}
              className={classNames(styles.languageLink, {
                [styles.isSelected]: locale === language,
              })}
            >
              <button lang={language} onClick={() => changeLanguage(language)}>
                {t(`header:languages.${language}`)}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MobileMenu;
