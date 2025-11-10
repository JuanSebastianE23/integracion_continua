import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock Three.js to avoid import issues in tests
jest.mock('three', () => ({
  Scene: jest.fn().mockImplementation(() => ({
    add: jest.fn(),
  })),
  PerspectiveCamera: jest.fn().mockImplementation(() => ({
    aspect: 1,
    updateProjectionMatrix: jest.fn(),
    position: { set: jest.fn() },
    lookAt: jest.fn(),
  })),
  WebGLRenderer: jest.fn().mockImplementation(() => ({
    setSize: jest.fn(),
    setClearColor: jest.fn(),
    domElement: document.createElement('canvas'),
    render: jest.fn(),
    dispose: jest.fn(),
  })),
  AmbientLight: jest.fn(),
  PointLight: jest.fn().mockImplementation(() => ({
    position: { set: jest.fn() },
  })),
  BufferGeometry: jest.fn().mockImplementation(() => ({
    setAttribute: jest.fn(),
  })),
  BufferAttribute: jest.fn(),
  PointsMaterial: jest.fn(),
  Points: jest.fn(),
  SphereGeometry: jest.fn(),
  MeshBasicMaterial: jest.fn(),
  MeshStandardMaterial: jest.fn(),
  Mesh: jest.fn().mockImplementation(() => ({
    position: { set: jest.fn(), x: 0, z: 0 },
    rotation: { y: 0 },
    userData: {},
    add: jest.fn(),
    geometry: { dispose: jest.fn() },
    material: { dispose: jest.fn() },
  })),
  RingGeometry: jest.fn(),
  DoubleSide: 'DoubleSide',
  TextureLoader: jest.fn().mockImplementation(() => ({
    load: jest.fn(() => ({})),
  })),
  Raycaster: jest.fn().mockImplementation(() => ({
    setFromCamera: jest.fn(),
    intersectObjects: jest.fn(() => []),
  })),
  Vector2: jest.fn(),
  Material: jest.fn(),
}));

jest.mock('three/examples/jsm/controls/OrbitControls', () => ({
  OrbitControls: jest.fn().mockImplementation(() => ({
    enableDamping: true,
    dampingFactor: 0.05,
    enableZoom: true,
    enablePan: true,
    enableRotate: true,
    minDistance: 5,
    maxDistance: 100,
    update: jest.fn(),
  })),
}));

import SistemaSolarInteractivo from './SistemaSolar';

describe('SistemaSolarInteractivo', () => {
  test('renders the solar system title', () => {
    render(<SistemaSolarInteractivo />);
    const titleElement = screen.getByText(/Sistema Solar Interactivo/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('renders start/pause orbit button', () => {
    render(<SistemaSolarInteractivo />);
    const buttonElement = screen.getByText(/Iniciar Orbitas/i);
    expect(buttonElement).toBeInTheDocument();
  });

  test('renders reset system button', () => {
    render(<SistemaSolarInteractivo />);
    const buttonElement = screen.getByText(/🔄 Reiniciar Sistema/i);
    expect(buttonElement).toBeInTheDocument();
  });

  test('renders controls section', () => {
    render(<SistemaSolarInteractivo />);
    const controlsElement = screen.getByText(/🎮 Controles Interactivos/i);
    expect(controlsElement).toBeInTheDocument();
  });

  test('renders drag control instruction', () => {
    render(<SistemaSolarInteractivo />);
    const dragElement = screen.getByText(/Arrastrar = Rotar vista/i);
    expect(dragElement).toBeInTheDocument();
  });

  test('renders zoom control instruction', () => {
    render(<SistemaSolarInteractivo />);
    const zoomElement = screen.getByText(/Rueda = Zoom in\/out/i);
    expect(zoomElement).toBeInTheDocument();
  });

  test('renders pan control instruction', () => {
    render(<SistemaSolarInteractivo />);
    const panElement = screen.getByText(/Shift \+ arrastrar = Desplazar/i);
    expect(panElement).toBeInTheDocument();
  });

  test('renders hover instruction', () => {
    render(<SistemaSolarInteractivo />);
    const hoverElement = screen.getByText(/Pasa el cursor sobre los planetas para ver datos astronómicos/i);
    expect(hoverElement).toBeInTheDocument();
  });

  test('renders click instruction', () => {
    render(<SistemaSolarInteractivo />);
    const clickElement = screen.getByText(/Haz clic para información detallada/i);
    expect(clickElement).toBeInTheDocument();
  });

  test('button toggles between start and pause', () => {
    render(<SistemaSolarInteractivo />);
    const buttonElement = screen.getByText(/Iniciar Orbitas/i);
    fireEvent.click(buttonElement);
    expect(screen.getByText(/Pausar Orbitas/i)).toBeInTheDocument();
  });

  test('renders 3D canvas container', () => {
    render(<SistemaSolarInteractivo />);
    const canvasContainer = document.querySelector('[style*="height: 650px"]');
    expect(canvasContainer).toBeInTheDocument();
  });
});