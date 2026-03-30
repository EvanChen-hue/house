import { request } from "@/api/http.js";

export const ordersApi = {
  // List orders with pagination
  list({ current = 1, size = 10, orderNo = "" } = {}) {
    const nextCurrent = Number(current) || 1;
    const pageSize = Number(size) || 10;

    return request({
      url: "/house/order/list",
      method: "GET",
      params: {
        current: nextCurrent,
        size: pageSize,
        ...(orderNo ? { orderNo } : {}),
      },
    });
  },
  remove(id) {
    return request({
      url: `/house/order/remove/${id}`,
      method: "DELETE",
    });
  },
};
