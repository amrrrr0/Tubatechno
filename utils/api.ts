export const getApiUrl = (path: string = "") => {
  const host = typeof window !== "undefined" ? window.location.hostname : "localhost";
  return `http://${host}:5000${path}`;
};
