export const CATEGORY_COLORS = [
  "bg-red-100 text-red-800",
  "bg-orange-100 text-orange-800",
  "bg-amber-100 text-amber-800",
  "bg-green-100 text-green-800",
  "bg-emerald-100 text-emerald-800",
  "bg-teal-100 text-teal-800",
  "bg-cyan-100 text-cyan-800",
  "bg-blue-100 text-blue-800",
  "bg-indigo-100 text-indigo-800",
  "bg-violet-100 text-violet-800",
  "bg-purple-100 text-purple-800",
  "bg-fuchsia-100 text-fuchsia-800",
  "bg-pink-100 text-pink-800",
  "bg-rose-100 text-rose-800",
];

export const DEFAULT_CATEGORIES = [
  { id: "c1", name: "Ropa", color: "bg-blue-100 text-blue-800" },
  { id: "c2", name: "Aseo", color: "bg-teal-100 text-teal-800" },
  { id: "c3", name: "Electronica", color: "bg-purple-100 text-purple-800" },
  { id: "c4", name: "Documentos", color: "bg-yellow-100 text-yellow-800" },
  { id: "c5", name: "Botiquin", color: "bg-red-100 text-red-800" },
];

export const DEFAULT_ITEMS = [
  { id: "i1", categoryId: "c1", name: "Camisetas", order: 1 },
  { id: "i2", categoryId: "c1", name: "Pantalones", order: 2 },
  { id: "i3", categoryId: "c1", name: "Ropa interior", order: 3 },
  { id: "i4", categoryId: "c1", name: "Calcetines", order: 4 },
  { id: "i6", categoryId: "c1", name: "Chaqueta", order: 5 },
  { id: "i7", categoryId: "c2", name: "Cepillo de dientes", order: 1 },
  { id: "i8", categoryId: "c2", name: "Pasta de dientes", order: 2 },
  { id: "i9", categoryId: "c2", name: "Desodorante", order: 3 },
  { id: "i11", categoryId: "c3", name: "Movil", order: 1 },
  { id: "i12", categoryId: "c3", name: "Cargador movil", order: 2 },
  { id: "i13", categoryId: "c3", name: "Auriculares", order: 3 },
  { id: "i15", categoryId: "c4", name: "DNI / Pasaporte", order: 1 },
  { id: "i16", categoryId: "c4", name: "Billetes / Reservas", order: 2 },
  { id: "i18", categoryId: "c5", name: "Tiritas", order: 1 },
  { id: "i19", categoryId: "c5", name: "Paracetamol", order: 2 },
];

export function generateId() {
  return Math.random().toString(36).slice(2, 11);
}

export function getRandomColor() {
  return CATEGORY_COLORS[Math.floor(Math.random() * CATEGORY_COLORS.length)];
}
