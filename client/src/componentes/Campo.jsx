import { IconoError } from "./Iconos.jsx";

export default function Campo({ id, etiqueta, ayuda, error, ...props }) {
  const idAyuda = ayuda ? `${id}-ayuda` : undefined;
  const idError = error ? `${id}-error` : undefined;
  return (
    <div className="campo">
      <label htmlFor={id}>{etiqueta}</label>
      <input
        id={id}
        name={id}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={
          [idAyuda, idError].filter(Boolean).join(" ") || undefined
        }
        {...props}
      />
      {ayuda && (
        <p id={idAyuda} className="campo-ayuda">
          {ayuda}
        </p>
      )}
      {error && (
        <p id={idError} className="campo-error">
          <IconoError />
          {error}
        </p>
      )}
    </div>
  );
}
