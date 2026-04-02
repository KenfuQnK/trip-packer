import { Check } from "lucide-react";

import { getCategoryColorClasses, getColorOption } from "../utils/constants";

export default function AppModal({ modal, setModal, closeModal, theme }) {
  if (!modal.isOpen) {
    return null;
  }

  const handleConfirm = () => {
    modal.onConfirm?.(modal.value, modal.color);
    closeModal();
  };

  const selectedColor = modal.color || getColorOption(modal.color).id;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm dark:bg-slate-950/70">
      <div className="animate-in fade-in zoom-in-95 w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 shadow-xl duration-200 dark:border-slate-800 dark:bg-slate-900">
        <h3 className="mb-4 text-xl font-bold text-slate-800 dark:text-slate-100">{modal.title}</h3>
        {!modal.isDelete ? (
          <>
            <input
              autoFocus
              type="text"
              value={modal.value}
              onChange={(event) => setModal({ ...modal, value: event.target.value })}
              placeholder={modal.placeholder}
              className="mb-6 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-lg text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/20"
            />
            {modal.colorOptions?.length > 0 && (
              <div className="mb-6">
                <p className="mb-3 text-sm font-bold text-slate-500 dark:text-slate-400">Color</p>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {modal.colorOptions.map((option) => {
                    const isSelected = option.id === selectedColor;
                    const colorClasses = getCategoryColorClasses(option.id, "chip", theme);

                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setModal({ ...modal, color: option.id })}
                        className={`cursor-pointer flex items-center justify-between rounded-2xl px-3 py-2 text-left text-sm font-bold ring-1 ring-inset transition-all ${
                          isSelected
                            ? `${colorClasses} ring-2 ring-slate-400 dark:ring-slate-500`
                            : `${colorClasses} opacity-75 hover:opacity-100`
                        }`}
                        aria-pressed={isSelected}
                      >
                        <span className={`h-3 w-3 rounded-full ${option.swatch}`} />
                        {isSelected && <Check size={14} className="ml-1 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        ) : (
          <p className="mb-6 font-medium text-slate-600 dark:text-slate-300">{modal.deleteText}</p>
        )}
        <div className="flex gap-3">
          <button
            className="cursor-pointer flex-1 rounded-2xl bg-slate-100 px-4 py-3 font-bold text-slate-700 transition-colors active:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:active:bg-slate-700"
            onClick={closeModal}
          >
            Cancelar
          </button>
          <button
            className={`cursor-pointer flex-1 rounded-2xl px-4 py-3 font-bold text-white transition-colors ${
              modal.isDelete
                ? "bg-red-500 active:bg-red-600 dark:bg-red-600 dark:active:bg-red-700"
                : "bg-indigo-600 active:bg-indigo-700 dark:bg-indigo-500 dark:active:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
            }`}
            onClick={handleConfirm}
            disabled={!modal.isDelete && !modal.value.trim()}
          >
            {modal.isDelete ? "Eliminar" : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}
