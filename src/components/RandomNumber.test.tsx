import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RandomNumber from "./RandomNumber";

// Extrae el valor numérico del mensaje accesible que muestra el componente.
function extractValueFromStatus(): number {
  const message = screen.getByRole("status").textContent ?? "";
  const numericMatch = message.match(/(\d+)/);
  if (!numericMatch) {
    throw new Error("No se encontro el numero en el mensaje de estado");
  }
  return Number(numericMatch[1]);
}

describe("RandomNumber", () => {
  test("muestra el numero despues de hacer clic", async () => {
    const user = userEvent.setup();
    render(<RandomNumber />);

    await user.click(screen.getByRole("button", { name: /generar numero/i }));

    expect(screen.getByRole("status")).toHaveTextContent(/Numero generado:/i);
  });

  test("el valor generado esta dentro del rango permitido", async () => {
    const user = userEvent.setup();
    render(<RandomNumber />);

    await user.click(screen.getByRole("button", { name: /generar numero/i }));
    const value = extractValueFromStatus();

    expect(value).toBeGreaterThanOrEqual(1);
    expect(value).toBeLessThanOrEqual(100);
  });

  // Confirma que consecutivas peticiones produzcan valores distintos para evitar repeticiones.
  test("cada clic produce un numero distinto", async () => {
    const user = userEvent.setup();
    render(<RandomNumber />);

    const button = screen.getByRole("button", { name: /generar numero/i });

    await user.click(button);
    const firstValue = extractValueFromStatus();

    await user.click(button);
    const secondValue = extractValueFromStatus();

    expect(secondValue).not.toBe(firstValue);
  });
});
