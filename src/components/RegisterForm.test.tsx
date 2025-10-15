import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegisterForm from "./RegisterForm";

describe("Componente RegisterForm", () => {
  it("debe iniciar con el botón de registro deshabilitado", () => {
    render(<RegisterForm />);

    const button = screen.getByRole("button", { name: /registrar/i });
    expect(button).toBeDisabled();
  });

  it("activa el botón cuando se completan los campos requeridos", async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    const nameInput = screen.getByLabelText(/nombre/i);
    const emailInput = screen.getByLabelText(/correo electrónico/i);

    await user.type(nameInput, "Carla");
    await user.type(emailInput, "carla@example.com");

    expect(screen.getByRole("button", { name: /registrar/i })).toBeEnabled();
  });

  it("envía el formulario, muestra un mensaje de éxito y reinicia los campos", async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    const nameInput = screen.getByLabelText(/nombre/i) as HTMLInputElement;
    const emailInput = screen.getByLabelText(/correo electrónico/i) as HTMLInputElement;
    const submitBtn = screen.getByRole("button", { name: /registrar/i });

    await user.type(nameInput, "Pedro");
    await user.type(emailInput, "pedro@example.com");
    await user.click(submitBtn);

    // Verifica mensaje de confirmación
    expect(screen.getByRole("status")).toHaveTextContent(/registro completado para pedro/i);

    // Verifica que los inputs se limpien
    expect(nameInput.value).toBe("");
    expect(emailInput.value).toBe("");

    // Botón vuelve a deshabilitarse
    expect(submitBtn).toBeDisabled();
  });
});
