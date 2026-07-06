import { useEffect, useRef, useState } from "react";

const MAX_SIZE = 2 * 1024 * 1024; // 2MB

export default function ImageUpload({ value, onChange, label, error, hint }) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(value || null);
  const [localError, setLocalError] = useState("");

  // Sincronizar preview cuando el value prop cambia externamente
  useEffect(() => {
    setPreview(value || null);
  }, [value]);

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setLocalError("");

    if (!file.type.startsWith("image/")) {
      setLocalError("Solo se permiten imágenes (JPG, PNG, WebP).");
      return;
    }

    if (file.size > MAX_SIZE) {
      setLocalError("La imagen no debe superar los 2 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result;
      setPreview(dataUrl);
      onChange(dataUrl);
    };
    reader.readAsDataURL(file);
  }

  function handleRemove() {
    setPreview(null);
    onChange("");
    if (inputRef.current) inputRef.current.value = "";
  }

  function handleUrlInput(e) {
    const url = e.target.value;
    // Si el usuario escribe manualmente, actualizamos el preview
    if (url) {
      setPreview(url);
    } else {
      setPreview(null);
    }
    onChange(url);
  }

  const showError = error || localError;
  const isBase64 = typeof preview === "string" && preview.startsWith("data:");

  return (
    <div>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-parchment">{label}</label>
      )}

      <div className="flex items-start gap-4">
        {preview ? (
          <div className="relative h-24 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-line bg-surface-2">
            <img
              src={preview}
              alt="Vista previa"
              className="h-full w-full object-cover"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.parentElement.classList.add("hidden");
              }}
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] text-white hover:bg-red-500"
              aria-label="Eliminar imagen"
            >
              ✕
            </button>
          </div>
        ) : (
          <div className="flex h-24 w-16 flex-shrink-0 items-center justify-center rounded-lg border border-dashed border-line bg-surface-2 text-muted">
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="m21 15-5-5L5 21" />
            </svg>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="rounded-lg border border-line bg-surface px-3 py-1.5 text-sm text-muted transition-colors hover:bg-surface-2 hover:text-parchment"
          >
            {preview ? "Cambiar imagen" : "Seleccionar imagen"}
          </button>
          <span className="text-xs text-muted">PNG, JPG o WebP · Máx 2 MB</span>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
        aria-hidden="true"
      />

      {/* Input de URL solo cuando NO hay imagen subida por archivo */}
      {!isBase64 && (
        <input
          type="text"
          value={preview || ""}
          onChange={handleUrlInput}
          placeholder="https://… (opcional, URL externa)"
          className="mt-3 w-full rounded-lg border border-line bg-surface px-3.5 py-2.5 text-sm text-parchment placeholder:text-muted/70 outline-none transition-colors focus:border-violet-500 focus:ring-2 focus:ring-violet-600/30"
        />
      )}

      {showError && (
        <p className="mt-1 text-xs text-red-300">{showError}</p>
      )}

      {!showError && hint && (
        <p className="mt-1 text-xs text-muted">{hint}</p>
      )}
    </div>
  );
}
