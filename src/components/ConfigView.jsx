import { ChevronDown, ChevronLeft, ChevronUp, Edit2, Plus, Trash2 } from "lucide-react";

export default function ConfigView({ actions, categories, items, setView }) {
  return (
    <div className="flex h-full flex-col bg-slate-50">
      <div className="sticky top-0 z-10 border-b border-slate-100 bg-white px-4 pt-6 pb-4 shadow-sm">
        <div className="flex w-full items-center">
          <button
            onClick={() => setView("home")}
            className="-ml-2 mr-3 cursor-pointer rounded-full bg-slate-50 p-2 text-slate-400 transition-colors hover:text-slate-600"
          >
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-xl font-extrabold text-slate-800">Configuracion</h2>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 pb-24">
        <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 xl:columns-4">
          {categories.map((category) => {
            const categoryItems = items
              .filter((item) => item.categoryId === category.id)
              .sort((first, second) => (first.order || 0) - (second.order || 0));

            return (
              <div
                key={category.id}
                className="mb-6 break-inside-avoid rounded-3xl border border-slate-100 bg-white p-5 shadow-sm"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className={`rounded-xl px-3 py-1.5 text-sm font-bold ${category.color}`}>
                    {category.name}
                  </h3>
                  <div className="flex gap-1">
                    <button
                      onClick={() => actions.editCategory(category)}
                      className="cursor-pointer rounded-full bg-slate-50 p-2 text-slate-400 transition-colors hover:text-indigo-600"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => actions.deleteCategory(category)}
                      className="cursor-pointer rounded-full bg-slate-50 p-2 text-slate-400 transition-colors hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  {categoryItems.map((item, index) => {
                    const isSeparator = item.type === "separator";
                    const separatorLabel = item.name || "Separador";

                    return (
                      <div
                        key={item.id}
                        className={`flex items-center justify-between rounded-2xl border p-2 pl-4 ${
                          isSeparator
                            ? " border-slate-200  bg-slate-200"
                            : "border-slate-100/50 bg-slate-50"
                        }`}
                      >
                        <span
                          className={`mr-2 truncate font-medium ${
                            isSeparator ? "text-slate-500" : "text-slate-700"
                          }`}
                        >
                          
                          {isSeparator && (
                            <div className="text-xs uppercase tracking-wide text-slate-400 ">
                              SEPARADOR
                            </div>
                          )}
                          {separatorLabel}
                        </span>
                        <div className="flex shrink-0 gap-1">
                          <div className="mr-1 flex flex-col justify-center">
                            <button
                              onClick={() => actions.moveItem(item, "up")}
                              disabled={index === 0}
                              className="cursor-pointer text-slate-300 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:text-slate-300"
                            >
                              <ChevronUp size={16} />
                            </button>
                            <button
                              onClick={() => actions.moveItem(item, "down")}
                              disabled={index === categoryItems.length - 1}
                              className="cursor-pointer text-slate-300 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:text-slate-300"
                            >
                              <ChevronDown size={16} />
                            </button>
                          </div>
                          <button
                            onClick={() => actions.editItem(item)}
                            className="cursor-pointer p-2 text-slate-400 transition-colors hover:text-indigo-600"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => actions.deleteItem(item)}
                            className="cursor-pointer p-2 text-slate-400 transition-colors hover:text-red-500"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  <div className="grid gap-2">
                    <button
                      className="cursor-pointer mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 py-3 text-sm font-bold text-slate-500 transition-colors hover:bg-slate-50 hover:text-indigo-600"
                      onClick={() => actions.addItem(category.id)}
                    >
                      <Plus size={18} /> Anadir item
                    </button>
                    <button
                      className="cursor-pointer flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-100 py-3 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-200"
                      onClick={() => actions.addSeparator(category.id)}
                    >
                      <Plus size={18} /> Añadir separador
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-6 flex justify-center">
          <button
            className="cursor-pointer flex w-full max-w-sm items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-indigo-200 bg-indigo-50/50 py-4 font-bold text-indigo-600 transition-all active:scale-95"
            onClick={actions.addCategory}
          >
            <Plus size={20} /> Nueva categoria
          </button>
        </div>
      </div>
    </div>
  );
}
