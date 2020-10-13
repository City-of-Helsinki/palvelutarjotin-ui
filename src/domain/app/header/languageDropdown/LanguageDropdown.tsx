import { IconGlobe } from 'hds-react';
import React from 'react';

import MenuDropdown, {
  MenuItem,
} from '../../../../common/components/menuDropdown/MenuDropdown';
import { SUPPORTED_LANGUAGES } from '../../../../constants';
import useLocale from '../../../../hooks/useLocale';
import { i18n, useTranslation } from '../../../../i18n';
import { Language } from '../../../../types';

const LanguageDropdown: React.FC = () => {
  const { t } = useTranslation('header');
  const locale = useLocale();

  const languageOptions = Object.values(SUPPORTED_LANGUAGES).map((language) => {
    return {
      language,
      text: t(`header:languages.${language}`),
      value: language,
    };
  });

  const changeLanguage = (newLanguage: Language) => {
    i18n.changeLanguage(newLanguage);
  };

  const handleMenuItemClick = (item: MenuItem) => {
    changeLanguage(item.language || 'fi');
  };

  return (
    <MenuDropdown
      buttonAriaLabel={t('header:changeLanguage')}
      buttonText={locale.toUpperCase()}
      icon={<IconGlobe />}
      items={languageOptions}
      onMenuItemClick={handleMenuItemClick}
      value={locale}
    />
  );
};

export default LanguageDropdown;
