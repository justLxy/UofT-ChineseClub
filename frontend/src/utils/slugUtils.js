export const slugify = (text) => {
  if (!text) return '';
  return text
    .toString()
    .normalize('NFKD') // remove accents
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // replace non-alphanum with dashes
    .replace(/^-+|-+$/g, ''); // trim leading/trailing dashes
};
