import { useState } from "react";
import { Check, ChevronDown, ChevronLeft, ChevronUp, Edit2, Trash2 } from "lucide-react";

import { getCategoryColorClasses } from "../utils/constants";

export default function PackerView({
  actions,
  activeTripId,
  categories,
  items,
  setView,
  theme,
  trips,
}) {
  const trip = trips.find((entry) => entry.id === activeTripId);
  const [collapsed, setCollapsed] = useState({});
  const isDark = theme === "dark";

  if (!trip) {
    return null;
  }

  const progress = trip.selectedItems.length
    ? Math.round((trip.packedItems.length / trip.selectedItems.length) * 100)
    : 0;
  const selectedItemIds = new Set(trip.selectedItems);

  const toggleCategory = (categoryId) => {
    setCollapsed((current) => ({ ...current, [categoryId]: !current[categoryId] }));
  };

  return (
    <div className={`flex h-full flex-col ${isDark ? "bg-slate-950" : "bg-slate-50"}`}>
      <div
        className={`sticky top-0 z-20 border-b px-4 pt-6 pb-4 shadow-sm ${
          isDark
            ? "border-slate-800 bg-slate-900 shadow-none"
            : "border-slate-100 bg-white"
        }`}
      >
        <div className="flex w-full items-center justify-between">
          <button
            onClick={() => setView("home")}
            className={`-ml-2 cursor-pointer rounded-full p-2 text-slate-400 transition-colors ${
              isDark
                ? "bg-slate-800 hover:text-slate-200"
                : "bg-slate-50 hover:text-slate-600"
            }`}
          >
            <ChevronLeft size={24} />
          </button>
          <h2 className={`truncate px-2 text-xl font-extrabold ${isDark ? "text-slate-100" : "text-slate-800"}`}>
            {trip.name}
          </h2>
          <div className="flex gap-1">
            <button
              onClick={() => setView("trip-edit")}
              className={`cursor-pointer rounded-full p-2 text-slate-400 transition-colors ${
                isDark
                  ? "bg-slate-800 hover:text-indigo-300"
                  : "bg-slate-50 hover:text-indigo-600"
              }`}
            >
              <Edit2 size={18} />
            </button>
            <button
              onClick={() => actions.deleteTrip(trip.id)}
              className={`cursor-pointer rounded-full p-2 text-slate-400 transition-colors ${
                isDark
                  ? "bg-slate-800 hover:text-red-300"
                  : "bg-slate-50 hover:text-red-500"
              }`}
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
      <div
        className={`sticky top-[73px] z-10 border-b px-6 pt-3 pb-4 shadow-sm ${
          isDark
            ? "border-slate-800 bg-slate-900 shadow-none"
            : "border-slate-100 bg-white"
        }`}
      >
        <div className="w-full">
          <div className={`mb-2 flex justify-between text-sm font-bold ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            <span>
              {trip.packedItems.length} de {trip.selectedItems.length} en la maleta
            </span>
            <span className={isDark ? "text-indigo-300" : "text-indigo-600"}>{progress}%</span>
          </div>
          <div className={`h-3 overflow-hidden rounded-full ${isDark ? "bg-slate-800" : "bg-slate-100"}`}>
            <div
              className={`h-full rounded-full transition-all duration-500 ease-out ${
                isDark ? "bg-indigo-400" : "bg-indigo-500"
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 pb-12">
        {trip.selectedItems.length === 0 && (
          <div className={`mt-12 text-center ${isDark ? "text-slate-500" : "text-slate-400"}`}>
            <p className="text-lg font-medium">No has configurado ningun item.</p>
            <button
              onClick={() => setView("trip-edit")}
              className={`cursor-pointer mt-4 font-bold hover:underline ${
                isDark ? "text-indigo-300" : "text-indigo-600"
              }`}
            >
              Anadir items al viaje
            </button>
          </div>
        )}
        <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 xl:columns-4">
          {categories.map((category) => {
            const categoryItems = items
              .filter((item) => item.categoryId === category.id)
              .sort((first, second) => (first.order || 0) - (second.order || 0));

            const hasSelectedItems = categoryItems.some(
              (item) => item.type !== "separator" && selectedItemIds.has(item.id),
            );

            if (!hasSelectedItems) {
              return null;
            }

            return (
              <div
                key={category.id}
                className={`animate-in slide-in-from-bottom-2 fade-in mb-6 break-inside-avoid overflow-hidden rounded-2xl border p-3 shadow-sm duration-300 ${
                  getCategoryColorClasses(category.color, "card", theme)
                } ${isDark ? "shadow-none" : ""}`}
              >
                <div
                  className="inline-flex w-full cursor-pointer select-none items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wider transition-opacity hover:opacity-80"
                  onClick={() => toggleCategory(category.id)}
                >
                  {category.name}{" "}
                  {collapsed[category.id] ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                </div>
                {!collapsed[category.id] && (
                  <div className="mt-3 space-y-2">
                    {categoryItems.map((item, index) => {
                      const isSeparator = item.type === "separator";
                      const displayLabel = item.name || "Separador";

                      if (isSeparator) {
                        const hasSelectedAfter = categoryItems
                          .slice(index + 1)
                          .some(
                            (entry) =>
                              entry.type !== "separator" && selectedItemIds.has(entry.id),
                          );

                        if (!hasSelectedAfter) {
                          return null;
                        }

                        return (
                          <div
                            key={item.id}
                            className={`px-4 py-1 text-xs font-semibold uppercase tracking-wide ${
                              isDark ? "text-slate-500" : "text-slate-400"
                            }`}
                          >
                            {displayLabel}:
                          </div>
                        );
                      }

                      if (!selectedItemIds.has(item.id)) {
                        return null;
                      }

                      const isPacked = trip.packedItems.includes(item.id);

                      return (
                        <div
                          key={item.id}
                          onClick={() => actions.togglePacked(trip.id, item.id, trip.packedItems)}
                          className={`flex cursor-pointer items-center gap-2 rounded-xl p-2 transition-all duration-300 ${
                            isPacked
                              ? isDark
                                ? "scale-[0.98] bg-slate-900/60 opacity-60"
                                : "scale-[0.98] bg-slate-50 opacity-60"
                              : isDark
                                ? "border border-slate-700 bg-slate-900 hover:border-indigo-500/40 hover:bg-slate-800"
                                : "border border-slate-100 bg-white shadow-sm hover:border-indigo-200 hover:bg-slate-100"
                          }`}
                        >
                          <div
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                              isPacked
                                ? isDark
                                  ? "border-emerald-500 bg-emerald-500 text-white shadow-md shadow-emerald-950/40"
                                  : "border-emerald-500 bg-emerald-500 text-white shadow-md shadow-emerald-200"
                                : isDark
                                  ? "border-slate-600 bg-slate-950 text-transparent"
                                  : "border-slate-300 bg-white text-transparent"
                            }`}
                          >
                            <Check
                              size={18}
                              strokeWidth={3}
                              className={isPacked ? "opacity-100" : "opacity-0"}
                            />
                          </div>
                          <span
                            className={`text-lg transition-all duration-300 ${
                              isPacked
                                ? isDark
                                  ? "text-slate-400 line-through"
                                  : "text-slate-500 line-through"
                                : isDark
                                  ? "font-semibold text-slate-100"
                                  : "font-semibold text-slate-800"
                            }`}
                          >
                            {item.name}
                          </span>
                        </div>
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
  );
}
