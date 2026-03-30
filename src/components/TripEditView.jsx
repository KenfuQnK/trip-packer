import { useState } from "react";
import { Check, ChevronDown, ChevronLeft, ChevronUp } from "lucide-react";

import { generateId } from "../utils/constants";

export default function TripEditView({
  actions,
  activeTripId,
  categories,
  items,
  setView,
  trips,
}) {
  const isNew = !activeTripId;
  const [draft, setDraft] = useState(() => {
    if (!isNew) {
      return trips.find((trip) => trip.id === activeTripId);
    }

    return { id: generateId(), name: "", selectedItems: [], packedItems: [] };
  });
  const [collapsed, setCollapsed] = useState({});

  const toggleCategory = (categoryId) => {
    setCollapsed((current) => ({ ...current, [categoryId]: !current[categoryId] }));
  };

  const toggleItem = (itemId) => {
    setDraft((current) => {
      const isSelected = current.selectedItems.includes(itemId);
      const nextSelectedItems = isSelected
        ? current.selectedItems.filter((selectedId) => selectedId !== itemId)
        : [...current.selectedItems, itemId];
      const nextPackedItems = isSelected
        ? current.packedItems.filter((packedId) => packedId !== itemId)
        : current.packedItems;

      return {
        ...current,
        selectedItems: nextSelectedItems,
        packedItems: nextPackedItems,
      };
    });
  };

  return (
    <div className="flex h-full flex-col bg-slate-50">
      <div className="sticky top-0 z-10 border-b border-slate-100 bg-white px-4 pt-6 pb-4 shadow-sm">
        <div className="flex w-full items-center justify-between gap-3">
          <button
            onClick={() => setView("home")}
            className="-ml-2 cursor-pointer rounded-full bg-slate-50 p-2 text-slate-400 transition-colors hover:text-slate-600"
          >
            <ChevronLeft size={24} />
          </button>
          <h2 className="min-w-0 flex-1 truncate text-center text-xl font-extrabold text-slate-800">
            {isNew ? "Nuevo Viaje" : "Editar Viaje"}
          </h2>
          <button
            onClick={() => actions.saveTrip(draft)}
            disabled={!draft.name.trim()}
            className="hidden cursor-pointer rounded-2xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 lg:inline-flex"
          >
            Guardar viaje
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-5 pb-8">
        <div className="mb-8 max-w-xl">
          <label className="mb-2 ml-1 block text-sm font-bold text-slate-500">
            Nombre del viaje
          </label>
          <input
            type="text"
            value={draft.name}
            onChange={(event) => setDraft({ ...draft, name: event.target.value })}
            placeholder="Ej: Fin de semana en Roma"
            className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-lg font-semibold outline-none transition-all focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
          />
        </div>
        <div>
          <label className="mb-4 ml-1 block text-sm font-bold text-slate-500">
            Que te llevas
          </label>
          <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 xl:columns-4">
            {categories.map((category) => {
              const categoryItems = items
                .filter((item) => item.categoryId === category.id)
                .sort((first, second) => (first.order || 0) - (second.order || 0));

              if (categoryItems.length === 0) {
                return null;
              }

              return (
                <div
                  key={category.id}
                  className={`mb-6 break-inside-avoid overflow-hidden rounded-3xl border border-slate-100 p-4 shadow-sm ${category.color}`}
                >
                  <div
                    className="mb-3 inline-flex w-full cursor-pointer select-none items-center gap-2 rounded-lg px-3 pb-1 text-xs font-bold uppercase tracking-wider transition-opacity hover:opacity-80"
                    onClick={() => toggleCategory(category.id)}
                  >
                    {category.name}{" "}
                    {collapsed[category.id] ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                  </div>
                  {!collapsed[category.id] && (
                    <div className="animate-in slide-in-from-top-2 fade-in grid gap-2 duration-200">
                      {categoryItems.map((item) => {
                        const isSeparator = item.type === "separator";
                        const displayLabel = item.name || "Separador";

                        if (isSeparator) {
                          return (
                            <div
                              key={item.id}
                              className=" px-4 py-1 text-xs font-semibold uppercase tracking-wide text-slate-400"
                            >
                              {displayLabel}:
                            </div>
                          );
                        }

                        const isSelected = draft.selectedItems.includes(item.id);

                        return (
                          <label
                            key={item.id}
                            className={`flex cursor-pointer items-center gap-4 rounded-xl border p-2 shadow-sm transition-all ${
                              isSelected
                                ? "border-indigo-200 bg-indigo-50/50"
                                : "border-slate-100 bg-white hover:border-indigo-100"
                            }`}
                          >
                            <input
                              type="checkbox"
                              className="hidden"
                              checked={isSelected}
                              onChange={() => toggleItem(item.id)}
                            />
                            <div
                              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
                                isSelected
                                  ? "border-indigo-600 bg-indigo-600 text-white"
                                  : "border-slate-300 bg-white"
                              }`}
                            >
                              {isSelected && <Check size={14} strokeWidth={4} />}
                            </div>
                            <span
                              className={
                                isSelected
                                  ? "font-bold text-indigo-900"
                                  : "font-medium text-slate-700"
                              }
                            >
                              {item.name}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="sticky bottom-0 z-20 mt-auto px-5 pt-6 pb-5 lg:hidden">
        <div className="flex justify-center bg-gradient-to-t from-slate-50 via-slate-50 to-transparent pt-8">
          <button
            onClick={() => actions.saveTrip(draft)}
            disabled={!draft.name.trim()}
            className="cursor-pointer w-full max-w-sm rounded-2xl bg-indigo-600 py-4 text-lg font-bold text-white shadow-lg shadow-indigo-200 transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Guardar viaje
          </button>
        </div>
      </div>
    </div>
  );
}
