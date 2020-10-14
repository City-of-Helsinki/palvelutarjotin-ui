// add "//" to the beginning of the url if protocol is missing.
const addUrlSlashes = (url: string): string => {
  const protocolRegex = /^((https?:\/\/)|(\/\/))/i;
  const urlIsMissingProtocol = !protocolRegex.test(url);

  if (urlIsMissingProtocol) {
    return `//${url}`;
  }
  return url;
};

export default addUrlSlashes;
