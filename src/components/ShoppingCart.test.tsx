import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ShoppingCart from "./ShoppingCart";

// Utilidad para obtener el valor numérico del total
function readTotal(): number {
  const rawText = screen.getByTestId("cart-total").textContent ?? "";
  const numericOnly = rawText.replace(/[^0-9.,-]/g, "").replace(",", ".");
  return Number(numericOnly);
}

describe("Componente ShoppingCart", () => {
  it("debe iniciar mostrando el carrito vacío", () => {
    render(<ShoppingCart />);

    expect(screen.getByRole("status")).toHaveTextContent(/carrito esta vacio/i);
    expect(readTotal()).toBe(0);
  });

  it("incrementa el total al añadir un artículo", async () => {
    const user = userEvent.setup();
    render(<ShoppingCart />);

    const botones = screen.getAllByRole("button", { name: /agregar al carrito/i });
    await user.click(botones[0]);

    expect(readTotal()).toBeCloseTo(8.5, 2);
  });

  it("permite eliminar un producto y deja el carrito vacío otra vez", async () => {
    const user = userEvent.setup();
    render(<ShoppingCart />);

    const botones = screen.getAllByRole("button", { name: /agregar al carrito/i });
    await user.click(botones[0]);
    await user.click(screen.getByRole("button", { name: /eliminar/i }));

    expect(readTotal()).toBeCloseTo(0, 2);
    expect(screen.getByRole("status")).toHaveTextContent(/carrito esta vacio/i);
  });

  it("calcula correctamente el total con varios artículos distintos", async () => {
    const user = userEvent.setup();
    render(<ShoppingCart />);

    const botones = screen.getAllByRole("button", { name: /agregar al carrito/i });

    // 2 unidades del primero + 1 del segundo
    await user.click(botones[0]);
    await user.click(botones[0]);
    await user.click(botones[1]);

    expect(readTotal()).toBeCloseTo(22.25, 2);
  });
});
