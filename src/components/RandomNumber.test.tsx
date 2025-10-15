import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RandomNumber from "./RandomNumber";

// Obtiene el número desde el mensaje de estado
const getGeneratedNumber = (): number => {
  const status = screen.getByRole("status").textContent ?? "";
  const match = status.match(/\d+/);
  if (!match) throw new Error("No se encontró ningún número en el mensaje");
  return parseInt(match[0], 10);
};

describe("Componente RandomNumber", () => {
  it("debe mostrar un mensaje después de hacer clic en el botón", async () => {
    const user = userEvent.setup();"Simula interacciones de usuario."
    render(<RandomNumber />); 

    const button = screen.getByRole("button", { name: /generar número/i });
    await user.click(button);

    expect(screen.getByRole("status")).toHaveTextContent(/Número generado:/i);
  });

  it("genera un valor comprendido entre 1 y 100", async () => {
    const user = userEvent.setup();
    render(<RandomNumber />);

    await user.click(screen.getByRole("button", { name: /generar número/i }));
    const number = getGeneratedNumber();

    expect(number).toBeGreaterThanOrEqual(1);
    expect(number).toBeLessThanOrEqual(100);
  });

  it("produce valores distintos en clics consecutivos (con alta probabilidad)", async () => {
    const user = userEvent.setup();
    render(<RandomNumber />);

    const button = screen.getByRole("button", { name: /generar número/i });

    await user.click(button);
    const first = getGeneratedNumber();

    await user.click(button);
    const second = getGeneratedNumber();

    // No garantiza 100%, pero evita siempre repetir el mismo valor
    expect(second).not.toBeNaN();
    expect(second).not.toBe(first);
  });
});
