import React from 'react';

import styles from './eventInfo.module.scss';
import { EventFieldsFragment } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import getLocalisedString from '../../../utils/getLocalisedString';

interface Props {
  event: EventFieldsFragment;
}

const EventInfo: React.FC<Props> = ({ event }) => {
  const locale = useLocale();
  const eventName = getLocalisedString(event.name, locale);
  const organisationName = event.pEvent?.organisation?.name;
  return (
    <div className={styles.eventInfo}>
      <div className={styles.eventName}>{eventName}</div>
      <div className={styles.organisationName}>{organisationName}</div>
    </div>
  );
};

export default EventInfo;
