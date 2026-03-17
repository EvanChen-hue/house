import { requestOrMock } from "@/api/http.js";
import { dbLoad, dbSave } from "@/mock/db.js";

export const auntiesApi = {
  list() {
    return requestOrMock(
      () => dbLoad().aunties,
      { url: "/aunties", method: "GET" }
    );
  },
  create(payload) {
    return requestOrMock(
      () => {
        const db = dbLoad();
        const next = {
          ...payload,
          id: `a-${Date.now()}`,
          active: true,
        };
        return dbSave({ ...db, aunties: [next, ...db.aunties] }).aunties;
      },
      { url: "/aunties", method: "POST", data: payload }
    );
  },
  update(id, patch) {
    return requestOrMock(
      () => {
        const db = dbLoad();
        const aunties = db.aunties.map((a) =>
          a.id === id ? { ...a, ...patch } : a
        );
        dbSave({ ...db, aunties });
        return true;
      },
      { url: `/aunties/${id}`, method: "PATCH", data: patch }
    );
  },
};
