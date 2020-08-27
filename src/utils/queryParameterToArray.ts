export const queryParameterToArray = <T>(value?: T | T[]): T[] => {
  if (Array.isArray(value)) {
    return value;
  }

  if (value) {
    return [value];
  }

  return [];
};
