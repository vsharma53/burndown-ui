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