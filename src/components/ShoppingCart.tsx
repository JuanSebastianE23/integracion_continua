import { useState } from "react";

interface Product {
  id: string;
  name: string;
  price: number;
}

interface CartItem extends Product {
  quantity: number;
}

const catalog: Product[] = [
  { id: "coffee", name: "Café en grano", price: 8.5 },
  { id: "tea", name: "Té verde", price: 5.25 },
  { id: "cookies", name: "Galletas artesanales", price: 6.75 },
];

function calculateTotal(cart: CartItem[]): number {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

export default function ShoppingCart() {
  const [cart, setCart] = useState<CartItem[]>([]);

  const handleAdd = (product: Product) => {
    setCart((previous) => {
      const existing = previous.find((item) => item.id === product.id);
      if (existing) {
        return previous.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...previous, { ...product, quantity: 1 }];
    });
  };

  const handleRemove = (productId: string) => {
    setCart((previous) => previous.filter((item) => item.id !== productId));
  };

  const total = calculateTotal(cart);

  return (
    <section className="mx-auto max-w-3xl space-y-8 rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-1 shadow-2xl">
      <div className="rounded-3xl bg-white/95 p-8 backdrop-blur-md dark:bg-slate-900/95">
        <header className="text-center">
          <h2 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">
            Carrito de Compras
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Agrega productos y revisa el total en tiempo real.
          </p>
        </header>

        {/* Catálogo */}
        <div>
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
            Catálogo
          </h3>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {catalog.map((product) => (
              <li
                key={product.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:scale-105 hover:shadow-lg dark:border-slate-600 dark:bg-slate-800"
              >
                <p className="text-base font-semibold text-slate-700 dark:text-slate-100">
                  {product.name}
                </p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">
                  ${product.price.toFixed(2)}
                </p>
                <button
                  type="button"
                  onClick={() => handleAdd(product)}
                  className="mt-4 w-full rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-400"
                >
                  Agregar al carrito
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Carrito */}
        <div>
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
            Tu Carrito
          </h3>
          {cart.length === 0 ? (
            <p
              className="mt-3 rounded-xl bg-slate-100 p-4 text-center text-sm text-slate-600 dark:bg-slate-700 dark:text-slate-300"
              role="status"
            >
              El carrito está vacío
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {cart.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-600 dark:bg-slate-800"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-100">
                      {item.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-300">
                      Cantidad: {item.quantity} · Unidad: ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemove(item.id)}
                    className="rounded-lg border border-red-500 px-3 py-1 text-xs font-semibold text-red-500 transition hover:bg-red-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-400"
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
          )}

          <p
            data-testid="cart-total"
            className="mt-5 rounded-xl bg-emerald-100 p-4 text-right text-lg font-bold text-emerald-700 shadow-inner dark:bg-emerald-900/30 dark:text-emerald-300"
          >
            Total: ${total.toFixed(2)}
          </p>
        </div>
      </div>
    </section>
  );
}
