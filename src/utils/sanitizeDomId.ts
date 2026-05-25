/**
 * Replace characters that are not safe for a DOM id with a dash.
 * Keeps only [a-zA-Z0-9_-].
 * e.g
 * "abc:123/def" => "abc-123-def"
 */
const sanitizeDomId = (value: string): string => {
  return value.replace(/[^a-zA-Z0-9_-]/g, '-');
};

export default sanitizeDomId;
