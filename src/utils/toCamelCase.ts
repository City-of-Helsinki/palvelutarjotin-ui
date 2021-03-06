/**
 * Convert snake case string to camel case.
 * e.g
 * event_type => eventType
 * event_end_date => eventEndDate
 */
const toCamelCase = (snakecase: string): string => {
  return !!snakecase && snakecase.length
    ? snakecase[0].toLowerCase() +
        snakecase
          .substr(1)
          .toLowerCase()
          .replace(/(_[a-z, 0-9])/g, ($1) => $1.toUpperCase().replace('_', ''))
    : '';
};

export default toCamelCase;
