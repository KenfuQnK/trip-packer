import "./App.css";

import AppModal from "./components/AppModal";
import ConfigView from "./components/ConfigView";
import HomeView from "./components/HomeView";
import PackerView from "./components/PackerView";
import SyncStatus from "./components/SyncStatus";
import TripEditView from "./components/TripEditView";
import { useTripPackerApp } from "./utils/useTripPackerApp";
import { Settings } from "lucide-react";

function App() {
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
    syncErrorMsg,
    syncState,
    trips,
    view,
  } = useTripPackerApp();

  if (firebaseError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 p-6 text-center font-sans">
        <div className="max-w-md rounded-3xl border border-red-200 bg-red-50 p-6 shadow-sm">
          <h2 className="mb-2 text-xl font-bold text-red-600">Error de configuracion</h2>
          <p className="mb-4 text-sm font-medium text-slate-700">
            {firebaseError.message}
          </p>
          <p className="rounded-xl bg-white p-2 font-mono text-xs text-slate-500">
            {firebaseError.code}
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 text-xl font-bold text-slate-500">
        Cargando equipaje...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-100 font-sans text-slate-800 selection:bg-indigo-100">
      <div className="relative flex min-h-screen w-full overflow-hidden bg-white transition-all duration-300 lg:flex-row">
        <aside className="hidden lg:flex lg:w-80 xl:w-96">
          <div className="flex h-full w-full flex-col border-r border-slate-100 bg-slate-950 px-8 py-8 text-white">
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
        <div className="relative flex min-h-screen w-full min-w-0 flex-1 flex-col overflow-hidden bg-white">
          <SyncStatus syncErrorMsg={syncErrorMsg} syncState={syncState} />

          {view === "home" && (
            <HomeView trips={trips} setView={setView} setActiveTripId={setActiveTripId} />
          )}
          {view === "config" && (
            <ConfigView categories={categories} items={items} setView={setView} actions={actions} />
          )}
          {view === "trip-edit" && (
            <TripEditView
              trips={trips}
              activeTripId={activeTripId}
              categories={categories}
              items={items}
              setView={setView}
              actions={actions}
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
            />
          )}

          <AppModal modal={modal} setModal={setModal} closeModal={closeModal} />
        </div>
      </div>
    </div>
  );
}

export default App;
