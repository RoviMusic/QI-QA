// Normalizar categorías para comparación
// Esta función normaliza las categorías para que sean comparables
export const normalizedCategories = (category: string): string => {
  return category
    .trim() // Quitar espacios al inicio/final
    .replace(/\s*[/>]\s*/g, "/") // Reemplazar >> o / (con espacios) por /
    .replace(/\/+/g, "/") // Reemplazar múltiples / por una sola
    .replace(/\/$/, "") // Quitar / al final si existe
    .toLowerCase(); // Convertir a minúsculas para comparar
};
