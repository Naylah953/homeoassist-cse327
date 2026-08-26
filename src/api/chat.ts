import { api } from './client';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  created_at?: string;
}

export interface ChatSession {
  id: number;
  patient_id: number;
  doctor_id: number | null;
  appointment_id: number | null;
  summary: string | null;
  status: 'active' | 'completed';
  created_at: string;
  messages?: ChatMessage[];
}

export const chatApi = {
  startSession: (data?: { doctor_id?: number; appointment_id?: number }) =>
    api.post<{ success: boolean; data: ChatSession & { greeting: string } }>('/chat/session', data ?? {}),

  sendMessage: (sessionId: number, content: string) =>
    api.post<{ success: boolean; data: { role: string; content: string } }>(
      `/chat/session/${sessionId}/message`, { content }
    ),

  summarize: (sessionId: number) =>
    api.post<{ success: boolean; data: { summary: string } }>(
      `/chat/session/${sessionId}/summarize`, {}
    ),

  getSession: (sessionId: number) =>
    api.get<{ success: boolean; data: ChatSession }>(`/chat/session/${sessionId}`),

  listSessions: () =>
    api.get<{ success: boolean; data: ChatSession[] }>('/chat/sessions'),
};
