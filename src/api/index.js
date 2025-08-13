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
    const response = await apiClient.get(GET_BURNDOWN, { params });
    return response.data;
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