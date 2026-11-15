// Helpers d'images : les photos Pexels sont servies via leur CDN avec une largeur adaptée.
export function px(id: number, w = 900) {
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;
}

export function resize(url: string, w: number) {
  if (!url) return url;
  if (url.includes("images.pexels.com")) {
    if (/([?&])w=\d+/.test(url)) return url.replace(/([?&])w=\d+/, `$1w=${w}`);
    return url + (url.includes("?") ? "&" : "?") + `auto=compress&w=${w}`;
  }
  return url;
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}
