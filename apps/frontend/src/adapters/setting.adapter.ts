import { db } from "./database"

export const settingAdapter = {
  get: (key: string) => db.settings.get(key),
  set: (key: string, value: unknown) => db.settings.put({ key, value }),
}
