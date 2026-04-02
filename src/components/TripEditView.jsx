import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, ChevronLeft, ChevronUp } from "lucide-react";

import { generateId, getCategoryColorClasses } from "../utils/constants";

export default function TripEditView({
  actions,
  activeTripId,
  categories,
  items,
  setView,
  theme,
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
  const isFirstRender = useRef(true);
  const saveTrip = actions.saveTrip;

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    saveTrip(draft);
  }, [draft, saveTrip]);

  const toggleCategory = (categoryId) => {
    setCollapsed((current) => ({ ...current, [categoryId]: !current[categoryId] }));
  };

  return (
    <div className="flex h-full flex-col bg-slate-50 dark:bg-slate-950">
      <div className="sticky top-0 z-10 border-b border-slate-100 bg-white px-4 pt-6 pb-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
        <div className="flex w-full items-center gap-3">
          <button
            onClick={() => setView("home")}
            className="-ml-2 cursor-pointer rounded-full bg-slate-50 p-2 text-slate-400 transition-colors hover:text-slate-600 dark:bg-slate-800 dark:text-slate-500 dark:hover:text-slate-200"
          >
            <ChevronLeft size={24} />
          </button>
          <h2 className="min-w-0 flex-1 truncate text-center text-xl font-extrabold text-slate-800 dark:text-slate-100">
            {isNew ? "Nuevo Viaje" : "Editar Viaje"}
          </h2>
          <div className="w-10" aria-hidden="true" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-5 pb-8">
        <div className="mb-8 max-w-xl">
          <label className="mb-2 ml-1 block text-sm font-bold text-slate-500 dark:text-slate-400">
            Nombre del viaje
          </label>
          <input
            type="text"
            value={draft.name}
            onChange={(event) => setDraft({ ...draft, name: event.target.value })}
            placeholder="Ej: Fin de semana en Roma"
            className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-lg font-semibold text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/20"
          />
        </div>
        <div>
          <label className="mb-4 ml-1 block text-sm font-bold text-slate-500 dark:text-slate-400">
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
                  className={`mb-6 break-inside-avoid overflow-hidden rounded-3xl border p-4 shadow-sm dark:shadow-none ${getCategoryColorClasses(category.color, "card", theme)}`}
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
                              className="px-4 py-1 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500"
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
                                ? "border-indigo-200 bg-indigo-50/50 dark:border-indigo-500/40 dark:bg-indigo-500/10"
                                : "border-slate-100 bg-white hover:border-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-indigo-500/30"
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
                                  ? "border-indigo-600 bg-indigo-600 text-white dark:border-indigo-500 dark:bg-indigo-500"
                                  : "border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-950"
                              }`}
                            >
                              {isSelected && <Check size={14} strokeWidth={4} />}
                            </div>
                            <span
                              className={
                                isSelected
                                  ? "font-bold text-indigo-900 dark:text-indigo-100"
                                  : "font-medium text-slate-700 dark:text-slate-200"
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
    </div>
  );

  function toggleItem(itemId) {
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
  }
}
