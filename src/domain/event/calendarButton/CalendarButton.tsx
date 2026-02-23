import * as Sentry from '@sentry/nextjs';
import { saveAs } from 'file-saver';
import { Button, ButtonVariant, IconCalendar } from 'hds-react';
import { createEvent, EventAttributes } from 'ics';
import { useTranslation } from 'next-i18next';
import React from 'react';

import {
  OccurrenceFieldsFragment,
  EventFieldsFragment,
  usePlaceQuery,
} from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import type { I18nNamespace } from '../../../types';
import getDateArray from '../../../utils/getDateArray';
import getDomain from '../../../utils/getDomain';
import getLocalisedString from '../../../utils/getLocalisedString';
import { ROUTES } from '../../app/routes/constants';
import { getPlaceFields } from '../../place/utils';

interface CalendarButtonProps {
  event: EventFieldsFragment;
  occurrence: OccurrenceFieldsFragment;
}

const CalendarButton: React.FC<CalendarButtonProps> = ({
  event,
  occurrence,
}) => {
  const { t } = useTranslation<I18nNamespace>();
  const locale = useLocale();
  const placeId = occurrence.placeId || event.location?.id || '';

  const { data, loading } = usePlaceQuery({
    variables: { id: placeId },
    skip: !placeId,
  });

  const {
    streetAddress,
    addressLocality,
    name: locationName,
  } = getPlaceFields(data?.place, locale);

  const downloadIcsFile = () => {
    if (event.id && occurrence.startTime) {
      const domain = getDomain();
      const icsEvent: EventAttributes = {
        description: t('event:info.textCalendarLinkDescription', {
          description: getLocalisedString(event.shortDescription || {}, locale),
          link: `${domain}/${locale}${ROUTES.EVENT_DETAILS.replace(
            ':id',
            event.id
          )}`,
        }),
        end: occurrence.endTime
          ? getDateArray(occurrence.endTime)
          : getDateArray(occurrence.startTime),
        location: [locationName, streetAddress, addressLocality]
          .filter((e) => e)
          .join(', '),
        productId: domain,
        start: getDateArray(occurrence.startTime),
        startOutputType: 'local',
        title: getLocalisedString(event.name || {}, locale),
      };
      createEvent(icsEvent, (error: Error | undefined, value: string) => {
        if (error) {
          Sentry.captureException(error);
        } else {
          const blob = new Blob([value], { type: 'text/calendar' });
          saveAs(blob, `event_${event.id?.replace(/:/g, '')}.ics`);
        }
      });
    }
  };

  return !loading ? (
    <Button
      onClick={downloadIcsFile}
      iconStart={<IconCalendar />}
      variant={ButtonVariant.Supplementary}
    >
      {t('event:occurrenceList.downloadToCalendar')}
    </Button>
  ) : null;
};

export default CalendarButton;
