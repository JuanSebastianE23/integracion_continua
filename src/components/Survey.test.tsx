import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Survey from "./Survey";

// Suite que cubre el flujo principal del formulario de encuesta.
describe("Survey", () => {
  test("renderiza las cinco opciones de calificacion", () => {
    // Renderiza el componente y comprueba que existan los cinco radios etiquetados.
    render(<Survey />);

    const radios = screen.getAllByRole("radio");
    expect(radios).toHaveLength(5);
    expect(
      screen.getByRole("radio", { name: /1 estrella/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("radio", { name: /5 estrellas/i })
    ).toBeInTheDocument();
  });

  test("actualiza el estado cuando se selecciona una opcion", async () => {
    // Simula la seleccion de "3 estrellas" y verifica que quede marcada.
    const user = userEvent.setup();
    render(<Survey />);

    const radioTres = screen.getByRole("radio", { name: /3 estrellas/i });

    await user.click(radioTres);

    expect(radioTres).toBeChecked();
  });

  test("muestra mensaje de confirmacion con la puntuacion al enviar", async () => {
    // Completa el formulario seleccionando "4 estrellas" y espera el mensaje final.
    const user = userEvent.setup();
    render(<Survey />);

    await user.click(screen.getByRole("radio", { name: /4 estrellas/i }));
    await user.click(screen.getByRole("button", { name: /Enviar/i }));

    expect(screen.getByRole("status")).toHaveTextContent(
      "Gracias por tu puntuacion: 4"
    );
  });
});
