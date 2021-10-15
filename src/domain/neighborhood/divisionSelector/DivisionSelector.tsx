import React from 'react';

import MultiSelectDropdown, {
  MultiselectDropdownProps,
} from '../../../common/components/multiSelectDropdown/MultiSelectDropdown';
import useDivisionOptions from '../../../hooks/useDivisionOptions';

type Props = Omit<MultiselectDropdownProps, 'options'>;

const DivisionSelector: React.FC<Props> = ({
  inputValue,
  setInputValue,
  ...props
}) => {
  const [internalInputValue, setInternalInputValue] = React.useState('');
  const input = inputValue !== undefined ? inputValue : internalInputValue;
  const divisionOptions = useDivisionOptions();

  return (
    <MultiSelectDropdown
      {...props}
      inputValue={input}
      options={divisionOptions}
      setInputValue={setInputValue || setInternalInputValue}
    />
  );
};

export default DivisionSelector;
