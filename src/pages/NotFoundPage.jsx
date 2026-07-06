import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-24 text-center">
      <span className="text-5xl">📚</span>
      <h1 className="font-display text-3xl font-semibold text-parchment">Página no encontrada</h1>
      <p className="text-muted">Parece que este capítulo no existe. Volvamos al índice.</p>
      <Link to="/" className="rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-500">
        Volver al inicio
      </Link>
    </div>
  );
}
