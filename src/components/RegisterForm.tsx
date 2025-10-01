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
    <section className="mx-auto max-w-md space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-700 dark:bg-slate-800">
      <header className="text-center">
        <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-100">
          Registro rapido
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">
          Completa tus datos y confirma el registro.
        </p>
      </header>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="text-left">
          <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-200">
            Nombre
          </label>
          <input
            id="name"
            name="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            placeholder="Ingresa tu nombre"
          />
        </div>

        <div className="text-left">
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-200">
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            placeholder="correo@ejemplo.com"
          />
        </div>

        <button
          type="submit"
          disabled={!isFormValid}
          className="w-full rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          Registrar
        </button>
      </form>

      {confirmationMessage && (
        <p
          role="status"
          className="rounded-xl bg-emerald-50 p-4 text-center text-sm font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200"
        >
          {confirmationMessage}
        </p>
      )}
    </section>
  );
}
