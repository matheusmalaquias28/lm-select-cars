const EVENT = "lm:intro-done";

declare global {
  interface Window {
    __lmIntroDone?: boolean;
  }
}

export function markIntroDone() {
  window.__lmIntroDone = true;
  window.dispatchEvent(new Event(EVENT));
}

/** Executa `cb` quando o preloader terminar (ou já, se ele não vai rodar). */
export function onIntroDone(cb: () => void) {
  if (window.__lmIntroDone || document.documentElement.classList.contains("intro-seen")) {
    cb();
    return () => {};
  }
  window.addEventListener(EVENT, cb, { once: true });
  return () => window.removeEventListener(EVENT, cb);
}
