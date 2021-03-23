import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';
import omitBy from 'lodash/omitBy';

type QueryObject = Record<string, string | string[] | null | undefined>;

const deleteEmptyPropertiesFromObject = (
  obj: QueryObject
): Record<string, string | string[]> => {
  return omitBy(obj, (v) => isNil(v) || isEmpty(v)) as Record<
    string,
    string | string[]
  >;
};

export default deleteEmptyPropertiesFromObject;
