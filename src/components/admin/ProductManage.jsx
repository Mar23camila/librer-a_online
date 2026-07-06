import { useEffect, useState } from "react";
import * as api from "../../api/apiClient";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../context/ToastContext";
import { formatCOP } from "../../utils/helpers";
import FormField, { inputClass } from "../common/FormField";
import ImageUpload from "../common/ImageUpload";
import Spinner from "../common/Spinner";

const emptyForm = { titulo: "", autor: "", categoria: "", precio: "", stock: "", portada: "", descripcion: "" };

export default function ProductManage() {
  const { token } = useAuth();
  const toast = useToast();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  function loadBooks() {
    setLoading(true);
    return api
      .getProducts()
      .then(setBooks)
      .catch(() => toast.error("No se pudo cargar el catálogo."))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function startEdit(book) {
    setEditingId(book.id);
    setForm({
      titulo: book.titulo,
      autor: book.autor,
      categoria: book.categoria,
      precio: String(book.precio),
      stock: String(book.stock),
      portada: book.portada,
      descripcion: book.descripcion,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
    setErrors({});
  }

  function validate() {
    const errs = {};
    if (!form.titulo.trim()) errs.titulo = "Ingresa el título.";
    if (!form.autor.trim()) errs.autor = "Ingresa el autor.";
    if (!form.categoria.trim()) errs.categoria = "Ingresa la categoría.";
    if (!form.precio || Number(form.precio) <= 0) errs.precio = "Ingresa un precio válido.";
    if (form.stock === "" || Number(form.stock) < 0) errs.stock = "Ingresa un stock válido.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    const payload = {
      titulo: form.titulo.trim(),
      autor: form.autor.trim(),
      categoria: form.categoria.trim(),
      precio: Number(form.precio),
      stock: Number(form.stock),
      portada: form.portada.trim(),
      descripcion: form.descripcion.trim(),
    };
    try {
      if (editingId) {
        await api.updateProduct(editingId, payload, token);
        toast.success("Libro actualizado correctamente.");
      } else {
        await api.createProduct(payload, token);
        toast.success("Libro creado correctamente.");
      }
      resetForm();
      loadBooks();
    } catch (err) {
      toast.error(err.message || "No se pudo guardar el libro.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(book) {
    if (!confirm(`¿Eliminar "${book.titulo}" del catálogo?`)) return;
    try {
      await api.deleteProduct(book.id, token);
      toast.success("Libro eliminado.");
      if (editingId === book.id) resetForm();
      loadBooks();
    } catch (err) {
      toast.error(err.message || "No se pudo eliminar el libro.");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-parchment">Gestión de libros</h1>
        <p className="mt-1 text-sm text-muted">Crea, edita o elimina libros del catálogo (función extra de CRUD completo).</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="grid gap-4 rounded-xl border border-line bg-surface p-6 sm:grid-cols-2">
        <FormField label="Título" error={errors.titulo}>
          <input className={inputClass} value={form.titulo} onChange={update("titulo")} placeholder="Título del libro" />
        </FormField>
        <FormField label="Autor" error={errors.autor}>
          <input className={inputClass} value={form.autor} onChange={update("autor")} placeholder="Autor" />
        </FormField>
        <FormField label="Categoría" error={errors.categoria}>
          <input className={inputClass} value={form.categoria} onChange={update("categoria")} placeholder="Ej. Clásico, Romance…" />
        </FormField>
        <FormField label="Precio (COP)" error={errors.precio}>
          <input type="number" min="0" className={inputClass} value={form.precio} onChange={update("precio")} placeholder="50000" />
        </FormField>
        <FormField label="Stock" error={errors.stock}>
          <input type="number" min="0" className={inputClass} value={form.stock} onChange={update("stock")} placeholder="10" />
        </FormField>
        <div className="sm:col-span-2">
          <ImageUpload
            label="Imagen de portada"
            value={form.portada}
            onChange={(val) => setForm((f) => ({ ...f, portada: val }))}
            hint="Sube un archivo de imagen o pega una URL externa."
          />
        </div>
        <div className="sm:col-span-2">
          <FormField label="Descripción">
            <textarea
              className={`${inputClass} min-h-24 resize-y`}
              value={form.descripcion}
              onChange={update("descripcion")}
              placeholder="Breve descripción del libro"
            />
          </FormField>
        </div>

        <div className="flex gap-3 sm:col-span-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Guardando…" : editingId ? "Guardar cambios" : "Crear libro"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg border border-line px-5 py-2.5 text-sm font-semibold text-muted hover:text-parchment"
            >
              Cancelar edición
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <Spinner label="Cargando catálogo…" />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-line bg-surface">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-line text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Título</th>
                <th className="px-4 py-3 font-medium">Autor</th>
                <th className="px-4 py-3 font-medium">Precio</th>
                <th className="px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {books.map((b) => (
                <tr key={b.id} className="border-b border-line/60 last:border-0">
                  <td className="px-4 py-3 font-medium text-parchment">{b.titulo}</td>
                  <td className="px-4 py-3 text-muted">{b.autor}</td>
                  <td className="px-4 py-3 text-lilac-200">{formatCOP(b.precio)}</td>
                  <td className="px-4 py-3 text-muted">{b.stock}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => startEdit(b)} className="mr-3 font-medium text-lilac-300 hover:underline">
                      Editar
                    </button>
                    <button onClick={() => handleDelete(b)} className="font-medium text-red-400 hover:underline">
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
