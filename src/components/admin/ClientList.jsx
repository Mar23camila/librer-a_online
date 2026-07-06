import { useEffect, useState } from "react";
import * as api from "../../api/apiClient";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../context/ToastContext";
import { formatDate } from "../../utils/helpers";
import Spinner from "../common/Spinner";

export default function ClientList() {
  const { token } = useAuth();
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    api
      .getUsers(token)
      .then((data) => active && setUsers(data))
      .catch(() => toast.error("No se pudieron cargar los usuarios."))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const clientes = users.filter((u) => u.role === "cliente");

  if (loading) return <Spinner full label="Cargando clientes…" />;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-parchment">Clientes registrados</h1>
        <p className="mt-1 text-sm text-muted">{clientes.length} cliente(s) en total.</p>
      </div>

      {clientes.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line py-16 text-center text-muted">
          Aún no hay clientes registrados.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-line bg-surface">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-line text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Nombre</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Teléfono</th>
                <th className="px-4 py-3 font-medium">Dirección</th>
                <th className="px-4 py-3 font-medium">Registrado</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((c) => (
                <tr key={c.id} className="border-b border-line/60 last:border-0">
                  <td className="px-4 py-3 font-medium text-parchment">{c.nombre}</td>
                  <td className="px-4 py-3 text-muted">{c.email}</td>
                  <td className="px-4 py-3 text-muted">{c.telefono || "—"}</td>
                  <td className="px-4 py-3 text-muted">{c.direccion || "—"}</td>
                  <td className="px-4 py-3 text-muted">{formatDate(c.creadoEn)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
