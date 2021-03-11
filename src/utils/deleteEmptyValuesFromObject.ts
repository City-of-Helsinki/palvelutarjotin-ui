import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

type QueryObject = Record<string, string | string[] | null | undefined>;

const deleteEmptyValuesFromObject = (
  obj: QueryObject
): Record<string, string | string[]> => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    // If value is null, undefined or empty object/array, don't append
    if (isNil(value) || isEmpty(value)) return acc;
    return { ...acc, [key]: value };
  }, {});
};

export default deleteEmptyValuesFromObject;
