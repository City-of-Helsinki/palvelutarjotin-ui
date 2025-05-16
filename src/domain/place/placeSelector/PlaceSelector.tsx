import uniqBy from 'lodash/uniqBy';
import React from 'react';

import PlaceText from '..//placeText/PlaceText';
import MultiSelectDropdown, {
  MultiselectDropdownProps,
} from '../../../common/components/multiSelectDropdown/MultiSelectDropdown';
import type { Option } from '../../../common/components/multiSelectDropdown/MultiSelectDropdown';
import { usePlacesQuery } from '../../../generated/graphql';
import useDebounce from '../../../hooks/useDebounce';
import useLocale from '../../../hooks/useLocale';
import getLocalisedString from '../../../utils/getLocalisedString';
import useFetchPlacesByIds from '../../events/eventSearchForm/useFetchPlacesByIds';

const DEFAULT_DATA_SOURCE = 'tprek';
const DEFAULT_PAGE_SIZE = 10;

type Props = Omit<MultiselectDropdownProps, 'options'>;

/**
 * Provides options for the MultiSelectDropdown based on a search query.
 */
const usePlacesSearchQueryOptions = (searchValue: string): Option[] => {
  const locale = useLocale();
  const { data } = usePlacesQuery({
    skip: !searchValue,
    variables: {
      dataSource: DEFAULT_DATA_SOURCE,
      pageSize: DEFAULT_PAGE_SIZE,
      text: searchValue,
    },
  });

  const placeOptions = React.useMemo(() => {
    const placesData = data?.places?.data;
    if (!placesData) {
      return [];
    }
    return placesData
      .map(
        (place): Option => ({
          text: getLocalisedString(place.name ?? null, locale),
          value: place.id ?? '',
        })
      )
      .sort((a, b) => a.text.localeCompare(b.text));
  }, [locale, data?.places?.data]);

  return placeOptions;
};

/**
 * Provides options for the MultiSelectDropdown based on selected place IDs.
 */
const useSelectedPlacesOptions = ({
  selectedPlacesIds,
}: {
  selectedPlacesIds: string[];
}): Option[] => {
  const locale = useLocale();
  const { places: selectedPlaces } = useFetchPlacesByIds(selectedPlacesIds);

  const selectedPlacesOptions = React.useMemo(() => {
    if (!selectedPlaces) return [];
    return selectedPlaces.map(
      (place): Option => ({
        text: getLocalisedString(place.name ?? null, locale),
        value: place.id ?? '',
      })
    );
  }, [locale, selectedPlaces]);

  return selectedPlacesOptions;
};

/**
 * A specialized MultiSelectDropdown component for selecting places.
 *
 * Fetches place options based on search input and selected values, and displays place names using PlaceText.
 */
const PlaceSelector: React.FC<Props> = ({
  inputValue,
  setInputValue,
  ...props
}) => {
  const { value, fixedOptions } = props;

  const [internalInputValue, setInternalInputValue] = React.useState('');
  const input = inputValue !== undefined ? inputValue : internalInputValue;
  const searchValue = useDebounce(input, 300);

  // The options that are listed after a search for options has been made
  const optionsFilteredBySearch = usePlacesSearchQueryOptions(searchValue);

  // Fixed options are always visible (e.g remote, reservable)
  const fixedOptionsIds = React.useMemo(
    () => fixedOptions?.map((option) => option.value) ?? [],
    [fixedOptions]
  );

  // Selected places ids should not include the fixed ids or they are duplicated
  const selectedPlacesIds = React.useMemo(() => {
    return value.filter((pid) => !fixedOptionsIds.includes(pid));
  }, [value, fixedOptionsIds]);

  // Query places names for selected ids and make them options
  const selectedOptions = useSelectedPlacesOptions({
    selectedPlacesIds,
  });

  // Remove duplicates, because search result can contain some of the selected items
  const options = React.useMemo(
    () => uniqBy([...optionsFilteredBySearch, ...selectedOptions], 'value'),
    [optionsFilteredBySearch, selectedOptions]
  );

  const renderOptionText = (id: string) => <PlaceText placeId={id} />;

  return (
    <MultiSelectDropdown
      {...props}
      inputValue={input}
      options={options}
      renderOptionText={renderOptionText}
      setInputValue={setInputValue ?? setInternalInputValue}
      filterByInput={false}
    />
  );
};

export default PlaceSelector;
