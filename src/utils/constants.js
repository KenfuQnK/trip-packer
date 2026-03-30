import {
  CalendarDays,
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
    className: "bg-blue-100 text-blue-800 ring-blue-200",
    swatch: "bg-blue-500",
  },
  {
    id: "teal",
    label: "Turquesa",
    className: "bg-teal-100 text-teal-800 ring-teal-200",
    swatch: "bg-teal-500",
  },
  {
    id: "purple",
    label: "Morado",
    className: "bg-purple-100 text-purple-800 ring-purple-200",
    swatch: "bg-purple-500",
  },
  {
    id: "emerald",
    label: "Verde",
    className: "bg-emerald-100 text-emerald-800 ring-emerald-200",
    swatch: "bg-emerald-500",
  },
  {
    id: "amber",
    label: "Amarillo",
    className: "bg-amber-100 text-amber-800 ring-amber-200",
    swatch: "bg-amber-500",
  },
  {
    id: "yellow",
    label: "Amarillo claro",
    className: "bg-yellow-100 text-yellow-800 ring-yellow-200",
    swatch: "bg-yellow-500",
  },
  {
    id: "red",
    label: "Rojo",
    className: "bg-red-100 text-red-800 ring-red-200",
    swatch: "bg-red-500",
  },
  {
    id: "fuchsia",
    label: "Fucsia",
    className: "bg-fuchsia-100 text-fuchsia-800 ring-fuchsia-200",
    swatch: "bg-fuchsia-500",
  },
  {
    id: "rose",
    label: "Rosa",
    className: "bg-rose-100 text-rose-800 ring-rose-200",
    swatch: "bg-rose-500",
  },
  {
    id: "lime",
    label: "Lima",
    className: "bg-lime-100 text-lime-800 ring-lime-200",
    swatch: "bg-lime-500",
  },
  {
    id: "cyan",
    label: "Cian",
    className: "bg-cyan-100 text-cyan-800 ring-cyan-200",
    swatch: "bg-cyan-500",
  },
  {
    id: "indigo",
    label: "Indigo",
    className: "bg-indigo-100 text-indigo-800 ring-indigo-200",
    swatch: "bg-indigo-500",
  },
  {
    id: "violet",
    label: "Violeta",
    className: "bg-violet-100 text-violet-800 ring-violet-200",
    swatch: "bg-violet-500",
  },
  {
    id: "pink",
    label: "Rosa",
    className: "bg-pink-100 text-pink-800 ring-pink-200",
    swatch: "bg-pink-500",
  },
  {
    id: "orange",
    label: "Naranja",
    className: "bg-orange-100 text-orange-800 ring-orange-200",
    swatch: "bg-orange-500",
  },
];

export const CATEGORY_COLORS = CATEGORY_COLOR_OPTIONS.map((option) => option.className);

export const DEFAULT_CATEGORIES = [
  { id: "c1", name: "Ropa", color: "bg-blue-100 text-blue-800" },
  { id: "c2", name: "Aseo", color: "bg-teal-100 text-teal-800" },
  { id: "c3", name: "Electronica", color: "bg-purple-100 text-purple-800" },
  { id: "c4", name: "Documentos", color: "bg-amber-100 text-amber-800" },
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

export function getColorOption(color) {
  return CATEGORY_COLOR_OPTIONS.find((option) => option.className === color) ?? CATEGORY_COLOR_OPTIONS[0];
}

