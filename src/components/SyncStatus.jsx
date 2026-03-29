import { Cloud, CloudOff, Loader2 } from "lucide-react";

import { appId, isCanvasEnvironment } from "../utils/firebase";

export default function SyncStatus({ syncErrorMsg, syncState, user }) {
  const dbPath = isCanvasEnvironment
    ? `/artifacts/${appId}/users/${user.uid}/`
    : `/users/${user.uid}/`;

  return (
    <div className="absolute top-4 right-4 z-50">
      {syncState === "syncing" && (
        <div className="flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-800 shadow-sm">
          <Loader2 size={14} className="animate-spin" /> Guardando...
        </div>
      )}
      {syncState === "synced" && (
        <div
          className="cursor-help rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-800 shadow-sm opacity-70 transition-opacity hover:opacity-100"
          title={`Ruta DB: ${dbPath}`}
        >
          <div className="flex items-center gap-2">
            <Cloud size={14} /> Sincronizado
          </div>
        </div>
      )}
      {syncState === "error" && (
        <div
          className="cursor-help rounded-full bg-red-100 px-3 py-1.5 text-xs font-bold text-red-800 shadow-sm"
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
