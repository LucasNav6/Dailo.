import Dexie from "dexie";

export const db = new Dexie("dailo");
db.version(1).stores({});
