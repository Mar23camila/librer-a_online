export default function Spinner({ label = "Cargando…", full = false }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 text-muted ${
        full ? "min-h-[50vh]" : "py-10"
      }`}
      role="status"
      aria-live="polite"
    >
      <div className="relative h-10 w-10">
        <span className="absolute inset-0 rounded-full border-2 border-line" />
        <span className="absolute inset-0 rounded-full border-2 border-t-violet-500 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
      </div>
      <p className="text-sm">{label}</p>
    </div>
  );
}
