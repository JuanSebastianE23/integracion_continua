import { FormEvent, useState } from "react";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);

  const isFormValid = name.trim() !== "" && email.trim() !== "";

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isFormValid) {
      return;
    }

    const message = `Registro completado para ${name}`;
    setConfirmationMessage(message);
    setName("");
    setEmail("");
  };

  return (
    <section className="mx-auto max-w-md space-y-6 rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-1 shadow-xl">
      <div className="rounded-3xl bg-white/90 p-8 backdrop-blur-md dark:bg-slate-900/90">
        <header className="text-center">
          <h2 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">
            🎉 Registro Rápido
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Completa tus datos y únete ahora.
          </p>
        </header>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="name"
              className="mb-1 block text-sm font-semibold text-slate-700 dark:text-slate-200"
            >
              Nombre
            </label>
            <input
              id="name"
              name="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
              placeholder="Tu nombre completo"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-semibold text-slate-700 dark:text-slate-200"
            >
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
              placeholder="correo@ejemplo.com"
            />
          </div>

          <button
            type="submit"
            disabled={!isFormValid}
            className="w-full rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:scale-105 hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
             Registrarme
          </button>
        </form>

        {confirmationMessage && (
          <p
            role="status"
            className="mt-6 rounded-xl bg-green-100 p-3 text-center text-sm font-semibold text-green-700 shadow-inner dark:bg-green-900/30 dark:text-green-300"
          >
            {confirmationMessage}
          </p>
        )}
      </div>
    </section>
  );
}
