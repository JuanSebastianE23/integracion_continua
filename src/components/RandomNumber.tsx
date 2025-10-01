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
    <section className="mx-auto max-w-sm rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-lg dark:border-slate-700 dark:bg-slate-800">
      <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-100">
        Generador de numeros aleatorios
      </h2>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">
        Haz clic en el boton para obtener un numero entre 1 y 100.
      </p>
      <button
        type="button"
        onClick={handleClick}
        className="mt-4 w-full rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400"
      >
        Generar numero
      </button>
      {currentValue !== null && (
        <p
          role="status"
          aria-live="polite"
          className="mt-4 rounded-xl bg-emerald-50 p-4 text-lg font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200"
        >
          Numero generado: {currentValue}
        </p>
      )}
    </section>
  );
}
