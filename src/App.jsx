import "./App.css";

import { useEffect, useState } from "react";
import { Download, Moon, Settings, Sun } from "lucide-react";

import AppModal from "./components/AppModal";
import ConfigView from "./components/ConfigView";
import HomeView from "./components/HomeView";
import PackerView from "./components/PackerView";
import TripEditView from "./components/TripEditView";
import { useTripPackerApp } from "./utils/useTripPackerApp";

const THEME_STORAGE_KEY = "trip-packer-theme";

function getInitialTheme() {
  if (typeof window === "undefined") {
    return "light";
  }

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function App() {
  const [theme, setTheme] = useState(getInitialTheme);
  const isDark = theme === "dark";
  const {
    actions,
    activeTripId,
    firebaseError,
    categories,
    closeModal,
    items,
    loading,
    modal,
    setActiveTripId,
    setModal,
    setView,
    trips,
    view,
  } = useTripPackerApp();

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "light" ? "dark" : "light"));
  };

  if (firebaseError) {
    return (
      <div
        className={`flex min-h-screen items-center justify-center p-6 text-center font-sans ${
          isDark ? "bg-slate-950" : "bg-slate-100"
        }`}
      >
        <div
          className={`max-w-md rounded-3xl border p-6 shadow-sm ${
            isDark
              ? "border-red-500/30 bg-red-500/10"
              : "border-red-200 bg-red-50"
          }`}
        >
          <h2 className={`mb-2 text-xl font-bold ${isDark ? "text-red-300" : "text-red-600"}`}>
            Error de configuracion
          </h2>
          <p className={`mb-4 text-sm font-medium ${isDark ? "text-slate-200" : "text-slate-700"}`}>
            {firebaseError.message}
          </p>
          <p
            className={`rounded-xl p-2 font-mono text-xs ${
              isDark ? "bg-slate-900 text-slate-400" : "bg-white text-slate-500"
            }`}
          >
            {firebaseError.code}
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div
        className={`flex min-h-screen items-center justify-center text-xl font-bold ${
          isDark ? "bg-slate-950 text-slate-400" : "bg-slate-100 text-slate-500"
        }`}
      >
        Cargando equipaje...
      </div>
    );
  }

  return (
    <div
      className={`flex min-h-screen font-sans selection:bg-indigo-100 ${
        isDark ? "bg-slate-950 text-slate-100" : "bg-slate-100 text-slate-800"
      }`}
    >
      <div
        className={`relative flex min-h-screen w-full transition-all duration-300 lg:flex-row ${
          isDark ? "bg-slate-950" : "bg-white"
        }`}
      >
        <aside className="hidden lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-80 lg:self-start lg:shrink-0 xl:w-96">
          <div
            className={`flex h-full w-full flex-col border-r px-8 py-8 text-white ${
              isDark ? "border-slate-800 bg-slate-900" : "border-slate-100 bg-slate-950"
            }`}
          >
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-slate-400">
                Trip Packer
              </p>
              <h1 className="text-4xl font-black tracking-tight text-white">Mis Viajes</h1>
              <p className="max-w-xs text-sm leading-6 text-slate-300">
                Gestiona tus viajes, prepara la maleta y sincroniza cada cambio sin perder el foco.
              </p>
            </div>
            <div className="mt-8 flex-1 overflow-y-auto">
              <div className="grid gap-2">
                <button
                  onClick={() => setView("home")}
                  className={`cursor-pointer rounded-2xl px-4 py-3 text-left text-sm font-semibold transition-colors ${
                    view === "home"
                      ? "bg-white/15 text-white"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  Inicio
                </button>
                {trips.map((trip) => {
                  const isActiveTrip =
                    trip.id === activeTripId && (view === "packer" || view === "trip-edit");

                  return (
                    <button
                      key={trip.id}
                      onClick={() => {
                        setActiveTripId(trip.id);
                        setView("packer");
                      }}
                      className={`cursor-pointer rounded-2xl px-4 py-3 text-left text-sm font-semibold transition-colors ${
                        isActiveTrip
                          ? "bg-white/15 text-white"
                          : "text-slate-300 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <span className="block truncate">{trip.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <button
              onClick={actions.exportJson}
              className="mt-6 flex w-full cursor-pointer items-center justify-between rounded-2xl bg-emerald-500/12 px-4 py-3 text-left font-bold text-emerald-100 transition-colors hover:bg-emerald-500/20 hover:text-white"
            >
              <span>Exportar JSON</span>
              <Download size={18} className="text-emerald-200" />
            </button>
            <button
              onClick={toggleTheme}
              className="mt-3 flex w-full cursor-pointer items-center justify-between rounded-2xl bg-white/8 px-4 py-3 text-left font-bold text-white transition-colors hover:bg-white/14"
            >
              <span>{isDark ? "Activar light mode" : "Activar dark mode"}</span>
              {isDark ? (
                <Sun size={18} className="text-amber-300" />
              ) : (
                <Moon size={18} className="text-slate-300" />
              )}
            </button>
            <button
              onClick={() => setView("config")}
              className={`mt-8 flex w-full cursor-pointer items-center justify-between rounded-2xl px-4 py-3 text-left font-bold transition-colors ${
                view === "config"
                  ? "bg-white text-slate-900"
                  : "bg-white/8 text-white hover:bg-white/14"
              }`}
            >
              <span>Configuracion</span>
              <Settings
                size={18}
                className={view === "config" ? "text-slate-500" : "text-slate-300"}
              />
            </button>
          </div>
        </aside>

        <div
          className={`relative flex min-h-screen w-full min-w-0 flex-1 flex-col overflow-hidden ${
            isDark ? "bg-slate-950" : "bg-white"
          }`}
        >
          {view === "home" && (
            <HomeView
              trips={trips}
              setView={setView}
              setActiveTripId={setActiveTripId}
              theme={theme}
            />
          )}
          {view === "config" && (
            <ConfigView
              categories={categories}
              items={items}
              setView={setView}
              actions={actions}
              theme={theme}
              toggleTheme={toggleTheme}
            />
          )}
          {view === "trip-edit" && (
            <TripEditView
              trips={trips}
              activeTripId={activeTripId}
              categories={categories}
              items={items}
              setView={setView}
              actions={actions}
              theme={theme}
            />
          )}
          {view === "packer" && (
            <PackerView
              trips={trips}
              activeTripId={activeTripId}
              categories={categories}
              items={items}
              setView={setView}
              actions={actions}
              theme={theme}
            />
          )}

          <AppModal modal={modal} setModal={setModal} closeModal={closeModal} theme={theme} />
        </div>
      </div>
    </div>
  );
}

export default App;
