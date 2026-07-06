export default function FormField({ label, error, children, hint }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-parchment">{label}</span>
      {children}
      {hint && !error && <span className="mt-1 block text-xs text-muted">{hint}</span>}
      {error && <span className="mt-1 block text-xs text-red-400">{error}</span>}
    </label>
  );
}

export const inputClass =
  "w-full rounded-lg border border-line bg-surface px-3.5 py-2.5 text-sm text-parchment placeholder:text-muted/70 outline-none transition-colors focus:border-violet-500 focus:ring-2 focus:ring-violet-600/30";
