// Whether entrance and scroll animations should run, and the html[data-motion]
// flag the CSS keys off. The head script in layout.tsx sets the flag before first
// paint, but if hydration fails React re-renders <html> from JSX and drops it.
// Netlify triggers exactly that by inserting a comment and whitespace into <head>.
// So client code asks here instead of reading the attribute, and this puts the
// attribute back whenever it has gone missing.

export function motionAllowed() {
  const allowed = window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
  document.documentElement.toggleAttribute("data-motion", allowed);
  return allowed;
}
