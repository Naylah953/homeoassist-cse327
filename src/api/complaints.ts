import { api } from './client';

export interface Complaint {
  id: number;
  filed_by: string;
  filer_id: number;
  against: string;
  against_id: number;
  subject: string;
  description: string;
  status: 'open' | 'resolved' | 'dismissed';
  created_at: string;
}

export const complaintsApi = {
  list: (params?: { status?: string; page?: number }) => {
    const q = new URLSearchParams();
    if (params?.status) q.set('status', params.status);
    if (params?.page)   q.set('page', String(params.page));
    const qs = q.toString();
    return api.get<{ success: boolean; total: number; data: Complaint[] }>(
      `/complaints${qs ? '?' + qs : ''}`
    );
  },

  create: (data: { against: string; against_id: number; subject: string; description: string }) =>
    api.post<{ success: boolean; data: Complaint }>('/complaints', data),

  updateStatus: (id: number, status: 'open' | 'resolved' | 'dismissed') =>
    api.patch(`/complaints/${id}/status`, { status }),

  delete: (id: number) =>
    api.delete(`/complaints/${id}`),
};
