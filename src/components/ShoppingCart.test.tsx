import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ShoppingCart from "./ShoppingCart";

function getCartTotal(): number {
  const raw = screen.getByTestId("cart-total").textContent ?? "";
  const numeric = raw.replace(/[^0-9.,-]/g, "");
  const normalized = numeric.replace(",", ".");
  return Number(normalized);
}

describe("ShoppingCart", () => {
  test("el carrito inicia vacio", () => {
    render(<ShoppingCart />);

    expect(screen.getByRole("status")).toHaveTextContent(/carrito esta vacio/i);
    expect(getCartTotal()).toBeCloseTo(0);
  });

  test("al agregar un producto aumenta el total", async () => {
    const user = userEvent.setup();
    render(<ShoppingCart />);

    const addButtons = screen.getAllByRole("button", { name: /agregar al carrito/i });
    await user.click(addButtons[0]);

    expect(getCartTotal()).toBeCloseTo(8.5, 2);
  });

  test("eliminar un producto actualiza el total", async () => {
    const user = userEvent.setup();
    render(<ShoppingCart />);

    const addButtons = screen.getAllByRole("button", { name: /agregar al carrito/i });
    await user.click(addButtons[0]);

    await user.click(screen.getByRole("button", { name: /eliminar/i }));

    expect(getCartTotal()).toBeCloseTo(0, 2);
    expect(screen.getByRole("status")).toHaveTextContent(/carrito esta vacio/i);
  });

  test("calcula el total correctamente con multiples articulos", async () => {
    const user = userEvent.setup();
    render(<ShoppingCart />);

    const addButtons = screen.getAllByRole("button", { name: /agregar al carrito/i });

    await user.click(addButtons[0]);
    await user.click(addButtons[0]);
    await user.click(addButtons[1]);

    expect(getCartTotal()).toBeCloseTo(22.25, 2);
  });
});
