import { IconInfoCircle, IconFaceSmile } from 'hds-react';
import React from 'react';

import { EventFieldsFragment } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import { useTranslation } from '../../../i18n';
import IconTicket from '../../../icons/IconTicket';
import addUrlSlashes from '../../../utils/addUrlSlashes';
import EventKeywords from '../eventKeywords/EventKeywords';
import { getEventFields } from '../utils';
import styles from './eventBasicInfo.module.scss';
import EventCategorisation from './EventCategorisation';

interface EventBasicInfoProps {
  event: EventFieldsFragment;
}

const EventBasicInfo: React.FC<EventBasicInfoProps> = ({ event }) => {
  const locale = useLocale();
  const { t } = useTranslation();

  const {
    description,
    eventName,
    shortDescription,
    isEventFree,
    organization,
    contactEmail,
    contactPerson,
    contactPhoneNumber,
    infoUrl,
  } = getEventFields(event, locale);

  return (
    <section className={styles.eventBasicInfo}>
      <div className={styles.descriptionPart}>
        <h1>{eventName}</h1>
        <p className={styles.shortDescription}>{shortDescription}</p>
        <p>{description}</p>
        <EventKeywords event={event} />
        <EventCategorisation event={event} />
      </div>
      <div className={styles.infoRight}>
        {/* TODO: Add price information when it is implemented to palveluntarjotin-admin prject */}
        {isEventFree && (
          <div>
            <IconTicket />
            <p>{t('event:eventCard.free')}</p>
          </div>
        )}
        {infoUrl && (
          <div>
            <IconInfoCircle />
            <a href={addUrlSlashes(infoUrl)} target="_blank" rel="noreferrer">
              {infoUrl}
            </a>
          </div>
        )}
        <div>
          <IconFaceSmile />
          <div>
            <p className={styles.organization}>{organization}</p>
            {contactPerson && (
              <div className={styles.contactInfo}>
                <p>{t('event:contactPerson')}</p>
                <p>{contactPerson}</p>
                {contactEmail && <p>{contactEmail}</p>}
                {contactPhoneNumber && <p>{contactPhoneNumber}</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventBasicInfo;
