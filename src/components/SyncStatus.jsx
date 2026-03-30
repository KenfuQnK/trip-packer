import { Cloud, CloudOff, Loader2 } from "lucide-react";

export default function SyncStatus({ syncErrorMsg, syncState }) {
  const dbPath = "/(root collections)/";

  return (
    <div className="pointer-events-none fixed right-4 bottom-4 z-50 lg:right-6 lg:bottom-6">
      {syncState === "syncing" && (
        <div className="pointer-events-auto flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-800 shadow-xl shadow-amber-200/50">
          <Loader2 size={14} className="animate-spin" /> Guardando...
        </div>
      )}
      {syncState === "synced" && (
        <div
          className="pointer-events-auto cursor-help rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-800 shadow-xl shadow-emerald-200/50 opacity-90 transition-opacity hover:opacity-100"
          title={`Ruta DB: ${dbPath}`}
        >
          <div className="flex items-center gap-2">
            <Cloud size={14} /> Sincronizado
          </div>
        </div>
      )}
      {syncState === "error" && (
        <div
          className="pointer-events-auto cursor-help rounded-full bg-red-100 px-3 py-1.5 text-xs font-bold text-red-800 shadow-xl shadow-red-200/50"
          title={syncErrorMsg}
        >
          <div className="flex items-center gap-2">
            <CloudOff size={14} /> Error al guardar
          </div>
        </div>
      )}
    </div>
  );
}
