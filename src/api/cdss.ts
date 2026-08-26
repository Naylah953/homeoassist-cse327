import { api } from './client';

export interface CDSSRecommendation {
  medicine_id: number;
  name: string;
  score: number;
  potency: string;
  dosage: string;
  indications: string[];
  note: string;
}

export const cdssApi = {
  recommend: (symptoms: string[]) =>
    api.post<{ success: boolean; count: number; data: CDSSRecommendation[] }>(
      '/cdss/recommend', { symptoms }
    ),

  recommendFromSession: (session_id: number) =>
    api.post<{ success: boolean; count: number; data: CDSSRecommendation[] }>(
      '/cdss/recommend-from-session', { session_id }
    ),
};
