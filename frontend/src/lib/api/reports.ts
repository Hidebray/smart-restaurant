import { api } from "./api";

export const getSummary = async (from?: string, to?: string) => {
  const query = new URLSearchParams();
  if (from) query.append("from", from);
  if (to) query.append("to", to);
  const response = await api.get(`/reports/summary?${query.toString()}`);
  return response.data;
};

export const getTopProducts = async (take = 5) => {
  const response = await api.get(`/reports/top-products?take=${take}`);
  return response.data;
};

export const reportsApi = {
  revenue: (params: any) =>
    api.get("/reports/revenue", { params }).then((r) => r.data),

  topProducts: (params: any) =>
    api.get("/reports/top-products", { params }).then((r) => r.data),
};
