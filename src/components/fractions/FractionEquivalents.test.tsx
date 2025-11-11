import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FractionEquivalents from './FractionEquivalents';

describe('FractionEquivalents Component', () => {
  test('renderiza correctamente las etiquetas principales', () => {
    render(<FractionEquivalents selectedCount={2} divisions={4} />);
    expect(screen.getByText('Equivalencias')).toBeInTheDocument();
    expect(screen.getByText('Fracción')).toBeInTheDocument();
    expect(screen.getByText('Porcentaje')).toBeInTheDocument();
    expect(screen.getByText('Decimal')).toBeInTheDocument();
    expect(screen.getByText('Porciones')).toBeInTheDocument();
  });

  test('muestra correctamente la fracción, decimal y porcentaje', () => {
    render(<FractionEquivalents selectedCount={2} divisions={4} />);

    // Busca todos los elementos que contienen '2/4' en cualquier parte del texto
    const fractionElements = screen.getAllByText((content) => content.includes('2/4'));
    expect(fractionElements.length).toBeGreaterThan(0);

    expect(screen.getByText('50.0%')).toBeInTheDocument();
    expect(screen.getByText('0.500')).toBeInTheDocument();
    expect(screen.getByText('Simplificada: 1/2')).toBeInTheDocument();
  });

  test('maneja correctamente el caso de 0 divisiones', () => {
    render(<FractionEquivalents selectedCount={2} divisions={0} />);
    expect(screen.getByText('0/1')).toBeInTheDocument();
    expect(screen.getByText('0.0%')).toBeInTheDocument();
    expect(screen.getByText('0.000')).toBeInTheDocument();
  });

  test('maneja correctamente cuando selectedCount es 0', () => {
    render(<FractionEquivalents selectedCount={0} divisions={6} />);

     // Busca todos los elementos que podrían tener "0/6"
    const fractionElements = screen.getAllByText((content) => content.includes('0/6'));
    expect(fractionElements.length).toBeGreaterThan(0);

    expect(screen.getByText('0.0%')).toBeInTheDocument();
    expect(screen.getByText('0.000')).toBeInTheDocument();
    expect(screen.getByText('Simplificada: 0/1')).toBeInTheDocument();
  });

});
