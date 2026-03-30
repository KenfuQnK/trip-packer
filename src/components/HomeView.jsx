import { Map, Plus, Settings } from "lucide-react";

export default function HomeView({ setActiveTripId, setView, trips }) {
  const createTrip = () => {
    setActiveTripId(null);
    setView("trip-edit");
  };

  const openTrip = (id) => {
    setActiveTripId(id);
    setView("packer");
  };

  return (
    <div className="flex h-full flex-col bg-slate-50">
      <div className="relative z-10 rounded-b-3xl border-b border-slate-100 bg-white px-6 pt-12 pb-6 shadow-sm lg:hidden">
        <div className="flex w-full items-center justify-between">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Mis Viajes</h1>
          <button
            onClick={() => setView("config")}
            className="cursor-pointer rounded-full bg-slate-50 p-3 text-slate-600 transition-colors hover:bg-slate-100 hover:text-indigo-600"
          >
            <Settings size={24} />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        {trips.length === 0 ? (
          <div className="mt-16 text-center text-slate-400">
            <Map size={64} className="mx-auto mb-4 opacity-30" />
            <p className="mb-1 text-xl font-bold text-slate-500">Aun no hay viajes</p>
            <p className="text-sm">Crea uno para empezar a preparar tu maleta.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {trips.map((trip) => {
              const progress = trip.selectedItems.length
                ? Math.round((trip.packedItems.length / trip.selectedItems.length) * 100)
                : 0;

              return (
                <div
                  key={trip.id}
                  onClick={() => openTrip(trip.id)}
                  className="cursor-pointer rounded-3xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:border-indigo-200 active:scale-[0.98]"
                >
                  <h3 className="mb-3 truncate text-xl font-bold text-slate-800">{trip.name}</h3>
                  <div className="mb-2 flex justify-between text-sm font-semibold text-slate-500">
                    <span>
                      {trip.packedItems.length} / {trip.selectedItems.length} listos
                    </span>
                    <span className="text-indigo-600">{progress}%</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-indigo-500 transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div className="flex justify-center p-6 pt-0">
        <button
          onClick={createTrip}
          className="cursor-pointer flex w-full max-w-sm items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-4 text-lg font-bold text-white shadow-lg shadow-indigo-200 transition-all active:scale-95"
        >
          <Plus size={24} /> Nuevo Viaje
        </button>
      </div>
    </div>
  );
}
