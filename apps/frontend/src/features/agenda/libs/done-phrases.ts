export type DonePhrase = { lead: string; emphasis: string };

export const DONE_PHRASES: DonePhrase[] = [
  { lead: "Lo importante,", emphasis: "hecho." },
  { lead: "Lo esencial,", emphasis: "resuelto." },
  { lead: "Misión", emphasis: "cumplida." },
  { lead: "Tu día ya está", emphasis: "hecho." },
  { lead: "Ahora, a", emphasis: "respirar." },
  { lead: "Un buen día,", emphasis: "ganado." },
  { lead: "Lo difícil ya", emphasis: "pasó." },
  { lead: "Todo lo clave,", emphasis: "hecho." },
  { lead: "Buen trabajo", emphasis: "hoy." },
  { lead: "El resto es", emphasis: "ganancia." },
];

export function phraseFor(isoDate: string): DonePhrase {
  const seed = [...isoDate].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return DONE_PHRASES[seed % DONE_PHRASES.length];
}
