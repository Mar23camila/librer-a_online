import { estadoStyles } from "../../utils/helpers";

export default function StatusBadge({ estado }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${estadoStyles(estado)}`}>
      {estado}
    </span>
  );
}
