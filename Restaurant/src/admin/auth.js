import { ADMIN_EMAILS } from "./AdminEmails";

export const SESSION_KEY = "sessionEmail";

export function getSessionEmail() {
  try {
    return (localStorage.getItem(SESSION_KEY) || "").trim().toLowerCase();
  } catch {
    return "";
  }
}

export function setSessionEmail(email) {
  localStorage.setItem(SESSION_KEY, (email || "").trim().toLowerCase());
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function isAdminEmail(email) {
  return ADMIN_EMAILS.includes((email || "").trim().toLowerCase());
}

export function isAdminLoggedIn() {
  return isAdminEmail(getSessionEmail());
}