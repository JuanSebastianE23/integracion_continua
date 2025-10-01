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
  { id: "coffee", name: "Cafe en grano", price: 8.5 },
  { id: "tea", name: "Te verde", price: 5.25 },
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
    <section className="mx-auto max-w-2xl space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-700 dark:bg-slate-800">
      <header className="text-center">
        <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-100">
          Carrito de compras
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">
          Agrega productos y revisa el total actualizado en tiempo real.
        </p>
      </header>

      <div>
        <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-200">
          Catalogo
        </h3>
        <ul className="mt-3 grid gap-3 md:grid-cols-3">
          {catalog.map((product) => (
            <li
              key={product.id}
              className="rounded-xl border border-slate-200 p-4 text-left dark:border-slate-600"
            >
              <p className="text-sm font-medium text-slate-700 dark:text-slate-100">
                {product.name}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-300">
                ${product.price.toFixed(2)}
              </p>
              <button
                type="button"
                onClick={() => handleAdd(product)}
                className="mt-3 w-full rounded-lg bg-emerald-500 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                Agregar al carrito
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-200">
          Carrito
        </h3>
        {cart.length === 0 ? (
          <p className="mt-3 rounded-xl bg-slate-100 p-4 text-center text-sm text-slate-600 dark:bg-slate-700 dark:text-slate-200" role="status">
            El carrito esta vacio
          </p>
        ) : (
          <ul className="mt-3 space-y-3">
            {cart.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between rounded-xl border border-slate-200 p-4 dark:border-slate-600"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-100">
                    {item.name}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-300">
                    Cantidad: {item.quantity} · Precio unidad: ${item.price.toFixed(2)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemove(item.id)}
                  className="rounded-lg border border-red-500 px-3 py-1 text-sm font-semibold text-red-500 transition hover:bg-red-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-400"
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        )}
        <p
          data-testid="cart-total"
          className="mt-4 rounded-xl bg-emerald-50 p-4 text-right text-lg font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200"
        >
          Total: ${total.toFixed(2)}
        </p>
      </div>
    </section>
  );
}
