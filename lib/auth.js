"use client";

/* Lightweight client-side auth gate for the demo.
   - "Remember me" persists the session to localStorage (survives browser restarts).
   - Otherwise the session lives in sessionStorage, so a fresh tab / new visitor
     always lands on the login screen first — making it feel like a real system.
   No real credentials are checked; any sign-in succeeds. */
const KEY = "eos-auth";
const USER_KEY = "eos-user";

export function setAuth(remember, email) {
  try {
    const store = remember ? localStorage : sessionStorage;
    store.setItem(KEY, "1");
    if (email) store.setItem(USER_KEY, email);
    // clear the other store so state is unambiguous
    (remember ? sessionStorage : localStorage).removeItem(KEY);
  } catch {}
}

export function isAuthed() {
  try {
    return localStorage.getItem(KEY) === "1" || sessionStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

export function currentUser() {
  try {
    return localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY) || null;
  } catch {
    return null;
  }
}

export function clearAuth() {
  try {
    localStorage.removeItem(KEY);
    sessionStorage.removeItem(KEY);
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(USER_KEY);
  } catch {}
}
