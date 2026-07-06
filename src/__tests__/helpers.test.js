import { formatCOP, formatDate, estadoStyles, ESTADOS } from "../utils/helpers";

describe("formatCOP", () => {
  it("formatea valores numéricos a COP", () => {
    const result = formatCOP(50000);
    expect(result).toContain("$");
    expect(result).toContain("50");
  });

  it("maneja valor 0", () => {
    expect(formatCOP(0)).toContain("0");
  });

  it("maneja valores grandes", () => {
    const result = formatCOP(1000000);
    expect(result).toContain("$");
  });
});

describe("formatDate", () => {
  it("formatea una fecha ISO a string legible", () => {
    const iso = "2026-07-05T12:00:00.000Z";
    const result = formatDate(iso);
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(5);
  });

  it("lanza error con fecha inválida", () => {
    expect(() => formatDate("not-a-date")).toThrow();
  });
});

describe("ESTADOS", () => {
  it("contiene los 5 estados", () => {
    expect(ESTADOS).toEqual(["Pendiente", "Aprobado", "Rechazado", "Enviado", "Entregado"]);
  });
});

describe("estadoStyles", () => {
  it("retorna clases para Aprobado", () => {
    const classes = estadoStyles("Aprobado");
    expect(classes).toContain("emerald");
  });

  it("retorna clases para Rechazado", () => {
    const classes = estadoStyles("Rechazado");
    expect(classes).toContain("red");
  });

  it("retorna clases para Enviado", () => {
    const classes = estadoStyles("Enviado");
    expect(classes).toContain("sky");
  });

  it("retorna clases para Entregado", () => {
    const classes = estadoStyles("Entregado");
    expect(classes).toContain("lilac");
  });

  it("retorna clases por defecto para Pendiente", () => {
    const classes = estadoStyles("Pendiente");
    expect(classes).toContain("amber");
  });

  it("retorna clases por defecto para estado desconocido", () => {
    const classes = estadoStyles("Desconocido");
    expect(classes).toContain("amber");
  });
});