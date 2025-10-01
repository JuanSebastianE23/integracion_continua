import { useState } from "react";

// Opciones de calificacion disponibles en la encuesta.
const ratingOptions = [1, 2, 3, 4, 5];

export default function Survey() {
  // Estado controlado para la opcion que el usuario selecciona.
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  // Estado para mostrar la calificacion que se envio.
  const [submittedRating, setSubmittedRating] = useState<number | null>(null);

  // Evita el refresh del formulario y guarda la seleccion enviada.
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmittedRating(selectedRating);
  };

  return (
    <section className="survey mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-lg transition-all dark:border-slate-700 dark:bg-slate-800">
      <header className="space-y-1 text-center text-slate-700 dark:text-slate-100">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-500">
          Feedback
        </p>
        <h2 className="text-2xl font-bold">Encuesta de Satisfaccion</h2>
        <p className="text-sm text-slate-500 dark:text-slate-300">
          Califica tu experiencia seleccionando una opcion del 1 al 5.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        aria-label="Encuesta de satisfaccion"
        className="mt-6 space-y-6"
      >
        <fieldset className="flex flex-col gap-4">
          <legend className="text-base font-medium text-slate-600 dark:text-slate-200">
            Que tan satisfecho estas?
          </legend>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-5">
            {ratingOptions.map((option) => (
              <label
                key={option}
                className={`flex cursor-pointer flex-col items-center gap-2 rounded-xl border p-3 text-sm font-medium transition hover:border-emerald-400 hover:bg-emerald-50/70 dark:border-slate-600 dark:hover:border-emerald-400 dark:hover:bg-emerald-500/10 ${
                  selectedRating === option
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:border-emerald-400 dark:bg-emerald-500/20 dark:text-emerald-200"
                    : "text-slate-600 dark:text-slate-200"
                }`}
              >
                <input
                  type="radio"
                  name="rating"
                  value={option}
                  checked={selectedRating === option}
                  onChange={() => setSelectedRating(option)}
                  className="h-4 w-4 accent-emerald-500"
                />
                {`${option} ${option === 1 ? "estrella" : "estrellas"}`}
              </label>
            ))}
          </div>
        </fieldset>
        <button
          type="submit"
          className="w-full rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400"
        >
          Enviar
        </button>
      </form>
      {submittedRating !== null && (
        // Mensaje de confirmacion que refleja la calificacion enviada.
        <p className="mt-6 rounded-xl bg-emerald-50 p-4 text-center text-sm font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200" role="status">
          Gracias por tu puntuacion: {submittedRating}
        </p>
      )}
    </section>
  );
}
