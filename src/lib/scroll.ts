// Jump to a stage by id — shared by the dot rail, the recap grid and the hero
// Contact chip. Honours reduced motion instead of always smooth-scrolling.
export const goTo = (id: string) => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.getElementById(id)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
};
