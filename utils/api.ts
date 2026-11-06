export const getApiUrl = (path: string = "") => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    const base = process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");
    return `${base}${path}`;
  }
  
  const host = typeof window !== "undefined" ? window.location.hostname : "localhost";
  if (host === "localhost" || host === "127.0.0.1") {
    return `http://${host}:5000${path}`;
  }
  
  // In production deployment, avoid mixed content (HTTP on HTTPS) or invalid port 5000
  return `https://${host}${path}`;
};
