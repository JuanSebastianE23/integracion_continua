import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Survey from "./Survey";

describe("Componente Survey", () => {
  it("debería mostrar exactamente cinco opciones de calificación", () => {
    render(<Survey />);

    const opciones = screen.getAllByRole("radio");
    expect(opciones).toHaveLength(5);

    // Verificamos extremos (1 y 5 estrellas)
    expect(screen.getByRole("radio", { name: /1 estrella/i })).toBeVisible();
    expect(screen.getByRole("radio", { name: /5 estrellas/i })).toBeVisible();
  });

  it("marca la opción seleccionada al hacer clic", async () => {
    const user = userEvent.setup();
    render(<Survey />);

    const opcionTres = screen.getByRole("radio", { name: /3 estrellas/i });
    await user.click(opcionTres);

    expect(opcionTres).toBeChecked();
  });

  it("muestra un mensaje de agradecimiento con la puntuación elegida al enviar", async () => {
    const user = userEvent.setup();
    render(<Survey />);

    await user.click(screen.getByRole("radio", { name: /4 estrellas/i }));
    await user.click(screen.getByRole("button", { name: /enviar/i }));

    const mensaje = screen.getByRole("status");
    expect(mensaje).toHaveTextContent(/gracias por tu puntuacion: 4/i);
  });
});
