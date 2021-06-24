import * as Sentry from '@sentry/browser';
import { saveAs } from 'file-saver';
import { Button, IconCalendar } from 'hds-react';
import { createEvent, EventAttributes } from 'ics';
import { useTranslation } from 'next-i18next';
import React from 'react';

import {
  OccurrenceFieldsFragment,
  EventFieldsFragment,
  usePlaceQuery,
} from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
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
  const { t } = useTranslation();
  const locale = useLocale();
  const placeId = occurrence.placeId || event.location?.id || '';

  const { data, loading } = usePlaceQuery({
    variables: { id: placeId },
  });

  const { streetAddress, addressLocality, name: locationName } = getPlaceFields(
    data?.place,
    locale
  );

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
      iconLeft={<IconCalendar />}
      variant="supplementary"
    >
      {t('event:occurrenceList.downloadToCalendar')}
    </Button>
  ) : null;
};

export default CalendarButton;
