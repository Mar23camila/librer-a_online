import { useState } from "react";
import * as api from "../../api/apiClient";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../context/ToastContext";
import FormField, { inputClass } from "../common/FormField";

const initialForm = { nombre: "", email: "", password: "", telefono: "" };

export default function CreateAdmin() {
  const { token } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function validate() {
    const errs = {};
    if (!form.nombre.trim()) errs.nombre = "Ingresa el nombre completo.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "Ingresa un email válido.";
    if (form.password.length < 6) errs.password = "Mínimo 6 caracteres.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");
    if (!validate()) return;
    setLoading(true);
    try {
      const admin = await api.registerAdmin(form, token);
      toast.success(`Administrador "${admin.nombre}" creado con éxito.`);
      setForm(initialForm);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-parchment">Crear administrador</h1>
        <p className="mt-1 text-sm text-muted">Registra una nueva cuenta con permisos de administrador.</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex max-w-lg flex-col gap-4 rounded-xl border border-line bg-surface p-6">
        <FormField label="Nombre completo" error={errors.nombre}>
          <input className={inputClass} value={form.nombre} onChange={update("nombre")} placeholder="Nombre del administrador" />
        </FormField>
        <FormField label="Email" error={errors.email}>
          <input type="email" className={inputClass} value={form.email} onChange={update("email")} placeholder="admin@paginasvioleta.com" />
        </FormField>
        <FormField label="Contraseña" error={errors.password}>
          <input type="password" className={inputClass} value={form.password} onChange={update("password")} placeholder="Mínimo 6 caracteres" />
        </FormField>
        <FormField label="Teléfono (opcional)">
          <input className={inputClass} value={form.telefono} onChange={update("telefono")} placeholder="300 000 0000" />
        </FormField>

        {formError && (
          <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">{formError}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-1 rounded-lg bg-violet-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Creando…" : "Crear administrador"}
        </button>
      </form>
    </div>
  );
}
