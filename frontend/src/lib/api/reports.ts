import { api } from './api';

export const getSummary = async () => {
  const response = await api.get('/reports/summary');
  return response.data;
};

export const getTopProducts = async (take = 5) => {
  const response = await api.get(`/reports/top-products?take=${take}`);
  return response.data;
};
