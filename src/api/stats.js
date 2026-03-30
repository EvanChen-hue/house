import { request } from "@/api/http.js";

export const statsApi = {
  // Get overview statistics: total sales, orders, etc.
  getOverview() {
    return request({
      url: "/house/admin/statistics/overview",
      method: "GET",
    });
  },

  // Get 7-day order trend data
  getTrend() {
    return request({
      url: "/house/admin/statistics/trend",
      method: "GET",
    });
  },
};
