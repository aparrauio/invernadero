// Iconos SVG en línea (DESIGN.md: sin librerías de iconos).

export function IconoError() {
  return (
    <svg className="icono" viewBox="0 0 20 20" aria-hidden="true">
      <circle
        cx="10"
        cy="10"
        r="8"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M10 5.5v5.5M10 13.5v1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconoVisto() {
  return (
    <svg className="icono" viewBox="0 0 20 20" aria-hidden="true">
      <circle
        cx="10"
        cy="10"
        r="8"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M6.5 10.5l2.3 2.3 4.7-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
