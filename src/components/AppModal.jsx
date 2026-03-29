export default function AppModal({ modal, setModal, closeModal }) {
  if (!modal.isOpen) {
    return null;
  }

  const handleConfirm = () => {
    modal.onConfirm?.(modal.value);
    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className="animate-in fade-in zoom-in-95 duration-200 w-full max-w-sm rounded-3xl bg-white p-6 shadow-xl">
        <h3 className="mb-4 text-xl font-bold text-slate-800">{modal.title}</h3>
        {!modal.isDelete ? (
          <input
            autoFocus
            type="text"
            value={modal.value}
            onChange={(event) => setModal({ ...modal, value: event.target.value })}
            placeholder={modal.placeholder}
            className="mb-6 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-lg outline-none transition-all focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
          />
        ) : (
          <p className="mb-6 font-medium text-slate-600">{modal.deleteText}</p>
        )}
        <div className="flex gap-3">
          <button
            className="flex-1 rounded-2xl bg-slate-100 px-4 py-3 font-bold text-slate-700 transition-colors active:bg-slate-200"
            onClick={closeModal}
          >
            Cancelar
          </button>
          <button
            className={`flex-1 rounded-2xl px-4 py-3 font-bold text-white transition-colors ${
              modal.isDelete
                ? "bg-red-500 active:bg-red-600"
                : "bg-indigo-600 active:bg-indigo-700 disabled:opacity-50"
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
