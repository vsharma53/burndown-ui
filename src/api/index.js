import axios from "axios";
import {
  ADD_PTO,
  GET_BURNDOWN,
  GET_HOLIDAYS,
  GET_CHART_BURNDOWN,
  API_BASE_URL
} from "./apiConstants";

const baseURL = API_BASE_URL;

const apiClient = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" }
});

// ---- Global API notifications (success/error/loading) ----
let inflightRequestCount = 0;

function emitLoadingChange() {
  try {
    window.dispatchEvent(
      new CustomEvent("api:loading", { detail: { inflight: inflightRequestCount } })
    );
  } catch (_) {}
}

function emitSuccess(message) {
  try {
    window.dispatchEvent(new CustomEvent("api:success", { detail: { message } }));
  } catch (_) {}
}

function emitError(message) {
  try {
    window.dispatchEvent(new CustomEvent("api:error", { detail: { message } }));
  } catch (_) {}
}

apiClient.interceptors.request.use((config) => {
  inflightRequestCount += 1;
  emitLoadingChange();
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    inflightRequestCount = Math.max(0, inflightRequestCount - 1);
    emitLoadingChange();
    const url = response?.config?.url || "";
    emitSuccess(`Success: ${url}`);
    return response;
  },
  (error) => {
    inflightRequestCount = Math.max(0, inflightRequestCount - 1);
    emitLoadingChange();
    const url = error?.config?.url || "";
    const status = error?.response?.status;
    const msg = error?.response?.data?.message || error?.message || "Request failed";
    emitError(`Error ${status || ""}: ${url} - ${msg}`);
    return Promise.reject(error);
  }
);

export const addPto = async (data) => {
  try {
    const response = await apiClient.post(ADD_PTO, data);
    return response.data;
  } catch (error) {
    throw error?.response?.data ?? error;
  }
};

export const getBurndown = async (params = {}) => {
  try {
    const response = await apiClient.get(GET_BURNDOWN, {
      params,
      responseType: "arraybuffer"
    });

    const contentType =
      response.headers["content-type"] ||
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

    const blob = new Blob([response.data], { type: contentType });

    const cd = response.headers["content-disposition"] || "";
    const match = cd.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/i);
    const filename = match ? match[1].replace(/['"]/g, "") : "burndown.xlsx";

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

    return { filename };
  } catch (error) {
    throw error?.response?.data ?? error;
  }
};

export const getHolidays = async (params = {}) => {
  try {
    const response = await apiClient.get(GET_HOLIDAYS, { params });
    return response.data;
  } catch (error) {
    throw error?.response?.data ?? error;
  }
};

export const getChartBurndown = async (params = {}) => {
  try {
    const response = await apiClient.get(GET_CHART_BURNDOWN, { params });
    return response.data;
  } catch (error) {
    throw error?.response?.data ?? error;
  }
};

export default {
  addPto,
  getBurndown,
  getHolidays,
  getChartBurndown
};