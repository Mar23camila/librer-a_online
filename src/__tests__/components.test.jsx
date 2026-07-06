import { describe, it, expect } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import StatusBadge from "../components/common/StatusBadge";
import Spinner from "../components/common/Spinner";
import FormField from "../components/common/FormField";
import Pagination from "../components/common/Pagination";

// --- StatusBadge ---
describe("StatusBadge", () => {
  it("renderiza con el texto del estado", () => {
    render(<StatusBadge estado="Aprobado" />);
    expect(screen.getByText("Aprobado")).toBeTruthy();
  });

  it("renderiza todos los estados sin errores", () => {
    const estados = ["Pendiente", "Aprobado", "Rechazado", "Enviado", "Entregado"];
    estados.forEach((estado) => {
      const { unmount } = render(<StatusBadge estado={estado} />);
      expect(screen.getByText(estado)).toBeTruthy();
      unmount();
    });
  });
});

// --- Spinner ---
describe("Spinner", () => {
  it("renderiza con label", () => {
    render(<Spinner label="Cargando…" />);
    expect(screen.getByText("Cargando…")).toBeTruthy();
  });

  it("no renderiza label si no se provee", () => {
    const { container } = render(<Spinner />);
    const statusEl = container.querySelector('[role="status"]');
    expect(statusEl).not.toBeNull();
  });

  it("aplica clase 'full' cuando prop full es true", () => {
    const { container } = render(<Spinner full />);
    const wrapper = container.firstChild;
    expect(wrapper.className).toContain("min-h");
  });
});

// --- FormField ---
describe("FormField", () => {
  it("renderiza label y children", () => {
    render(
      <FormField label="Email">
        <input data-testid="email-input" />
      </FormField>
    );
    expect(screen.getByText("Email")).toBeTruthy();
    expect(screen.getByTestId("email-input")).toBeTruthy();
  });

  it("renderiza mensaje de error", () => {
    render(
      <FormField label="Email" error="Email inválido">
        <input />
      </FormField>
    );
    expect(screen.getByText("Email inválido")).toBeTruthy();
  });

  it("renderiza hint cuando no hay error", () => {
    render(
      <FormField label="Email" hint="Ingresa tu correo">
        <input />
      </FormField>
    );
    expect(screen.getByText("Ingresa tu correo")).toBeTruthy();
  });
});

// --- Pagination ---
describe("Pagination", () => {
  it("no renderiza cuando totalPages <= 1", () => {
    const { container } = render(
      <Pagination page={1} totalPages={1} total={5} start={0} end={5} onPageChange={() => {}} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("renderiza controles cuando hay varias páginas", () => {
    render(
      <Pagination page={1} totalPages={3} total={25} start={0} end={8} onPageChange={() => {}} />
    );
    expect(screen.getByText("Anterior")).toBeTruthy();
    expect(screen.getByText("Siguiente")).toBeTruthy();
    expect(screen.getByText("1")).toBeTruthy();
    expect(screen.getByText("2")).toBeTruthy();
    expect(screen.getByText("3")).toBeTruthy();
  });

  it("deshabilita Anterior en página 1", () => {
    render(
      <Pagination page={1} totalPages={3} total={25} start={0} end={8} onPageChange={() => {}} />
    );
    expect(screen.getByText("Anterior").disabled).toBe(true);
  });

  it("deshabilita Siguiente en última página", () => {
    render(
      <Pagination page={3} totalPages={3} total={25} start={0} end={8} onPageChange={() => {}} />
    );
    expect(screen.getByText("Siguiente").disabled).toBe(true);
  });

  it("muestra rango correcto de items", () => {
    render(
      <Pagination page={1} totalPages={3} total={25} start={0} end={8} onPageChange={() => {}} />
    );
    const text = screen.getByText(/Mostrando/);
    expect(text.textContent).toContain("1–8 de 25");
  });
});