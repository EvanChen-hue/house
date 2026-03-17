/*
 * @Author: Evan sun1148526297@gmail.com
 * @Date: 2026-03-17 19:28:18
 * @LastEditors: Evan sun1148526297@gmail.com
 * @LastEditTime: 2026-03-17 19:49:18
 * @FilePath: \house\src\api\users.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { request } from "@/api/http.js";
import { dbLoad } from "@/mock/db.js";

export const usersApi = {
  // Unified list API for both mock and backend:
  // returns { records, total, current, size }
  userList({ page = 1, size = 10 } = {}) {
    const current = Number(page) || 1;
    const pageSize = Number(size) || 10;

    return request(
      {
        url: "/house/user/list",
        method: "GET",
        // GET should use query params; many backends ignore GET bodies.
        params: { page: current, size: pageSize },
      }
    );
  },
};

