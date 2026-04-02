import {
  Plane,
  UtensilsCrossed,
  Hotel,
  House,
  Landmark,
  Trees,
  Train,
  Bus,
  Car,
  Sparkles,
  Martini,
  Footprints,
} from "lucide-react";

export const ICONS = [
  { key: "plane", label: "Avion", icon: Plane },
  { key: "restaurant", label: "Restaurante", icon: UtensilsCrossed },
  { key: "hotel", label: "Hotel", icon: Hotel },
  { key: "home", label: "Casa", icon: House },
  { key: "museum", label: "Museo", icon: Landmark },
  { key: "park", label: "Parque", icon: Trees },
  { key: "train", label: "Tren", icon: Train },
  { key: "bus", label: "Bus", icon: Bus },
  { key: "car", label: "Coche", icon: Car },
  { key: "spa", label: "Spa", icon: Sparkles },
  { key: "cocktail", label: "Cocteleria", icon: Martini },
  { key: "walk", label: "Andando", icon: Footprints },
];

export const CATEGORY_COLOR_OPTIONS = [
  {
    id: "blue",
    label: "Azul",
    className: "blue",
    lightClassName: "bg-blue-100 text-blue-800 ring-blue-200",
    darkClassName: "bg-blue-500/18 text-blue-200 ring-blue-400/35",
    lightCardClassName: "border-slate-100 bg-blue-100 text-blue-800",
    darkCardClassName: "border-blue-500/25 bg-blue-500/10 text-blue-100",
    swatch: "bg-blue-500",
  },
  {
    id: "teal",
    label: "Turquesa",
    className: "teal",
    lightClassName: "bg-teal-100 text-teal-800 ring-teal-200",
    darkClassName: "bg-teal-500/18 text-teal-200 ring-teal-400/35",
    lightCardClassName: "border-slate-100 bg-teal-100 text-teal-800",
    darkCardClassName: "border-teal-500/25 bg-teal-500/10 text-teal-100",
    swatch: "bg-teal-500",
  },
  {
    id: "purple",
    label: "Morado",
    className: "purple",
    lightClassName: "bg-purple-100 text-purple-800 ring-purple-200",
    darkClassName: "bg-purple-500/18 text-purple-200 ring-purple-400/35",
    lightCardClassName: "border-slate-100 bg-purple-100 text-purple-800",
    darkCardClassName: "border-purple-500/25 bg-purple-500/10 text-purple-100",
    swatch: "bg-purple-500",
  },
  {
    id: "emerald",
    label: "Verde",
    className: "emerald",
    lightClassName: "bg-emerald-100 text-emerald-800 ring-emerald-200",
    darkClassName: "bg-emerald-500/18 text-emerald-200 ring-emerald-400/35",
    lightCardClassName: "border-slate-100 bg-emerald-100 text-emerald-800",
    darkCardClassName: "border-emerald-500/25 bg-emerald-500/10 text-emerald-100",
    swatch: "bg-emerald-500",
  },
  {
    id: "amber",
    label: "Amarillo",
    className: "amber",
    lightClassName: "bg-amber-100 text-amber-800 ring-amber-200",
    darkClassName: "bg-amber-500/18 text-amber-200 ring-amber-400/35",
    lightCardClassName: "border-slate-100 bg-amber-100 text-amber-800",
    darkCardClassName: "border-amber-500/25 bg-amber-500/10 text-amber-100",
    swatch: "bg-amber-500",
  },
  {
    id: "yellow",
    label: "Amarillo claro",
    className: "yellow",
    lightClassName: "bg-yellow-100 text-yellow-800 ring-yellow-200",
    darkClassName: "bg-yellow-500/18 text-yellow-200 ring-yellow-400/35",
    lightCardClassName: "border-slate-100 bg-yellow-100 text-yellow-800",
    darkCardClassName: "border-yellow-500/25 bg-yellow-500/10 text-yellow-100",
    swatch: "bg-yellow-500",
  },
  {
    id: "red",
    label: "Rojo",
    className: "red",
    lightClassName: "bg-red-100 text-red-800 ring-red-200",
    darkClassName: "bg-red-500/18 text-red-200 ring-red-400/35",
    lightCardClassName: "border-slate-100 bg-red-100 text-red-800",
    darkCardClassName: "border-red-500/25 bg-red-500/10 text-red-100",
    swatch: "bg-red-500",
  },
  {
    id: "fuchsia",
    label: "Fucsia",
    className: "fuchsia",
    lightClassName: "bg-fuchsia-100 text-fuchsia-800 ring-fuchsia-200",
    darkClassName: "bg-fuchsia-500/18 text-fuchsia-200 ring-fuchsia-400/35",
    lightCardClassName: "border-slate-100 bg-fuchsia-100 text-fuchsia-800",
    darkCardClassName: "border-fuchsia-500/25 bg-fuchsia-500/10 text-fuchsia-100",
    swatch: "bg-fuchsia-500",
  },
  {
    id: "rose",
    label: "Rosa",
    className: "rose",
    lightClassName: "bg-rose-100 text-rose-800 ring-rose-200",
    darkClassName: "bg-rose-500/18 text-rose-200 ring-rose-400/35",
    lightCardClassName: "border-slate-100 bg-rose-100 text-rose-800",
    darkCardClassName: "border-rose-500/25 bg-rose-500/10 text-rose-100",
    swatch: "bg-rose-500",
  },
  {
    id: "lime",
    label: "Lima",
    className: "lime",
    lightClassName: "bg-lime-100 text-lime-800 ring-lime-200",
    darkClassName: "bg-lime-500/18 text-lime-200 ring-lime-400/35",
    lightCardClassName: "border-slate-100 bg-lime-100 text-lime-800",
    darkCardClassName: "border-lime-500/25 bg-lime-500/10 text-lime-100",
    swatch: "bg-lime-500",
  },
  {
    id: "cyan",
    label: "Cian",
    className: "cyan",
    lightClassName: "bg-cyan-100 text-cyan-800 ring-cyan-200",
    darkClassName: "bg-cyan-500/18 text-cyan-200 ring-cyan-400/35",
    lightCardClassName: "border-slate-100 bg-cyan-100 text-cyan-800",
    darkCardClassName: "border-cyan-500/25 bg-cyan-500/10 text-cyan-100",
    swatch: "bg-cyan-500",
  },
  {
    id: "indigo",
    label: "Indigo",
    className: "indigo",
    lightClassName: "bg-indigo-100 text-indigo-800 ring-indigo-200",
    darkClassName: "bg-indigo-500/18 text-indigo-200 ring-indigo-400/35",
    lightCardClassName: "border-slate-100 bg-indigo-100 text-indigo-800",
    darkCardClassName: "border-indigo-500/25 bg-indigo-500/10 text-indigo-100",
    swatch: "bg-indigo-500",
  },
  {
    id: "violet",
    label: "Violeta",
    className: "violet",
    lightClassName: "bg-violet-100 text-violet-800 ring-violet-200",
    darkClassName: "bg-violet-500/18 text-violet-200 ring-violet-400/35",
    lightCardClassName: "border-slate-100 bg-violet-100 text-violet-800",
    darkCardClassName: "border-violet-500/25 bg-violet-500/10 text-violet-100",
    swatch: "bg-violet-500",
  },
  {
    id: "pink",
    label: "Rosa",
    className: "pink",
    lightClassName: "bg-pink-100 text-pink-800 ring-pink-200",
    darkClassName: "bg-pink-500/18 text-pink-200 ring-pink-400/35",
    lightCardClassName: "border-slate-100 bg-pink-100 text-pink-800",
    darkCardClassName: "border-pink-500/25 bg-pink-500/10 text-pink-100",
    swatch: "bg-pink-500",
  },
  {
    id: "orange",
    label: "Naranja",
    className: "orange",
    lightClassName: "bg-orange-100 text-orange-800 ring-orange-200",
    darkClassName: "bg-orange-500/18 text-orange-200 ring-orange-400/35",
    lightCardClassName: "border-slate-100 bg-orange-100 text-orange-800",
    darkCardClassName: "border-orange-500/25 bg-orange-500/10 text-orange-100",
    swatch: "bg-orange-500",
  },
];

export const CATEGORY_COLORS = CATEGORY_COLOR_OPTIONS.map((option) => option.id);

export const DEFAULT_CATEGORIES = [
  { id: "c1", name: "Ropa", color: "blue" },
  { id: "c2", name: "Aseo", color: "teal" },
  { id: "c3", name: "Electronica", color: "purple" },
  { id: "c4", name: "Documentos", color: "amber" },
  { id: "c5", name: "Botiquin", color: "red" },
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

export function normalizeCategoryColor(color) {
  if (!color) {
    return CATEGORY_COLOR_OPTIONS[0].id;
  }

  const directMatch = CATEGORY_COLOR_OPTIONS.find(
    (option) => option.id === color || option.className === color,
  );

  if (directMatch) {
    return directMatch.id;
  }

  const legacyMatch = CATEGORY_COLOR_OPTIONS.find((option) =>
    option.lightClassName.split(" ").every((token) => color.includes(token)),
  );

  return legacyMatch?.id ?? CATEGORY_COLOR_OPTIONS[0].id;
}

export function getColorOption(color) {
  const normalizedColor = normalizeCategoryColor(color);

  return (
    CATEGORY_COLOR_OPTIONS.find((option) => option.id === normalizedColor) ?? CATEGORY_COLOR_OPTIONS[0]
  );
}

export function getCategoryColorClasses(color, variant = "chip", theme = "light") {
  const option = getColorOption(color);
  const isDark = theme === "dark";

  if (variant === "card") {
    return isDark ? option.darkCardClassName : option.lightCardClassName;
  }

  return isDark ? option.darkClassName : option.lightClassName;
}
