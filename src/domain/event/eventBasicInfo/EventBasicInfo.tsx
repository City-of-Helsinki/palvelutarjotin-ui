import { IconInfoCircle, IconFaceSmile } from 'hds-react';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import React from 'react';

import TextWithHTMLOrLineBreaks from '../../../common/components/textWithHTMLOrLineBreaks/TextWithHTMLOrLineBreaks';
import { EventFieldsFragment } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
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
    organisation,
    organisationId,
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
        <TextWithHTMLOrLineBreaks
          text={description}
          className={styles.description}
        />
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
        {organisation && organisationId && (
          <div>
            <IconFaceSmile />
            <OrganisationInfo
              organisation={organisation}
              organisationId={organisationId}
              contactEmail={contactEmail}
              contactPerson={contactPerson}
              contactPhoneNumber={contactPhoneNumber}
            />
          </div>
        )}
      </div>
    </section>
  );
};

const OrganisationInfo: React.FC<{
  organisationId: string;
  organisation: string;
  contactEmail?: string;
  contactPerson?: string;
  contactPhoneNumber?: string;
}> = ({
  organisation,
  organisationId,
  contactEmail,
  contactPerson,
  contactPhoneNumber,
}) => {
  const { t } = useTranslation();
  const organisationSearchUrl = `/?organisation=${organisationId}`;
  return (
    <div>
      <p className={styles.organisation}>{organisation}</p>
      <p className={styles.organisationLink}>
        <Link href={organisationSearchUrl} passHref>
          {t('event:organisation.showAllOrganisationEvents')}
        </Link>
      </p>
      {contactPerson && (
        <div className={styles.contactInfo}>
          <p>{t('event:contactPerson')}</p>
          <p>{contactPerson}</p>
          {contactEmail && <p>{contactEmail}</p>}
          {contactPhoneNumber && <p>{contactPhoneNumber}</p>}
        </div>
      )}
    </div>
  );
};

export default EventBasicInfo;
