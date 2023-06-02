import { IconInfoCircle, IconFaceSmile } from 'hds-react';
import NextLink from 'next/link';
import { useTranslation } from 'next-i18next';
import React from 'react';

import styles from './eventBasicInfo.module.scss';
import EventCategorisation from './EventCategorisation';
import KeywordsList from '../../../common/components/keyword/KeywordsList';
import TextWithHTMLOrLineBreaks from '../../../common/components/textWithHTMLOrLineBreaks/TextWithHTMLOrLineBreaks';
import { EventFieldsFragment } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import IconTicket from '../../../icons/IconTicket';
import addUrlSlashes from '../../../utils/addUrlSlashes';
import { ROUTES } from '../../app/routes/constants';
import { getEventFields } from '../utils';

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
    keywords,
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
        {keywords && <KeywordsList keywords={keywords} />}
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
            <a
              className={styles.infoLink}
              href={addUrlSlashes(infoUrl)}
              target="_blank"
              rel="noreferrer"
            >
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
  const organisationSearchUrl = `${ROUTES.EVENTS_SEARCH}/?organisation=${organisationId}`;
  return (
    <div>
      <p className={styles.organisation}>{organisation}</p>
      <p className={styles.organisationLink}>
        <NextLink legacyBehavior href={organisationSearchUrl} passHref>
          {t('event:organisation.showAllOrganisationEvents')}
        </NextLink>
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
