// helper utilities shared across the app

/**
 * Strips HTML tags from a string and returns plain text.
 *
 * @param html - the HTML string to sanitize
 * @returns text content or a fallback message
 */
export const stripHtml = (html?: string) => {
  if (!html) return "No description available";
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

// generic fetcher for SWR
export const fetcher = (url: string) => fetch(url).then((res) => res.json());
