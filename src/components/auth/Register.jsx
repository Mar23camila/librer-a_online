import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../context/ToastContext";
import FormField, { inputClass } from "../common/FormField";

const initialForm = { nombre: "", email: "", password: "", confirmar: "", telefono: "", direccion: "" };

export default function Register() {
  const { register, loading } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function validate() {
    const errs = {};
    if (!form.nombre.trim()) errs.nombre = "Ingresa tu nombre completo.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "Ingresa un email válido.";
    if (form.password.length < 6) errs.password = "Mínimo 6 caracteres.";
    if (form.confirmar !== form.password) errs.confirmar = "Las contraseñas no coinciden.";
    if (!form.telefono.trim()) errs.telefono = "Ingresa un teléfono de contacto.";
    if (!form.direccion.trim()) errs.direccion = "Ingresa una dirección de envío.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");
    if (!validate()) return;
    try {
      const { confirmar, ...data } = form;
      const user = await register(data);
      toast.success(`¡Cuenta creada! Bienvenido/a, ${user.nombre.split(" ")[0]}.`);
      navigate("/tienda", { replace: true });
    } catch (err) {
      setFormError(err.message);
    }
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-6 px-4 py-14 sm:px-0">
      <div>
        <h1 className="font-display text-3xl font-semibold text-parchment">Crea tu cuenta</h1>
        <p className="mt-2 text-sm text-muted">
          Regístrate como cliente para comprar libros y hacer seguimiento a tus pedidos.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 rounded-xl border border-line bg-surface p-6">
        <FormField label="Nombre completo" error={errors.nombre}>
          <input className={inputClass} value={form.nombre} onChange={update("nombre")} placeholder="Ana Torres" autoComplete="name" />
        </FormField>

        <FormField label="Email" error={errors.email}>
          <input type="email" className={inputClass} value={form.email} onChange={update("email")} placeholder="tucorreo@ejemplo.com" autoComplete="email" />
        </FormField>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Contraseña" error={errors.password}>
            <input type="password" className={inputClass} value={form.password} onChange={update("password")} placeholder="Mínimo 6 caracteres" autoComplete="new-password" />
          </FormField>
          <FormField label="Confirmar contraseña" error={errors.confirmar}>
            <input type="password" className={inputClass} value={form.confirmar} onChange={update("confirmar")} placeholder="Repite tu contraseña" autoComplete="new-password" />
          </FormField>
        </div>

        <FormField label="Teléfono" error={errors.telefono}>
          <input className={inputClass} value={form.telefono} onChange={update("telefono")} placeholder="300 123 4567" autoComplete="tel" />
        </FormField>

        <FormField label="Dirección de envío" error={errors.direccion}>
          <input className={inputClass} value={form.direccion} onChange={update("direccion")} placeholder="Calle, número, ciudad" autoComplete="street-address" />
        </FormField>

        {formError && (
          <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {formError}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-1 rounded-lg bg-violet-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Creando cuenta…" : "Registrarme"}
        </button>

        <p className="text-center text-sm text-muted">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="font-medium text-lilac-300 hover:underline">
            Inicia sesión
          </Link>
        </p>
      </form>
    </div>
  );
}
