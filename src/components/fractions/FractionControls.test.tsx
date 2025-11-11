import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import FractionControls from './FractionControls';

describe('FractionControls', () => {
  const mockProps = {
    objectType: 'pizza' as const,
    divisions: 8,
    zoom: 1,
    showLabels: true,
    showEquivalents: true,
    selectedSlices: new Set([1, 2]),
    onObjectTypeChange: jest.fn(),
    onDivisionsChange: jest.fn(),
    onZoomChange: jest.fn(),
    onShowLabelsChange: jest.fn(),
    onShowEquivalentsChange: jest.fn(),
    onSelectAll: jest.fn(),
    onReset: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Renderizado', () => {
    it('debe renderizar todos los controles principales', () => {
      render(<FractionControls {...mockProps} />);
      expect(screen.getByText('Pizza')).toBeInTheDocument();
      expect(screen.getByText('Pastel')).toBeInTheDocument();
      expect(screen.getByText('Tipo de Objeto')).toBeInTheDocument();
      expect(screen.getByText('Divisiones')).toBeInTheDocument();
    });

    it('debe mostrar todos los títulos de secciones', () => {
      render(<FractionControls {...mockProps} />);
      expect(screen.getByText('Visualización')).toBeInTheDocument();
      expect(screen.getByText('Controles de Zoom')).toBeInTheDocument();
    });

    it('debe tener todas las opciones de divisiones disponibles', () => {
      render(<FractionControls {...mockProps} />);
      expect(screen.getByText('2 partes')).toBeInTheDocument();
      expect(screen.getByText('4 partes')).toBeInTheDocument();
      expect(screen.getByText('8 partes')).toBeInTheDocument();
      expect(screen.getByText('12 partes')).toBeInTheDocument();
      expect(screen.getByText('16 partes')).toBeInTheDocument();
    });
  });

  describe('Cambio de Tipo de Objeto', () => {
    it('debe cambiar tipo de objeto a cake al hacer clic', () => {
      render(<FractionControls {...mockProps} />);
      const cakeButton = screen.getByText('Pastel');
      fireEvent.click(cakeButton);
      expect(mockProps.onObjectTypeChange).toHaveBeenCalledWith('cake');
      expect(mockProps.onObjectTypeChange).toHaveBeenCalledTimes(1);
    });

    it('debe cambiar tipo de objeto a pizza al hacer clic', () => {
      const propsWithCake = { ...mockProps, objectType: 'cake' as const };
      render(<FractionControls {...propsWithCake} />);
      const pizzaButton = screen.getByText('Pizza');
      fireEvent.click(pizzaButton);
      expect(mockProps.onObjectTypeChange).toHaveBeenCalledWith('pizza');
    });

    it('debe resaltar el tipo de objeto seleccionado (Pizza)', () => {
      render(<FractionControls {...mockProps} />);
      const pizzaButton = screen.getByText('Pizza');
      expect(pizzaButton).toHaveClass('bg-orange-500');
    });

    it('debe resaltar el tipo de objeto seleccionado (Pastel)', () => {
      const propsWithCake = { ...mockProps, objectType: 'cake' as const };
      render(<FractionControls {...propsWithCake} />);
      const cakeButton = screen.getByText('Pastel');
      expect(cakeButton).toHaveClass('bg-pink-500');
    });
  });

  describe('Cambio de Divisiones', () => {
    it('debe cambiar divisiones desde el selector', () => {
      render(<FractionControls {...mockProps} />);
      const select = screen.getByRole('combobox');
      fireEvent.change(select, { target: { value: '12' } });
      expect(mockProps.onDivisionsChange).toHaveBeenCalledWith(12);
    });

    it('debe cambiar a 4 divisiones', () => {
      render(<FractionControls {...mockProps} />);
      const select = screen.getByRole('combobox');
      fireEvent.change(select, { target: { value: '4' } });
      expect(mockProps.onDivisionsChange).toHaveBeenCalledWith(4);
    });

    it('debe cambiar a 16 divisiones', () => {
      render(<FractionControls {...mockProps} />);
      const select = screen.getByRole('combobox');
      fireEvent.change(select, { target: { value: '16' } });
      expect(mockProps.onDivisionsChange).toHaveBeenCalledWith(16);
    });
  });

  describe('Visualización', () => {
    it('debe alternar etiquetas al hacer clic', () => {
      render(<FractionControls {...mockProps} />);
      const labelsButton = screen.getByText('Etiquetas').closest('button');
      fireEvent.click(labelsButton!);
      expect(mockProps.onShowLabelsChange).toHaveBeenCalledWith(false);
    });

    it('debe alternar equivalencias al hacer clic', () => {
      render(<FractionControls {...mockProps} />);
      const equivButton = screen.getByText('Equivalencias').closest('button');
      fireEvent.click(equivButton!);
      expect(mockProps.onShowEquivalentsChange).toHaveBeenCalledWith(false);
    });

    it('debe mostrar ON cuando las etiquetas están activas', () => {
      render(<FractionControls {...mockProps} />);
      expect(screen.getAllByText('ON')[0]).toBeInTheDocument();
    });

    it('debe mostrar OFF cuando las etiquetas están desactivadas', () => {
      const propsWithoutLabels = { ...mockProps, showLabels: false };
      render(<FractionControls {...propsWithoutLabels} />);
      expect(screen.getAllByText('OFF')[0]).toBeInTheDocument();
    });

    it('debe mostrar ON cuando las equivalencias están activas', () => {
      render(<FractionControls {...mockProps} />);
      expect(screen.getAllByText('ON')[1]).toBeInTheDocument();
    });

    it('debe mostrar OFF cuando las equivalencias están desactivadas', () => {
      const propsWithoutEquiv = { ...mockProps, showEquivalents: false };
        render(<FractionControls {...propsWithoutEquiv} />);
        // Puede haber solo una instancia de 'OFF' cuando solo las equivalencias están desactivadas
        expect(screen.getByText('OFF')).toBeInTheDocument();
    });
  });

  describe('Controles de Zoom', () => {
    it('debe aumentar zoom correctamente', () => {
      render(<FractionControls {...mockProps} />);
      const zoomInButton = screen.getByText('Acercar').closest('button');
      fireEvent.click(zoomInButton!);
      expect(mockProps.onZoomChange).toHaveBeenCalledWith(1.2);
    });

    it('debe disminuir zoom correctamente', () => {
      render(<FractionControls {...mockProps} />);
      const zoomOutButton = screen.getByText('Alejar').closest('button');
      fireEvent.click(zoomOutButton!);
      expect(mockProps.onZoomChange).toHaveBeenCalledWith(0.8);
    });

    it('debe limitar zoom mínimo a 0.5', () => {
      const propsWithMinZoom = { ...mockProps, zoom: 0.5 };
      render(<FractionControls {...propsWithMinZoom} />);
      const zoomOutButton = screen.getByText('Alejar').closest('button');
      fireEvent.click(zoomOutButton!);
      expect(mockProps.onZoomChange).toHaveBeenCalledWith(0.5);
    });

    it('debe limitar zoom máximo a 2.0', () => {
      const propsWithMaxZoom = { ...mockProps, zoom: 2 };
      render(<FractionControls {...propsWithMaxZoom} />);
      const zoomInButton = screen.getByText('Acercar').closest('button');
      fireEvent.click(zoomInButton!);
      expect(mockProps.onZoomChange).toHaveBeenCalledWith(2);
    });

    it('debe mostrar el nivel de zoom actual', () => {
      render(<FractionControls {...mockProps} />);
      expect(screen.getByText('Zoom: 100%')).toBeInTheDocument();
    });

    it('debe mostrar zoom de 150% correctamente', () => {
      const propsWithZoom = { ...mockProps, zoom: 1.5 };
      render(<FractionControls {...propsWithZoom} />);
      expect(screen.getByText('Zoom: 150%')).toBeInTheDocument();
    });

    it('debe mostrar zoom de 50% correctamente', () => {
      const propsWithZoom = { ...mockProps, zoom: 0.5 };
      render(<FractionControls {...propsWithZoom} />);
      expect(screen.getByText('Zoom: 50%')).toBeInTheDocument();
    });

    it('debe mostrar zoom de 200% correctamente', () => {
      const propsWithZoom = { ...mockProps, zoom: 2.0 };
      render(<FractionControls {...propsWithZoom} />);
      expect(screen.getByText('Zoom: 200%')).toBeInTheDocument();
    });
  });

  describe('Acciones', () => {
    it('debe llamar a seleccionar todo al hacer clic', () => {
      render(<FractionControls {...mockProps} />);
      const selectAllButton = screen.getByText('Seleccionar / Deseleccionar todo');
      fireEvent.click(selectAllButton);
      expect(mockProps.onSelectAll).toHaveBeenCalled();
      expect(mockProps.onSelectAll).toHaveBeenCalledTimes(1);
    });

    it('debe llamar a reiniciar al hacer clic', () => {
      render(<FractionControls {...mockProps} />);
      const resetButton = screen.getByText('Reiniciar');
      fireEvent.click(resetButton);
      expect(mockProps.onReset).toHaveBeenCalled();
      expect(mockProps.onReset).toHaveBeenCalledTimes(1);
    });
  });

  describe('Validación de Props', () => {
    it('debe aceptar props válidas sin errores', () => {
      expect(() => render(<FractionControls {...mockProps} />)).not.toThrow();
    });

    it('debe funcionar con objectType cake', () => {
      const propsWithCake = { ...mockProps, objectType: 'cake' as const };
      expect(() => render(<FractionControls {...propsWithCake} />)).not.toThrow();
    });

    it('debe funcionar con diferentes valores de zoom', () => {
      const propsWithZoom = { ...mockProps, zoom: 1.5 };
      expect(() => render(<FractionControls {...propsWithZoom} />)).not.toThrow();
    });

    it('debe funcionar con showLabels false', () => {
      const props = { ...mockProps, showLabels: false };
      expect(() => render(<FractionControls {...props} />)).not.toThrow();
    });

    it('debe funcionar con showEquivalents false', () => {
      const props = { ...mockProps, showEquivalents: false };
      expect(() => render(<FractionControls {...props} />)).not.toThrow();
    });
  });
});