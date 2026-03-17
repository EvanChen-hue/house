import { request } from "@/api/http.js";

export const usersApi = {
  list() {
    return request();
  },
  userList(page, size) {
    return request({
        url: "/house/user/list",
        method: "get",
        data: { page, size },
    });
  }
};

