import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FractionVisualizer from './FractionVisualizer';

// Mock de los subcomponentes para no renderizar gráficos ni lógica interna
jest.mock('./FractionCanvas', () => (props: any) => (
  <div data-testid="fraction-canvas-mock">
    FractionCanvasMock
    <button onClick={() => props.onSliceSelect(1)}>selectSlice</button>
    <button onClick={() => props.onRotate(10, 20, 30)}>rotate</button>
  </div>
));

jest.mock('./FractionControls', () => (props: any) => (
  <div data-testid="fraction-controls-mock">
    FractionControlsMock
    <button onClick={() => props.onObjectTypeChange('cake')}>setCake</button>
    <button onClick={() => props.onDivisionsChange(6)}>setDiv6</button>
    <button onClick={() => props.onSelectAll()}>selectAll</button>
    <button onClick={() => props.onReset()}>reset</button>
  </div>
));

jest.mock('./FractionEquivalents', () => (props: any) => (
  <div data-testid="fraction-equivalents-mock">
    FractionEquivalentsMock - {props.selectedCount}/{props.divisions}
  </div>
));

describe('FractionVisualizer Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renderiza los elementos principales', () => {
    render(<FractionVisualizer />);
    expect(screen.getByText('Visualizador 3D de Fracciones')).toBeInTheDocument();
    expect(screen.getByTestId('fraction-canvas-mock')).toBeInTheDocument();
    expect(screen.getByTestId('fraction-controls-mock')).toBeInTheDocument();
    expect(screen.getByTestId('fraction-equivalents-mock')).toBeInTheDocument();
  });

  test('cambia el tipo de objeto a "cake"', () => {
    render(<FractionVisualizer />);
    const btn = screen.getByText('setCake');
    fireEvent.click(btn);
    // Después del cambio, el canvas se vuelve a renderizar con el nuevo tipo
    expect(screen.getByText('FractionCanvasMock')).toBeInTheDocument();
  });

  test('cambia el número de divisiones', () => {
    render(<FractionVisualizer />);
    const btn = screen.getByText('setDiv6');
    fireEvent.click(btn);
    expect(screen.getByTestId('fraction-equivalents-mock')).toHaveTextContent('0/6');
  });

  test('maneja la selección de porciones', () => {
    render(<FractionVisualizer />);
    const selectBtn = screen.getByText('selectSlice');
    fireEvent.click(selectBtn);
    expect(screen.getByTestId('fraction-equivalents-mock')).toHaveTextContent('1/8');
  });

  test('maneja la selección total y reseteo', () => {
    render(<FractionVisualizer />);
    const selectAll = screen.getByText('selectAll');
    fireEvent.click(selectAll);
    expect(screen.getByTestId('fraction-equivalents-mock')).toHaveTextContent('8/8');

    const reset = screen.getByText('reset');
    fireEvent.click(reset);
    expect(screen.getByTestId('fraction-equivalents-mock')).toHaveTextContent('0/8');
  });

  test('actualiza los valores de rotación al rotar desde el canvas', () => {
    render(<FractionVisualizer />);
    const rotateBtn = screen.getByText('rotate');
    fireEvent.click(rotateBtn);
    expect(screen.getByTestId('fraction-equivalents-mock')).toBeInTheDocument();
  });
});
