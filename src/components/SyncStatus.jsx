import { Cloud, CloudOff, Loader2 } from "lucide-react";

export default function SyncStatus({ syncErrorMsg, syncState, theme }) {
  const isDark = theme === "dark";
  const dbPath = "/(root collections)/";

  return (
    <div className="pointer-events-none fixed right-4 bottom-4 z-50 lg:right-6 lg:bottom-6">
      {syncState === "syncing" && (
        <div
          className={`pointer-events-auto flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold shadow-xl ${
            isDark
              ? "bg-amber-500/15 text-amber-200 shadow-amber-950/30"
              : "bg-amber-100 text-amber-800 shadow-amber-200/50"
          }`}
        >
          <Loader2 size={14} className="animate-spin" /> Guardando...
        </div>
      )}
      {syncState === "synced" && (
        <div
          className={`pointer-events-auto cursor-help rounded-full px-3 py-1.5 text-xs font-bold shadow-xl opacity-90 transition-opacity hover:opacity-100 ${
            isDark
              ? "bg-emerald-500/15 text-emerald-200 shadow-emerald-950/30"
              : "bg-emerald-100 text-emerald-800 shadow-emerald-200/50"
          }`}
          title={`Ruta DB: ${dbPath}`}
        >
          <div className="flex items-center gap-2">
            <Cloud size={14} /> Sincronizado
          </div>
        </div>
      )}
      {syncState === "error" && (
        <div
          className={`pointer-events-auto cursor-help rounded-full px-3 py-1.5 text-xs font-bold shadow-xl ${
            isDark
              ? "bg-red-500/15 text-red-200 shadow-red-950/30"
              : "bg-red-100 text-red-800 shadow-red-200/50"
          }`}
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
