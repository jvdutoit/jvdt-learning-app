export const isKidsTest = (def) => {
  if (!def) return false;
  return def.methodology === "jvdt-2-kids" || (def.id ?? "").startsWith("jvdt-2");
};