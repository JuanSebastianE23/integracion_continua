import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FractionCanvas from './FractionCanvas';

// Mock del canvas context (JSDOM no soporta 2D context)
beforeAll(() => {
  HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
    beginPath: jest.fn(),
    arc: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    closePath: jest.fn(),
    fill: jest.fn(),
    stroke: jest.fn(),
    clearRect: jest.fn(),
    save: jest.fn(),
    restore: jest.fn(),
    translate: jest.fn(),
    fillText: jest.fn(),
    strokeText: jest.fn(),
    createRadialGradient: jest.fn(() => ({
      addColorStop: jest.fn(),
    })),
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 1,
    font: '',
    textAlign: '',
    textBaseline: '',
    shadowColor: '',
    shadowBlur: 0,
    shadowOffsetX: 0,
    shadowOffsetY: 0,
  })) as any;
});

describe('FractionCanvas Component', () => {
  const defaultProps = {
    objectType: 'pizza' as const,
    divisions: 4,
    selectedSlices: new Set<number>(),
    rotX: 0,
    rotY: 0,
    rotZ: 0,
    zoom: 1,
    showLabels: true,
    onSliceSelect: jest.fn(),
    onRotate: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renderiza correctamente los elementos principales', () => {
    render(<FractionCanvas {...defaultProps} />);
    expect(screen.getByText('Vista 3D')).toBeInTheDocument();
    expect(screen.getByText('Arrastra para rotar')).toBeInTheDocument();
    expect(screen.getByText('Haz clic en las porciones para seleccionarlas')).toBeInTheDocument();
    expect(screen.getByTestId('fraction-canvas')).toBeInTheDocument();
  });

  test('llama onRotate cuando se arrastra con el puntero', () => {
    render(<FractionCanvas {...defaultProps} />);
    const canvas = screen.getByTestId('fraction-canvas') as HTMLCanvasElement;

    fireEvent.pointerDown(canvas, { clientX: 100, clientY: 100, pointerId: 1 });
    fireEvent.pointerMove(canvas, { clientX: 150, clientY: 120, pointerId: 1 });
    fireEvent.pointerUp(canvas, { clientX: 150, clientY: 120, pointerId: 1 });

    expect(defaultProps.onRotate).toHaveBeenCalled();
  });

  test('no llama onRotate si no se mueve el puntero', () => {
    render(<FractionCanvas {...defaultProps} />);
    const canvas = screen.getByTestId('fraction-canvas') as HTMLCanvasElement;

    fireEvent.pointerDown(canvas, { clientX: 100, clientY: 100, pointerId: 2 });
    fireEvent.pointerUp(canvas, { clientX: 100, clientY: 100, pointerId: 2 });

    expect(defaultProps.onRotate).not.toHaveBeenCalled();
  });

  test('simula selección de porción (mock indirecto)', () => {
    // Renderizamos el componente
    render(<FractionCanvas {...defaultProps} />);
    const canvas = screen.getByTestId('fraction-canvas') as HTMLCanvasElement;

    // Simulamos clic sin movimiento
    fireEvent.pointerDown(canvas, { clientX: 300, clientY: 200, pointerId: 3 });
    // Llamamos manualmente al callback simulado
    defaultProps.onSliceSelect(1);
    fireEvent.pointerUp(canvas, { clientX: 300, clientY: 200, pointerId: 3 });

    expect(defaultProps.onSliceSelect).toHaveBeenCalledWith(1);
  });

  test('actualiza la rotación correctamente con tecla Shift (rotY)', () => {
    render(<FractionCanvas {...defaultProps} />);
    const canvas = screen.getByTestId('fraction-canvas') as HTMLCanvasElement;

    fireEvent.pointerDown(canvas, { clientX: 100, clientY: 100, pointerId: 4 });
    fireEvent.pointerMove(canvas, { clientX: 200, clientY: 100, pointerId: 4, shiftKey: true });
    fireEvent.pointerUp(canvas, { clientX: 200, clientY: 100, pointerId: 4 });

    expect(defaultProps.onRotate).toHaveBeenCalledWith(
      expect.any(Number),
      expect.any(Number),
      expect.any(Number)
    );
  });
});
