import axios from 'axios';

import type {
  AnalyticsResponse,
  AnalysisResponse,
  AuthResponse,
  ChatbotResponse,
  FeedbackPayload,
  HistoryPayload,
  LoginPayload,
  RecommendationPayload,
  RecommendationResponse,
  SignupPayload,
} from '../types';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000',
});

export function setApiToken(token: string | null) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

export async function register(payload: SignupPayload) {
  const { data } = await api.post<AuthResponse>('/auth/register', payload);
  return data;
}

export async function login(payload: LoginPayload) {
  const { data } = await api.post<AuthResponse>('/auth/login', payload);
  return data;
}

export async function analyzeFace(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await api.post<AnalysisResponse>('/analyze-face', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function predictSkinTone(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await api.post('/predict-skin-tone', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data as { skin_tone: string; undertone: string; confidence: number };
}

export async function recommendProducts(payload: RecommendationPayload) {
  const { data } = await api.post<RecommendationResponse>('/recommend-products', payload);
  return data;
}

export async function saveHistory(payload: HistoryPayload) {
  const { data } = await api.post('/save-history', payload);
  return data as { history_id: number; status: string };
}

export async function submitFeedback(payload: FeedbackPayload) {
  const { data } = await api.post('/user-feedback', payload);
  return data as { feedback_id: number; message: string; score: number };
}

export async function chatWithAssistant(message: string, userProfile?: Record<string, unknown>) {
  const { data } = await api.post<ChatbotResponse>('/chatbot', { message, user_profile: userProfile });
  return data;
}

export async function fetchAnalytics() {
  const { data } = await api.get<AnalyticsResponse>('/admin/analytics');
  return data;
}
