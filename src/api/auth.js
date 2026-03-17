import { request } from "@/api/http.js";
export const authApi = {
  login(phone, password) {
    const form = new FormData();
    form.append("phone", phone);
    form.append("password", password);
    return request({
        url: "/house/user/login",
        method: "POST",
        data: form,
      }
    );
  },      
};