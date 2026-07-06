import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../context/ToastContext";
import FormField, { inputClass } from "../common/FormField";

export default function Login() {
  const { login, loading } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");

  function validate() {
    const errs = {};
    if (!form.email.trim()) errs.email = "El email es obligatorio.";
    if (!form.password) errs.password = "La contraseña es obligatoria.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");
    if (!validate()) return;
    try {
      const user = await login(form.email.trim(), form.password);
      toast.success(`¡Bienvenido de nuevo, ${user.nombre.split(" ")[0]}!`);
      const from = location.state?.from?.pathname;
      navigate(from || (user.role === "admin" ? "/admin" : "/tienda"), { replace: true });
    } catch (err) {
      setFormError(err.message);
    }
  }

  function fillDemo(role) {
    if (role === "admin") {
      setForm({ email: "admin@paginasvioleta.com", password: "admin123" });
    } else {
      setForm({ email: "cliente@paginasvioleta.com", password: "cliente123" });
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 px-4 py-14 sm:px-0">
      <div>
        <h1 className="font-display text-3xl font-semibold text-parchment">Iniciar sesión</h1>
        <p className="mt-2 text-sm text-muted">
          Entra a tu cuenta para seguir explorando el catálogo, o al panel de administración.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 rounded-xl border border-line bg-surface p-6">
        <FormField label="Email" error={errors.email}>
          <input
            type="email"
            className={inputClass}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="tucorreo@ejemplo.com"
            autoComplete="email"
          />
        </FormField>

        <FormField label="Contraseña" error={errors.password}>
          <input
            type="password"
            className={inputClass}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="••••••••"
            autoComplete="current-password"
          />
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
          {loading ? "Ingresando…" : "Ingresar"}
        </button>

        <p className="text-center text-sm text-muted">
          ¿No tienes cuenta?{" "}
          <Link to="/registro" className="font-medium text-lilac-300 hover:underline">
            Regístrate
          </Link>
        </p>
      </form>

      <div className="rounded-xl border border-dashed border-line p-4 text-xs text-muted">
        <p className="mb-2 font-medium text-parchment">Credenciales de prueba</p>
        <div className="flex flex-col gap-1.5">
          <button type="button" onClick={() => fillDemo("cliente")} className="text-left hover:text-lilac-300">
            👤 Cliente — cliente@paginasvioleta.com / cliente123
          </button>
          <button type="button" onClick={() => fillDemo("admin")} className="text-left hover:text-lilac-300">
            🛠️ Admin — admin@paginasvioleta.com / admin123
          </button>
        </div>
      </div>
    </div>
  );
}
