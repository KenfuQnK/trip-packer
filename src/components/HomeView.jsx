import { Map, Plus, Settings } from "lucide-react";

export default function HomeView({ setActiveTripId, setView, theme, trips }) {
  const isDark = theme === "dark";
  const createTrip = () => {
    setActiveTripId(null);
    setView("trip-edit");
  };

  const openTrip = (id) => {
    setActiveTripId(id);
    setView("packer");
  };

  return (
    <div className={`flex h-full flex-col ${isDark ? "bg-slate-950" : "bg-slate-50"}`}>
      <div
        className={`relative z-10 rounded-b-3xl border-b px-6 pt-12 pb-6 shadow-sm lg:hidden ${
          isDark
            ? "border-slate-800 bg-slate-900 shadow-none"
            : "border-slate-100 bg-white"
        }`}
      >
        <div className="flex w-full items-center justify-between">
          <h1 className={`text-3xl font-extrabold tracking-tight ${isDark ? "text-slate-100" : "text-slate-900"}`}>
            Mis Viajes
          </h1>
          <button
            onClick={() => setView("config")}
            className={`cursor-pointer rounded-full p-3 transition-colors hover:text-indigo-600 ${
              isDark
                ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                : "bg-slate-50 text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Settings size={24} />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        {trips.length === 0 ? (
          <div className={`mt-16 text-center ${isDark ? "text-slate-500" : "text-slate-400"}`}>
            <Map size={64} className="mx-auto mb-4 opacity-30" />
            <p className={`mb-1 text-xl font-bold ${isDark ? "text-slate-300" : "text-slate-500"}`}>
              Aun no hay viajes
            </p>
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
                  className={`cursor-pointer rounded-3xl border p-5 shadow-sm transition-all hover:border-indigo-200 active:scale-[0.98] ${
                    isDark
                      ? "border-slate-800 bg-slate-900 shadow-none hover:border-indigo-500/40"
                      : "border-slate-100 bg-white"
                  }`}
                >
                  <h3 className={`mb-3 truncate text-xl font-bold ${isDark ? "text-slate-100" : "text-slate-800"}`}>
                    {trip.name}
                  </h3>
                  <div className={`mb-2 flex justify-between text-sm font-semibold ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    <span>
                      {trip.packedItems.length} / {trip.selectedItems.length} listos
                    </span>
                    <span className={isDark ? "text-indigo-300" : "text-indigo-600"}>{progress}%</span>
                  </div>
                  <div className={`h-2.5 overflow-hidden rounded-full ${isDark ? "bg-slate-800" : "bg-slate-100"}`}>
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${isDark ? "bg-indigo-400" : "bg-indigo-500"}`}
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
          className={`cursor-pointer flex w-full max-w-sm items-center justify-center gap-2 rounded-2xl py-4 text-lg font-bold text-white shadow-lg transition-all active:scale-95 ${
            isDark
              ? "bg-indigo-500 shadow-indigo-950/40"
              : "bg-indigo-600 shadow-indigo-200"
          }`}
        >
          <Plus size={24} /> Nuevo Viaje
        </button>
      </div>
    </div>
  );
}
