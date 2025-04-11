import React from 'react';

import PlaceText from '..//placeText/PlaceText';
import MultiSelectDropdown, {
  MultiselectDropdownProps,
} from '../../../common/components/multiSelectDropdown/MultiSelectDropdown';
import { usePlacesQuery } from '../../../generated/graphql';
import useDebounce from '../../../hooks/useDebounce';
import useLocale from '../../../hooks/useLocale';
import getLocalisedString from '../../../utils/getLocalisedString';

type Props = Omit<MultiselectDropdownProps, 'options'>;

const PlaceSelector: React.FC<Props> = ({
  inputValue,
  setInputValue,
  ...props
}) => {
  const locale = useLocale();

  const [internalInputValue, setInternalInputValue] = React.useState('');
  const input = inputValue !== undefined ? inputValue : internalInputValue;
  const searchValue = useDebounce(input, 300);

  const { data: placesData } = usePlacesQuery({
    skip: !searchValue,
    variables: {
      dataSource: 'tprek',
      pageSize: 10,
      text: searchValue,
    },
  });

  const placeOptions = React.useMemo(() => {
    return (
      placesData?.places?.data
        .map((place) => ({
          text: getLocalisedString(place.name || {}, locale),
          value: place.id || '',
        }))
        .sort((a, b) => (a.text > b.text ? 1 : -1)) || []
    );
  }, [locale, placesData?.places?.data]);

  const renderOptionText = (id: string) => <PlaceText placeId={id} />;

  return (
    <MultiSelectDropdown
      {...props}
      inputValue={input}
      options={placeOptions}
      renderOptionText={renderOptionText}
      setInputValue={setInputValue || setInternalInputValue}
    />
  );
};

export default PlaceSelector;
