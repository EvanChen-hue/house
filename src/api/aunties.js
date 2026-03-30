import { requestOrMock, request } from "@/api/http.js";
import { dbLoad, dbSave } from "@/mock/db.js";

async function urlToFile(url, filename = "image.png") {
  const res = await fetch(url);
  const blob = await res.blob();

  return new File([blob], filename, {
    type: blob.type,
  });
}

export const auntiesApi = {

  list({ page = 1, size = 10 } = {}) {
    const current = Number(page) || 1;
    const pageSize = Number(size) || 10;

    return request(
      {
        url: "/house/worker/list",
        method: "GET",
        // GET should use query params; many backends ignore GET bodies.
        params: { current, size: pageSize },
      }
    );
  },

 

 add(payload) {
    const from = new FormData();
    console.log(payload,' payload');

    
    from.append("categoryId", payload.categoryId );
    from.append("name", payload.name );
    from.append("phone", payload.phone );
    from.append("phoneIdCard", payload.phoneIdCard || '0xxx' );
    from.append("age", payload.age );
    from.append("intro", payload.intro );
    from.append("price", payload.price );
    from.append("avatarFile", payload.avatarFile.fileList[0].originFileObj);
    return request({
      url: "/house/worker/add",
      method: "POST",
      data: from,
      headers: {
        "accept": "*/*",
      },
    })
  },
  async put(payload) {
    const from = new FormData();
    console.log(payload,' payload');

    from.append("categoryId", payload.categoryId );
    from.append("id", payload.id );
    from.append("name", payload.name );
    from.append("phone", payload.phone );
    from.append("phoneIdCard", payload.phoneIdCard || '0xxx' );
    from.append("age", payload.age );
    from.append("intro", payload.intro );
    from.append("price", payload.price );
    from.append("avatarFile", typeof payload.avatarFile === "string" ? payload.avatarFile : payload.avatarFile.fileList[0].originFileObj );
    return request({
      url: "/house/worker/update",
      method: "put",
      data: from,
      headers: {
        "accept": "*/*",
      },
    })
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
    const from = new FormData();

    from.append("id", id );
    from.append("status", patch);
    return request({
      url: "/house/worker/update",
      method: "put",
      data: from,
    });
  },
};
