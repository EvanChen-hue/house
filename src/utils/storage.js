const TOKEN_KEY = "hk_admin_token";
const CREDS_KEY = "hk_admin_login_creds_v1";

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function getLoginCreds() {
  const data = storageGet(CREDS_KEY);
  if (!data || typeof data !== "object") return [];
  const items = Array.isArray(data.items) ? data.items : [];
  return items
    .filter((x) => x && typeof x.account === "string" && x.account.trim())
    .sort((a, b) => (b.lastAt || 0) - (a.lastAt || 0))
    .slice(0, 10);
}

export function saveLoginCred(account, password, { rememberPassword = true } = {}) {
  const now = Date.now();
  const trimmed = String(account || "").trim();
  if (!trimmed) return;

  const existing = storageGet(CREDS_KEY);
  const items = Array.isArray(existing?.items) ? existing.items : [];

  const next = items.filter((x) => x?.account !== trimmed);
  next.unshift({
    account: trimmed,
    password: rememberPassword ? String(password || "") : "",
    rememberPassword: Boolean(rememberPassword),
    lastAt: now,
  });

  storageSet(CREDS_KEY, { items: next.slice(0, 10) });
}

export function storageGet(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function storageSet(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
