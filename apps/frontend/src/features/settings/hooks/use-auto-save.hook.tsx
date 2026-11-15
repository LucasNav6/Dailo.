import { useRef, useState } from "react";
import type { FieldErrors } from "@/models/setting.model";

export type SaveState = "idle" | "error";

/** Guardado automático: ejecuta `save` y expone un estado discreto y los errores por campo. */
export function useAutoSave() {
  const [state, setState] = useState<SaveState>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const latest = useRef(0);

  const run = async (save: () => Promise<FieldErrors>) => {
    const id = ++latest.current;
    try {
      const result = await save();
      if (id !== latest.current) return;
      setErrors(result);
      setState("idle");
    } catch {
      if (id !== latest.current) return;
      setState("error");
    }
  };
  return { state, errors, run };
}
