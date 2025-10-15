import { useState } from "react";

const MIN_VALUE = 1;
const MAX_VALUE = 100;

function generateRandom(exclude: number | null): number {
  const min = Number(MIN_VALUE);
  const max = Number(MAX_VALUE);

  if (max < min) {
    throw new Error("El rango minimo/maximo es invalido");
  }

  let candidate = Math.floor(Math.random() * (max - min + 1)) + min;

  if (min === max || exclude === null) {
    return candidate;
  }

  while (candidate === exclude) {
    candidate = Math.floor(Math.random() * (max - min + 1)) + min;
  }

  return candidate;
}

export default function RandomNumber() {
  const [currentValue, setCurrentValue] = useState<number | null>(null);

  const handleClick = () => {
    setCurrentValue((previous) => generateRandom(previous));
  };

  return (
    <section className="mx-auto max-w-sm rounded-lg border border-gray-300 bg-gray-50 p-5 text-center shadow-md dark:border-gray-700 dark:bg-gray-900">
      <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">
        Generador de Números Aleatorios
      </h2>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Clic en el botón para obtener un número entre 1 y 100.
      </p>
      <button
        type="button"
        onClick={handleClick}
        className="mt-4 w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      >
        Generar Número
      </button>
      {currentValue !== null && (
        <p
          role="status"
          aria-live="polite"
          className="mt-4 rounded-md bg-indigo-100 p-3 text-base font-semibold text-indigo-800 dark:bg-indigo-500/10 dark:text-indigo-300"
        >
          Número generado: {currentValue}
        </p>
      )}
    </section>
  );
}
