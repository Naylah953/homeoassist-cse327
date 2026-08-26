import { api } from './client';

export interface Medicine {
  m_id: number;
  m_txt: string;
  m_btxt: string | null;
  m_du: boolean;
}

export interface MedicinesResponse {
  success: boolean;
  total: number;
  page: number;
  limit: number;
  data: Medicine[];
}

export const medicinesApi = {
  list: (params?: { search?: string; featured?: boolean; page?: number; limit?: number }) => {
    const q = new URLSearchParams();
    if (params?.search)   q.set('search', params.search);
    if (params?.featured) q.set('featured', 'true');
    if (params?.page)     q.set('page', String(params.page));
    if (params?.limit)    q.set('limit', String(params.limit));
    const qs = q.toString();
    return api.get<MedicinesResponse>(`/medicines${qs ? '?' + qs : ''}`);
  },

  get: (id: number) => api.get<{ success: boolean; data: Medicine }>(`/medicines/${id}`),
};
