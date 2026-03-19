
export const parseSlug = (slug: string | null | undefined) => {
  if (!slug) return { id: null, title: "" };

  const parts = slug.split("-");

  const id = parts.slice(0, 5).join("-");
  
  const title = parts
    .slice(5) 
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return { id, title };
};

export const createSlug = (id: string | number, title: string) => {
  const cleanTitle = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

  return `${id}-${cleanTitle}`;
};