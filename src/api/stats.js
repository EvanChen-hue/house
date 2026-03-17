import { requestOrMock } from "@/api/http.js";
import { dbLoad } from "@/mock/db.js";

export const statsApi = {
  getDashboard() {
    return requestOrMock(
      () => {
        const db = dbLoad();
        const activeAunties = db.aunties.filter((a) => a.active).length;
        return {
          kpi: {
            monthRevenue: "¥248,900",
            totalOrders: "1,284",
            fiveStar: "98.6%",
            activeAunties: String(activeAunties),
          },
          revenueSeries: [
            { month: "1月", value: 120 },
            { month: "2月", value: 132 },
            { month: "3月", value: 161 },
            { month: "4月", value: 188 },
            { month: "5月", value: 220 },
            { month: "6月", value: 248 },
            { month: "7月", value: 260 },
            { month: "8月", value: 275 },
            { month: "9月", value: 290 },
          ],
        };
      },
      { url: "/stats/dashboard", method: "GET" }
    );
  },
};
