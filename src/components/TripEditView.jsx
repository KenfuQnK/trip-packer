import { useState } from "react";
import { Check, ChevronDown, ChevronLeft, ChevronUp } from "lucide-react";

import { generateId } from "../utils/tripPackerData";

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
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
          <button
            onClick={() => setView("home")}
            className="-ml-2 rounded-full bg-slate-50 p-2 text-slate-400 transition-colors hover:text-slate-600"
          >
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-xl font-extrabold text-slate-800">
            {isNew ? "Nuevo Viaje" : "Editar Viaje"}
          </h2>
          <div className="w-10" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-5 pb-24">
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
              const categoryItems = items.filter((item) => item.categoryId === category.id);

              if (categoryItems.length === 0) {
                return null;
              }

              return (
                <div key={category.id} className="mb-6 break-inside-avoid">
                  <div
                    className={`mb-3 inline-flex cursor-pointer select-none items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wider transition-opacity hover:opacity-80 ${category.color}`}
                    onClick={() => toggleCategory(category.id)}
                  >
                    {category.name}{" "}
                    {collapsed[category.id] ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                  </div>
                  {!collapsed[category.id] && (
                    <div className="animate-in slide-in-from-top-2 fade-in grid gap-2 duration-200">
                      {categoryItems.map((item) => {
                        const isSelected = draft.selectedItems.includes(item.id);

                        return (
                          <label
                            key={item.id}
                            className={`flex cursor-pointer items-center gap-4 rounded-2xl border p-4 shadow-sm transition-all ${
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
      <div className="fixed right-0 bottom-0 left-0 z-10 flex justify-center border-t border-slate-100 bg-white p-4">
        <button
          onClick={() => actions.saveTrip(draft)}
          disabled={!draft.name.trim()}
          className="w-full max-w-sm rounded-2xl bg-indigo-600 py-4 text-lg font-bold text-white shadow-lg shadow-indigo-200 transition-transform active:scale-95 disabled:opacity-50"
        >
          Guardar Viaje
        </button>
      </div>
    </div>
  );
}
