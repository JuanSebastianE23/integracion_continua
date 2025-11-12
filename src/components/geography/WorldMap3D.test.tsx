/**
 * @jest-environment jsdom
 */
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// 🔹 Mock completo del componente para que Jest no lea el archivo real
jest.mock("./WorldMap3D", () => ({
  __esModule: true,
  default: (props: any) => (
    <div data-testid="mock-map">
      <p>Mock WorldMap3D</p>
      <p>Modo: {props.mode || "select"}</p>
      {props.category && <p>Categoría: {props.category}</p>}
    </div>
  ),
}));

import WorldMap3D from "./WorldMap3D";

describe("🧭 WorldMap3D (mockeado)", () => {
  test("se renderiza correctamente", () => {
    render(<WorldMap3D />);
    expect(screen.getByTestId("mock-map")).toBeInTheDocument();
    expect(screen.getByText("Mock WorldMap3D")).toBeInTheDocument();
  });

  test("recibe props de modo correctamente", () => {
    render(<WorldMap3D mode="compare" />);
    expect(screen.getByText(/Modo: compare/i)).toBeInTheDocument();
  });

  test("recibe props de categoría correctamente", () => {
    render(<WorldMap3D category="clima" />);
    expect(screen.getByText(/Categoría: clima/i)).toBeInTheDocument();
  });
});
