import { request } from "@/api/http.js";
import { dbLoad } from "@/mock/db.js";

export const usersApi = {
  list() {
    return request();
  },
  login(account, password) {
    return request({
        url: "/house/user/login",
        method: "GET",
        params: { account, password },
    });
  }
};

