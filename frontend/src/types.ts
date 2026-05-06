export type MakeupRecommendation = {
  name: string;
  category: string;
  shade: string;
  score: number;
};

export type AuthResponse = {
  access_token: string;
  token_type: 'bearer';
};

export type SignupPayload = {
  email: string;
  password: string;
  full_name?: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type AnalysisResponse = {
  skin_tone: string;
  undertone: string;
  face_shape: string;
  eye_shape: string;
  lip_shape: string;
  confidence: number;
  reasoning: string;
};

export type RecommendationPayload = {
  user_id: number;
  occasion?: string;
  style_preference?: string;
  skin_tone?: string;
  undertone?: string;
  face_shape?: string;
};

export type RecommendationResponse = {
  style: string;
  confidence: number;
  products: MakeupRecommendation[];
};

export type HistoryPayload = {
  user_id: number;
  request_payload: Record<string, unknown>;
  response_payload: Record<string, unknown>;
  model_confidence?: number;
};

export type FeedbackPayload = {
  user_id: number;
  product_id?: number;
  score: number;
  comment?: string;
};

export type ChatbotResponse = {
  answer: string;
  confidence: number;
  citations: string[];
};

export type AnalyticsResponse = {
  users: number;
  products: number;
  recommendation_history: number;
  feedback: number;
  model_confidence: number;
  top_categories: string[];
};
