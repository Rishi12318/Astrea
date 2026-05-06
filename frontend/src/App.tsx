import { useEffect, useMemo, useState } from 'react';

import {
  analyzeFace,
  chatWithAssistant,
  fetchAnalytics,
  login,
  predictSkinTone,
  recommendProducts,
  register,
  saveHistory,
  setApiToken,
  submitFeedback,
} from './services/api';
import type { AnalysisResponse, ChatbotResponse, MakeupRecommendation, RecommendationResponse } from './types';
import type { AnalyticsResponse } from './types';

const palette = [
  { hex: '#FFD3D6', label: 'Rose Mist' },
  { hex: '#FFE5E7', label: 'Petal Veil' },
  { hex: '#F9DCC0', label: 'Soft Latte' },
  { hex: '#FFC6CA', label: 'Peony Blush' },
  { hex: '#F9E6E4', label: 'Powder Glow' },
  { hex: '#FFB0B5', label: 'Warm Bloom' },
];

const pipelineSteps = [
  'Face detection with MediaPipe/OpenCV',
  'Skin tone and undertone inference',
  'Style prediction and product ranking',
  'Explainable recommendation generation',
];

const initialEmail = 'demo@beauty.ai';

export default function App() {
  const [activeTab, setActiveTab] = useState<'analysis' | 'dashboard'>('analysis');
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('beauty1234');
  const [token, setTokenState] = useState<string>(() => localStorage.getItem('makeup_token') ?? '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [occasion, setOccasion] = useState('party');
  const [stylePreference, setStylePreference] = useState('soft glam');
  const [chatMessage, setChatMessage] = useState('Recommend a lipstick and foundation for warm undertone and soft glam look.');
  const [feedbackScore, setFeedbackScore] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('Great recommendation quality.');
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [toneCheck, setToneCheck] = useState<{ skin_tone: string; undertone: string; confidence: number } | null>(null);
  const [recommendation, setRecommendation] = useState<RecommendationResponse | null>(null);
  const [assistantReply, setAssistantReply] = useState<ChatbotResponse | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [statusMessage, setStatusMessage] = useState('Ready');
  const [busy, setBusy] = useState(false);

  const confidence = useMemo(() => Math.round((recommendation?.confidence ?? 0.94) * 100), [recommendation]);

  useEffect(() => {
    setApiToken(token || null);
  }, [token]);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  async function handleAuth(mode: 'register' | 'login') {
    try {
      setBusy(true);
      const auth = mode === 'register' ? await register({ email, password, full_name: 'Beauty Creator' }) : await login({ email, password });
      setTokenState(auth.access_token);
      localStorage.setItem('makeup_token', auth.access_token);
      const metrics = await fetchAnalytics();
      setAnalytics(metrics);
      setStatusMessage(`${mode === 'register' ? 'Registered' : 'Logged in'} successfully`);
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : 'Authentication failed');
    } finally {
      setBusy(false);
    }
  }

  async function handleFileChange(file: File | null) {
    setImageFile(file);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(file ? URL.createObjectURL(file) : null);
  }

  async function handleAnalyzeAndRecommend() {
    if (!imageFile) {
      setStatusMessage('Upload an image first');
      return;
    }

    try {
      setBusy(true);
      setStatusMessage('Analyzing face and building recommendations...');
      const faceAnalysis = await analyzeFace(imageFile);
      setAnalysis(faceAnalysis);

      const tone = await predictSkinTone(imageFile);
      setToneCheck(tone);

      const rec = await recommendProducts({
        user_id: 1,
        occasion,
        style_preference: stylePreference,
        skin_tone: faceAnalysis.skin_tone,
        undertone: faceAnalysis.undertone,
        face_shape: faceAnalysis.face_shape,
      });
      setRecommendation(rec);

      await saveHistory({
        user_id: 1,
        request_payload: {
          occasion,
          style_preference: stylePreference,
          skin_tone: faceAnalysis.skin_tone,
          undertone: faceAnalysis.undertone,
          face_shape: faceAnalysis.face_shape,
        },
        response_payload: rec,
        model_confidence: rec.confidence,
      });

      const metrics = await fetchAnalytics();
      setAnalytics(metrics);

      setStatusMessage('Recommendation flow completed');
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : 'Analysis failed');
    } finally {
      setBusy(false);
    }
  }

  async function handleChat() {
    try {
      setBusy(true);
      const reply = await chatWithAssistant(chatMessage, analysis ? { ...analysis, occasion, style_preference: stylePreference } : { occasion, style_preference: stylePreference });
      setAssistantReply(reply);
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : 'Chat failed');
    } finally {
      setBusy(false);
    }
  }

  async function handleFeedback() {
    try {
      setBusy(true);
      await submitFeedback({
        user_id: 1,
        product_id: undefined,
        score: feedbackScore,
        comment: feedbackComment,
      });
      setStatusMessage('Feedback saved');
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : 'Feedback failed');
    } finally {
      setBusy(false);
    }
  }

  const recommendations = recommendation?.products ?? [];

  return (
    <div className="min-h-screen overflow-hidden text-sand-900">
      <div className="relative mx-auto max-w-7xl px-4 py-5 md:px-8 lg:px-10">
        <div className="absolute left-8 top-8 h-40 w-40 rounded-full bg-sand-200/60 blur-3xl" />
        <div className="absolute right-0 top-24 h-56 w-56 rounded-full bg-latte/60 blur-3xl" />

        <header className="relative rounded-[2.5rem] border border-white/70 bg-white/70 p-5 shadow-soft backdrop-blur-xl md:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-[0.68rem] uppercase tracking-[0.45em] text-cocoa/65">Personalized makeup intelligence</p>
              <h1 className="mt-2 font-serif text-4xl leading-none tracking-tight text-sand-900 md:text-6xl">Glow of Beauty</h1>
              <p className="mt-3 max-w-2xl text-sm text-cocoa/90 md:text-base">
                A live beauty-tech demo that runs face analysis, product recommendation, feedback logging, and Ollama-assisted beauty chat from the same interface.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 rounded-[2rem] bg-sand-900 p-4 text-pearl shadow-glow md:min-w-[320px]">
              <Metric label="Confidence" value={`${confidence}%`} />
              <Metric label="Style matched" value={recommendation?.style ?? 'Soft glam'} />
              <Metric label="Catalog size" value="Seeded DB" />
              <Metric label="Chat assistant" value="Ollama" />
            </div>
          </div>
        </header>

        <main className="relative mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="space-y-6">
            <div className="grid gap-4 md:grid-cols-[0.86fr_1.14fr]">
              <div className="rounded-[2.4rem] border border-white/80 bg-white/75 p-4 shadow-soft backdrop-blur-xl">
                <div className="flex h-full min-h-[440px] flex-col justify-between rounded-[2rem] bg-[linear-gradient(180deg,#FFD3D6_0%,#FFE5E7_48%,#FFF7F8_100%)] p-5">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-[0.65rem] uppercase tracking-[0.35em] text-cocoa/70">
                      <span>Pastel color palette</span>
                      <span>Malibu escape</span>
                    </div>

                    <div className="grid grid-cols-6 gap-2 rounded-[1.5rem] bg-white/55 p-3 shadow-sm">
                      {palette.map((swatch) => (
                        <div key={swatch.hex} className="space-y-2 text-center">
                          <div className="h-24 rounded-2xl shadow-sm" style={{ background: swatch.hex }} />
                          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-cocoa/75">{swatch.hex}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 rounded-[2rem] border border-white/70 bg-white/65 p-4 shadow-soft">
                    <div className="grid grid-cols-2 gap-3 text-sm text-cocoa/85">
                      <div className="rounded-2xl bg-sand-50 p-3">
                        <p className="text-[0.68rem] uppercase tracking-[0.2em] text-cocoa/60">Skin tone</p>
                        <p className="mt-2 font-semibold text-sand-900">{analysis?.skin_tone ?? toneCheck?.skin_tone ?? 'Medium'}</p>
                      </div>
                      <div className="rounded-2xl bg-sand-50 p-3">
                        <p className="text-[0.68rem] uppercase tracking-[0.2em] text-cocoa/60">Undertone</p>
                        <p className="mt-2 font-semibold text-sand-900">{analysis?.undertone ?? toneCheck?.undertone ?? 'Warm'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[2.4rem] border border-white/80 bg-white/75 p-4 shadow-soft backdrop-blur-xl">
                <div className="relative min-h-[440px] overflow-hidden rounded-[2rem] bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.95),rgba(255,214,216,0.88),rgba(255,176,181,0.6))]">
                  <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.12),rgba(255,255,255,0))]" />
                  <div className="absolute left-4 top-4 rounded-full bg-white/80 px-3 py-1 text-[0.68rem] font-medium text-cocoa shadow-sm">@beautytech</div>
                  <div className="absolute right-4 top-4 rounded-full bg-white/80 px-3 py-1 text-[0.68rem] font-medium text-cocoa shadow-sm">AI recommendation</div>

                  <div className="absolute left-5 top-18 h-40 w-36 rounded-[2rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.7),rgba(255,227,230,0.35))] p-3 shadow-soft backdrop-blur-md">
                    <div className="h-full rounded-[1.5rem] bg-[linear-gradient(180deg,#F9DCC0,#FFB0B5)]" />
                  </div>
                  <div className="absolute right-6 top-16 h-36 w-36 rounded-[2rem] bg-white/50 p-3 shadow-soft backdrop-blur-md">
                    <div className="h-full rounded-[1.5rem] bg-[radial-gradient(circle_at_top,#fff,#f9dce0,#ffc6ca)]" />
                  </div>
                  <div className="absolute bottom-10 left-1/2 w-[82%] -translate-x-1/2 rounded-[2rem] bg-white/80 p-5 text-center shadow-soft backdrop-blur-md">
                    <p className="text-[0.72rem] uppercase tracking-[0.35em] text-cocoa/55">Live beauty workflow</p>
                    <h2 className="mt-2 font-serif text-3xl leading-tight text-sand-900 md:text-5xl">Beauty is personal, intelligent, and expressive.</h2>
                    <p className="mt-3 text-sm text-cocoa/85">Upload a face image, get recommendations, ask Ollama a beauty question, and save feedback to improve ranking quality.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[2.5rem] border border-white/80 bg-white/75 p-5 shadow-soft backdrop-blur-xl md:p-6">
              <div className="flex flex-wrap items-center gap-3">
                <TabButton active={activeTab === 'analysis'} onClick={() => setActiveTab('analysis')}>
                  Face analysis
                </TabButton>
                <TabButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')}>
                  Recommendation dashboard
                </TabButton>
              </div>

              {activeTab === 'analysis' ? (
                <div className="mt-6 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
                  <div className="rounded-[2rem] border border-sand-100 bg-gradient-to-br from-white to-sand-50 p-5 shadow-sm">
                    <div className="flex h-64 items-center justify-center rounded-[1.75rem] border border-dashed border-sand-200 bg-white/70 text-center">
                      <label className="cursor-pointer rounded-full bg-sand-900 px-5 py-3 text-sm font-medium text-white shadow-glow transition hover:translate-y-[-1px]">
                        Upload face image
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(event) => handleFileChange(event.target.files?.[0] ?? null)}
                        />
                      </label>
                    </div>
                    <p className="mt-4 text-sm text-cocoa/75">{imageFile?.name ?? 'No file selected'}</p>
                    {imagePreview ? <img src={imagePreview} alt="preview" className="mt-4 h-44 w-full rounded-[1.5rem] object-cover shadow-sm" /> : null}

                    <div className="mt-5 grid gap-3">
                      <div className="grid grid-cols-2 gap-3">
                        <label className="text-xs text-cocoa/70">
                          Occasion
                          <input className="mt-1 w-full rounded-2xl border border-sand-200 bg-white px-3 py-2 text-sm" value={occasion} onChange={(event) => setOccasion(event.target.value)} />
                        </label>
                        <label className="text-xs text-cocoa/70">
                          Style
                          <input className="mt-1 w-full rounded-2xl border border-sand-200 bg-white px-3 py-2 text-sm" value={stylePreference} onChange={(event) => setStylePreference(event.target.value)} />
                        </label>
                      </div>
                      <button disabled={busy} onClick={handleAnalyzeAndRecommend} className="rounded-full bg-sand-900 px-5 py-3 text-sm font-medium text-white shadow-glow transition hover:translate-y-[-1px] disabled:opacity-60">
                        {busy ? 'Processing...' : 'Analyze & Recommend'}
                      </button>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <InfoPill label="Face shape" value={analysis?.face_shape ?? 'Oval'} />
                      <InfoPill label="Eye shape" value={analysis?.eye_shape ?? 'Almond'} />
                      <InfoPill label="Lip shape" value={analysis?.lip_shape ?? 'Balanced'} />
                      <InfoPill label="Confidence" value={`${analysis?.confidence ? Math.round(analysis.confidence * 100) : 94}%`} />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Panel title="Analysis output">
                      <ResultRow label="Skin tone" value={analysis?.skin_tone ?? 'Medium'} />
                      <ResultRow label="Undertone" value={analysis?.undertone ?? 'Warm'} />
                      <ResultRow label="Face shape" value={analysis?.face_shape ?? 'Oval'} />
                      <ResultRow label="Eye shape" value={analysis?.eye_shape ?? 'Almond'} />
                      <ResultRow label="Lip shape" value={analysis?.lip_shape ?? 'Balanced'} />
                    </Panel>
                    <Panel title="Explainable AI reasoning">
                      <p className="text-sm leading-6 text-cocoa/85">
                        {analysis?.reasoning ?? 'This lipstick shade complements warm undertones and the oval face structure, while the foundation finish is tuned for a medium skin tone with neutral-light reflectance.'}
                      </p>
                    </Panel>
                    <Panel title="Recommended style">
                      <div className="flex items-center justify-between rounded-[1.25rem] bg-sand-50 px-4 py-3">
                        <span className="text-sm text-cocoa/75">Predicted makeup style</span>
                        <span className="font-semibold text-sand-900">{recommendation?.style ?? 'Soft glam'}</span>
                      </div>
                    </Panel>
                    <Panel title="System status">
                      <div className="text-sm text-cocoa/80">{statusMessage}</div>
                    </Panel>
                  </div>
                </div>
              ) : (
                <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_0.9fr]">
                  <Panel title="Top product recommendations">
                    <div className="space-y-4">
                      {recommendations.length ? recommendations.map((item: MakeupRecommendation, index: number) => (
                        <div key={item.name} className="rounded-[1.5rem] border border-sand-100 bg-white p-4 shadow-sm">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sand-100 text-xs font-semibold text-sand-900">{index + 1}</span>
                                <p className="font-semibold text-sand-900">{item.name}</p>
                              </div>
                              <p className="mt-2 text-sm text-cocoa/75">{item.category} · {item.shade}</p>
                              <p className="mt-2 text-xs text-cocoa/65">{recommendation?.products[index]?.reason}</p>
                            </div>
                            <span className="rounded-full bg-sand-900 px-3 py-1 text-xs font-medium text-white">{Math.round(item.score * 100)}%</span>
                          </div>
                        </div>
                      )) : <p className="text-sm text-cocoa/75">Run analysis to see ranked products from the seeded catalog.</p>}
                    </div>
                  </Panel>

                  <div className="space-y-4">
                    <Panel title="Pipeline overview">
                      <ol className="space-y-4 text-sm text-cocoa/80">
                        {pipelineSteps.map((step, index) => (
                          <li key={step} className="flex gap-3">
                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sand-900 text-xs text-white">{index + 1}</span>
                            <span className="pt-1">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </Panel>
                    <Panel title="Seasonal tone match">
                      <div className="rounded-[1.25rem] bg-gradient-to-r from-sand-100 to-sand-50 p-4 text-sm text-cocoa/85">
                        Warm undertones are paired with peach, rose, and soft bronze tones for a more polished editorial finish.
                      </div>
                    </Panel>
                    <Panel title="Feedback loop">
                      <div className="space-y-3">
                        <label className="text-xs text-cocoa/70">
                          Rating
                          <input type="range" min="1" max="5" value={feedbackScore} onChange={(event) => setFeedbackScore(Number(event.target.value))} className="mt-2 w-full" />
                        </label>
                        <label className="block text-xs text-cocoa/70">
                          Comment
                          <textarea className="mt-1 min-h-24 w-full rounded-2xl border border-sand-200 bg-white p-3 text-sm" value={feedbackComment} onChange={(event) => setFeedbackComment(event.target.value)} />
                        </label>
                        <button disabled={busy} onClick={handleFeedback} className="w-full rounded-full border border-sand-900 px-5 py-3 text-sm font-medium text-sand-900 transition hover:bg-sand-900 hover:text-white disabled:opacity-60">
                          Save feedback
                        </button>
                      </div>
                    </Panel>
                  </div>
                </div>
              )}
            </div>
          </section>

          <aside className="space-y-6">
            <Panel title="System signals">
              <SummaryStat label="Most recommended" value={recommendation?.products[0]?.category ?? 'Foundation'} />
              <SummaryStat label="Products cataloged" value={`${analytics?.products ?? 6}`} />
              <SummaryStat label="Recommendation history" value={`${analytics?.recommendation_history ?? 0}`} />
              <SummaryStat label="Feedback entries" value={`${analytics?.feedback ?? 0}`} />
            </Panel>

            <Panel title="Authentication">
              <div className="space-y-3 text-sm text-cocoa/80">
                <label className="block text-xs text-cocoa/70">
                  Email
                  <input className="mt-1 w-full rounded-2xl border border-sand-200 bg-white px-3 py-2 text-sm" value={email} onChange={(event) => setEmail(event.target.value)} />
                </label>
                <label className="block text-xs text-cocoa/70">
                  Password
                  <input type="password" className="mt-1 w-full rounded-2xl border border-sand-200 bg-white px-3 py-2 text-sm" value={password} onChange={(event) => setPassword(event.target.value)} />
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button disabled={busy} onClick={() => handleAuth('register')} className="rounded-full bg-sand-900 px-4 py-2 text-sm text-white disabled:opacity-60">Register</button>
                  <button disabled={busy} onClick={() => handleAuth('login')} className="rounded-full border border-sand-900 px-4 py-2 text-sm text-sand-900 disabled:opacity-60">Login</button>
                </div>
                <p className="text-xs text-cocoa/65">Token status: {token ? 'Authenticated' : 'Not signed in'}</p>
              </div>
            </Panel>

            <Panel title="Beauty assistant">
              <div className="space-y-3 text-sm text-cocoa/80">
                <textarea className="min-h-32 w-full rounded-2xl border border-sand-200 bg-white p-3 text-sm" value={chatMessage} onChange={(event) => setChatMessage(event.target.value)} />
                <button disabled={busy} onClick={handleChat} className="w-full rounded-full bg-sand-900 px-5 py-3 text-sm font-medium text-white disabled:opacity-60">
                  Ask Ollama assistant
                </button>
                <div className="rounded-[1.25rem] bg-sand-50 p-4">
                  <p className="text-[0.7rem] uppercase tracking-[0.22em] text-cocoa/60">Assistant response</p>
                  <p className="mt-2 text-sm text-cocoa/85">{assistantReply?.answer ?? 'Ask a beauty question to get a recommendation-focused response.'}</p>
                  {assistantReply ? <p className="mt-2 text-xs text-cocoa/60">Sources: {assistantReply.citations.join(', ')}</p> : null}
                </div>
              </div>
            </Panel>

            <Panel title="Backend features">
              <ul className="space-y-3 text-sm text-cocoa/80">
                <li>FastAPI REST APIs with JWT authentication</li>
                <li>PostgreSQL-ready persistence layer</li>
                <li>GPU-capable PyTorch inference pipeline</li>
                <li>Feedback loop for future re-ranking</li>
              </ul>
            </Panel>
          </aside>
        </main>
      </div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[2rem] border border-white/80 bg-white/78 p-5 shadow-soft backdrop-blur-xl">
      <h2 className="text-[0.75rem] font-semibold uppercase tracking-[0.28em] text-cocoa/65">{title}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[0.68rem] uppercase tracking-[0.22em] text-pearl/70">{label}</p>
      <p className="mt-1 text-lg font-semibold text-pearl">{value}</p>
    </div>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-5 py-2 text-sm font-medium transition ${active ? 'bg-sand-900 text-white shadow-glow' : 'bg-sand-100 text-sand-800 hover:bg-sand-200'}`}
    >
      {children}
    </button>
  );
}

function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-[1.15rem] bg-sand-50 px-4 py-3">
      <span className="text-sm text-cocoa/75">{label}</span>
      <span className="font-semibold text-sand-900">{value}</span>
    </div>
  );
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-sand-100 py-3 last:border-b-0">
      <span className="text-sm text-cocoa/75">{label}</span>
      <span className="font-semibold text-sand-900">{value}</span>
    </div>
  );
}

function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.15rem] border border-sand-100 bg-white px-3 py-3 shadow-sm">
      <p className="text-[0.62rem] uppercase tracking-[0.18em] text-cocoa/60">{label}</p>
      <p className="mt-1 text-sm font-semibold text-sand-900">{value}</p>
    </div>
  );
}
