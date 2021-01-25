// eslint-disable-next-line max-len
// taken from here: https://stackoverflow.com/questions/47062922/how-to-get-all-keys-with-values-from-nested-objects/47063174
// Used to get all key paths of object
const keyify = (obj: any, prefix = ''): string[] =>
  Object.keys(obj).reduce<string[]>((res, el) => {
    if (Array.isArray(obj[el])) {
      return res;
    } else if (typeof obj[el] === 'object' && obj[el] !== null) {
      return [...res, ...keyify(obj[el], prefix + el + '.')];
    }
    return [...res, prefix + el];
  }, []);

export default keyify;
