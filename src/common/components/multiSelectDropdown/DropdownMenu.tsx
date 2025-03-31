import { useTranslation } from 'next-i18next';
import React from 'react';

import styles from './dropdownMenu.module.scss';
import type { I18nNamespace } from '../../../types';

interface Props {
  isOpen: boolean;
  onClear: () => void;
  children?: React.ReactNode;
}

const DropdownMenu: React.FC<Props> = ({ children, isOpen, onClear }) => {
  const { t } = useTranslation<I18nNamespace>();
  if (!isOpen) return null;

  return (
    <div className={styles.dropdownMenu}>
      <div className={styles.dropdownMenuWrapper}>{children}</div>
      <button className={styles.btnClear} onClick={onClear} type="button">
        {t('common:dropdown.buttonClear')}
      </button>
    </div>
  );
};

export default DropdownMenu;
