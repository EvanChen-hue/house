import axios from "axios";
import { clearToken, getToken } from "@/utils/storage.js";
import { notifyError } from "@/utils/appMessage.js";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Default to mock so the UI can run standalone. Set `VITE_USE_MOCK=0` to call backend APIs.
export const USE_MOCK = String(import.meta.env.VITE_USE_MOCK ?? "1") !== "0";

export async function mockRequest(fn, { latency = 180 } = {}) {
  await sleep(latency);
  return fn();
}

function isEnvelope(payload) {
  if (!payload || typeof payload !== "object") return false;
  return (
    ("code" in payload || "statusCode" in payload) &&
    ("message" in payload || "msg" in payload)
  );
}

function unwrap(payload) {
  if (!isEnvelope(payload)) return payload;
  const code = payload.code ?? payload.statusCode;
  const message = payload.message ?? payload.msg ?? "Request failed";
  const ok = code === 0 || code === 200;
  if (!ok) {
    const err = new Error(message);
    err.code = code;
    err.payload = payload;
    throw err;
  }
  return payload.data ?? payload.result ?? null;
}

function rejectWithToast(error, fallbackMessage) {
  return Promise.reject(notifyError(error, fallbackMessage));
}

export const http = axios.create({
  timeout: 15000,
  baseURL: '/api',
});

http.interceptors.request.use((config) => {
  const token = getToken();
  console.log(import.meta.env.VITE_API_BASE_URL, 'import.meta.env.VITE_API_BASE_URL');
  
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (response) => {
    try {
      return unwrap(response.data);
    } catch (error) {
      return rejectWithToast(error, "请求失败，请稍后再试");
    }
  },
  (error) => {
    const status = error?.response?.status;
    const payload = error?.response?.data;

    if (status === 401) {
      // clearToken();
      // Let UI decide how to navigate; avoids importing router in API layer.
      window?.dispatchEvent?.(new Event("hk:unauthorized"));
      return rejectWithToast(new Error("登录已过期，请重新登录"));
    }
    if (status === 403) return rejectWithToast(new Error("无权限访问该资源"));
    if (status === 404) return rejectWithToast(new Error("接口不存在（404）"));
    if (status >= 500) return rejectWithToast(new Error("服务器异常，请稍后再试"));

    // Business envelope with non-ok code
    try {
      if (payload) unwrap(payload);
    } catch (e) {
      return rejectWithToast(e, "请求失败，请稍后再试");
    }

    if (error?.message?.includes("timeout")) {
      return rejectWithToast(new Error("请求超时，请检查网络"));
    }
    return rejectWithToast(
      new Error(error?.message || "网络异常，请稍后再试"),
      "网络异常，请稍后再试"
    );
  }
);

export function request(config) {
  return http.request(config);
}

export function requestOrMock(mockFn, axiosConfig) {
  if (USE_MOCK) return mockRequest(mockFn);
  return request(axiosConfig);
}
