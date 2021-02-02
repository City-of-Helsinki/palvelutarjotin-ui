type NestedObject =
  | null
  | undefined
  | string
  | number
  | boolean
  | { [property: string]: NestedObject }
  | NestedObject[];

// eslint-disable-next-line max-len
// taken from here: https://stackoverflow.com/questions/47062922/how-to-get-all-keys-with-values-from-nested-objects/47063174
// Used to get all key paths of object
const keyify = (obj: Record<string, NestedObject>, prefix = ''): string[] => {
  return Object.keys(obj).reduce<string[]>((res, el) => {
    const value = obj[el];
    if (Array.isArray(value)) {
      return res;
    } else if (typeof value === 'object' && value !== null) {
      return [...res, ...keyify(value, prefix + el + '.')];
    }
    return [...res, prefix + el];
  }, []);
};

export default keyify;
