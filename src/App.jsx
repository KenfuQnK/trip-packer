import "./App.css";

import AppModal from "./components/AppModal";
import ConfigView from "./components/ConfigView";
import HomeView from "./components/HomeView";
import PackerView from "./components/PackerView";
import SyncStatus from "./components/SyncStatus";
import TripEditView from "./components/TripEditView";
import { useTripPackerApp } from "./utils/useTripPackerApp";

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
    <div className="flex min-h-screen justify-center bg-slate-100 font-sans text-slate-800 selection:bg-indigo-100">
      <div className="relative flex min-h-screen w-full max-w-7xl flex-col overflow-hidden bg-white shadow-2xl transition-all duration-300">
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
  );
}

export default App;
