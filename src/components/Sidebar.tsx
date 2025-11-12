import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaCube,
  FaColumns,
  FaMicrophone,
  FaShapes,
  FaCalculator,
  FaRuler,
  FaKey,
  FaMouse,
  FaList,
  FaStar,
  FaRandom,
  FaShoppingCart,
  FaUserPlus,
  FaSun,
  FaMap,
  FaAdjust,
} from "react-icons/fa";

interface SidebarItem {
  label: string;
  route: string;
  icon?: React.ReactNode;
}

const mainItems: SidebarItem[] = [
  { label: "Inicio", route: "/", icon: <FaHome /> },
  { label: "Three.js Demo", route: "/three", icon: <FaCube /> },
  { label: "Responsive Layouts", route: "/layouts", icon: <FaColumns /> },
  { label: "Text-to-Speech", route: "/tts", icon: <FaMicrophone /> },
  { label: "Figuras Geométricas", route: "/three_2", icon: <FaShapes /> },
  { label: "Sistema Solar", route: "/sistema-solar", icon: <FaSun /> },
  { label: "Fracciones Visualizador", route: "/fractions", icon: <FaAdjust /> },
  { label: "Mapa Mundial 3D", route: "/world-map-3d", icon: <FaMap /> },
];

const exerciseItems: SidebarItem[] = [
  { label: "Tablas de Multiplicar", route: "/tablasmul", icon: <FaCalculator /> },
  { label: "Conversor de Unidades", route: "/conversorunid", icon: <FaRuler /> },
  { label: "Validador de Contraseñas", route: "/validcontrasena", icon: <FaKey /> },
  { label: "Contador de Clics", route: "/contadorclics", icon: <FaMouse /> },
  { label: "Lista de Tareas", route: "/listareas", icon: <FaList /> },
  { label: "Encuesta de Satisfacción", route: "/survey", icon: <FaStar /> },
  { label: "Generador Aleatorio", route: "/random-number", icon: <FaRandom /> },
  { label: "Carrito de Compras", route: "/shopping-cart", icon: <FaShoppingCart /> },
  { label: "Formulario de Registro", route: "/register-form", icon: <FaUserPlus /> },
];

export default function Sidebar() {
  const [openMain, setOpenMain] = useState(false);
  const [openExercises, setOpenExercises] = useState(false);

  const renderNavItem = ({ label, route, icon }: SidebarItem) => (
    <NavLink
      key={route}
      to={route}
      className={({ isActive }) =>
        `w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-200 
         ${
           isActive
             ? "bg-gradient-to-r from-emerald-500 to-teal-400 text-white font-semibold shadow-md"
             : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
         }`
      }
    >
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </NavLink>
  );

  return (
    <aside className="hidden md:block w-full md:w-[250px] h-screen border-r border-slate-200 dark:border-slate-800 
                      bg-gradient-to-b from-white via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="p-4 space-y-3">
        <button
          onClick={() => setOpenMain(!openMain)}
          className="w-full flex items-center justify-between px-4 py-2 rounded-lg text-slate-700 dark:text-slate-200 
                     bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-bold"
        >
          Menú Principal
          <span>{openMain ? "−" : "+"}</span>
        </button>
        {openMain && (
          <div className="pl-4 space-y-2">{mainItems.map(renderNavItem)}</div>
        )}

        <button
          onClick={() => setOpenExercises(!openExercises)}
          className="w-full flex items-center justify-between px-4 py-2 rounded-lg text-slate-700 dark:text-slate-200 
                     bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-bold"
        >
          Ejercicios - Jtest
          <span>{openExercises ? "−" : "+"}</span>
        </button>
        {openExercises && (
          <div className="pl-4 space-y-2">{exerciseItems.map(renderNavItem)}</div>
        )}
      </div>
    </aside>
  );
}
