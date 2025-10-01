import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegisterForm from "./RegisterForm";

describe("RegisterForm", () => {
  test("el boton inicia deshabilitado cuando faltan datos", () => {
    render(<RegisterForm />);

    expect(screen.getByRole("button", { name: /registrar/i })).toBeDisabled();
  });

  test("habilita el boton cuando el formulario es valido", async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    await user.type(screen.getByLabelText(/nombre/i), "Ana");
    await user.type(screen.getByLabelText(/email/i), "ana@example.com");

    expect(screen.getByRole("button", { name: /registrar/i })).toBeEnabled();
  });

  test("al enviar limpia el formulario y muestra confirmacion", async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    const nameInput = screen.getByLabelText(/nombre/i) as HTMLInputElement;
    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    const submitButton = screen.getByRole("button", { name: /registrar/i });

    await user.type(nameInput, "Luis");
    await user.type(emailInput, "luis@example.com");
    await user.click(submitButton);

    expect(screen.getByRole("status")).toHaveTextContent(/registro completado para luis/i);
    expect(nameInput.value).toBe("");
    expect(emailInput.value).toBe("");
    expect(submitButton).toBeDisabled();
  });
});
