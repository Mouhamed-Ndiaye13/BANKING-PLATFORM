const BASE_URL = "https://banking-backend-rtsx.onrender.com/admin";

export const api = async (endpoint, method = "GET", token, body = null) => {
  const res = await fetch(BASE_URL + endpoint, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : null,
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("API ERROR:", text);
    throw new Error(text);
  }

  return res.json();
};
