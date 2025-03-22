import { VenueQuery, VenueFieldsFragment } from '../../generated/graphql';
import { Language } from '../../types';

export const getVenueDescription = (
  venueData: VenueQuery | undefined | null,
  selectedLanguage: Language
): string =>
  venueData?.venue?.translations.find(
    (t) => t.languageCode === selectedLanguage.toUpperCase()
  )?.description || '';

export const getVenueFields = (
  venue: VenueFieldsFragment | undefined | null
) => {
  return {
    hasClothingStorage: venue?.hasClothingStorage,
    hasSnackEatingPlace: venue?.hasSnackEatingPlace,
    outdoorActivity: venue?.outdoorActivity,
    hasToiletNearby: venue?.hasToiletNearby,
    hasAreaForGroupWork: venue?.hasAreaForGroupWork,
    hasIndoorPlayingArea: venue?.hasIndoorPlayingArea,
    hasOutdoorPlayingArea: venue?.hasOutdoorPlayingArea,
  };
};
