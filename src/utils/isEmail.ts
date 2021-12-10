const isEmail = (url: string): boolean => {
  return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(url);
};

export default isEmail;
