import { Check } from "lucide-react";

import { getColorOption } from "../utils/constants";

export default function AppModal({ modal, setModal, closeModal }) {
  if (!modal.isOpen) {
    return null;
  }

  const handleConfirm = () => {
    modal.onConfirm?.(modal.value, modal.color);
    closeModal();
  };

  const selectedColor = modal.color || getColorOption(modal.color).className;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className="animate-in fade-in zoom-in-95 duration-200 w-full max-w-sm rounded-3xl bg-white p-6 shadow-xl">
        <h3 className="mb-4 text-xl font-bold text-slate-800">{modal.title}</h3>
        {!modal.isDelete ? (
          <>
            <input
              autoFocus
              type="text"
              value={modal.value}
              onChange={(event) => setModal({ ...modal, value: event.target.value })}
              placeholder={modal.placeholder}
              className="mb-6 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-lg outline-none transition-all focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
            />
            {modal.colorOptions?.length > 0 && (
              <div className="mb-6">
                <p className="mb-3 text-sm font-bold text-slate-500">Color</p>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {modal.colorOptions.map((option) => {
                    const isSelected = option.className === selectedColor;

                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setModal({ ...modal, color: option.className })}
                        className={`cursor-pointer flex items-center justify-between rounded-2xl px-3 py-2 text-left text-sm font-bold ring-1 ring-inset transition-all ${
                          isSelected
                            ? `${option.className} ring-2 ring-slate-400`
                            : `${option.className} opacity-70 hover:opacity-100`
                        }`}
                        aria-pressed={isSelected}
                      >
                        <span>{option.label}</span>
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
          <p className="mb-6 font-medium text-slate-600">{modal.deleteText}</p>
        )}
        <div className="flex gap-3">
          <button
            className="cursor-pointer flex-1 rounded-2xl bg-slate-100 px-4 py-3 font-bold text-slate-700 transition-colors active:bg-slate-200"
            onClick={closeModal}
          >
            Cancelar
          </button>
          <button
            className={`cursor-pointer flex-1 rounded-2xl px-4 py-3 font-bold text-white transition-colors ${
              modal.isDelete
                ? "bg-red-500 active:bg-red-600"
                : "bg-indigo-600 active:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
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
