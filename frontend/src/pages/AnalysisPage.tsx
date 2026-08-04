import { useState, useRef } from 'react';
import { analyzeFace, predictSkinTone, recommendProducts, saveHistory, fetchAnalytics } from '../services/api';
import type { AnalysisResponse } from '../types';

export default function AnalysisPage() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [occasion, setOccasion] = useState('party');
  const [style, setStyle] = useState('soft glam');
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');

  function handleFile(file: File | null) {
    setImageFile(file);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0] ?? null;
    if (file?.type.startsWith('image/')) handleFile(file);
  }

  async function handleAnalyze() {
    if (!imageFile) return;
    try {
      setBusy(true);
      setStatus('Analyzing face...');
      const a = await analyzeFace(imageFile);
      setAnalysis(a);
      setStatus('Getting recommendations...');
      const rec = await recommendProducts({ user_id: 1, occasion, style_preference: style, skin_tone: a.skin_tone, undertone: a.undertone, face_shape: a.face_shape });
      await saveHistory({ user_id: 1, request_payload: { occasion, style_preference: style }, response_payload: rec, model_confidence: rec.confidence });
      await fetchAnalytics();
      setStatus('Complete');
    } catch (err) {
      setStatus(err instanceof Error ? err.message : 'Failed');
    } finally {
      setBusy(false);
    }
  }

  const attributes = analysis ? [
    { label: 'Skin Tone', value: analysis.skin_tone, color: 'bg-amber-50 text-amber-700' },
    { label: 'Undertone', value: analysis.undertone, color: 'bg-rose-50 text-rose-700' },
    { label: 'Face Shape', value: analysis.face_shape, color: 'bg-pink-50 text-pink-700' },
    { label: 'Lip Shape', value: analysis.lip_shape, color: 'bg-fuchsia-50 text-fuchsia-700' },
    { label: 'Eye Shape', value: analysis.eye_shape, color: 'bg-purple-50 text-purple-700' },
    { label: 'Confidence', value: `${Math.round(analysis.confidence * 100)}%`, color: 'bg-emerald-50 text-emerald-700' },
  ] : [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-semibold text-sand-900">Face Analysis</h1>
        <p className="mt-1 text-sm text-cocoa/55">Upload a photo to analyze your facial features and skin profile.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        {/* Upload */}
        <div className="space-y-6">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            className={`flex min-h-[320px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition ${
              dragging ? 'border-pink-400 bg-pink-50/50' : 'border-sand-200 bg-sand-50/30 hover:border-pink-300 hover:bg-pink-50/30'
            }`}
          >
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files?.[0] ?? null)} />
            {imagePreview ? (
              <img src={imagePreview} alt="preview" className="max-h-80 rounded-xl object-contain" />
            ) : (
              <div className="text-center">
                <svg className="mx-auto h-12 w-12 text-cocoa/25" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" />
                </svg>
                <p className="mt-3 text-sm font-medium text-cocoa/50">Drag & Drop</p>
                <p className="mt-1 text-xs text-cocoa/35">or <span className="text-pink-500">Browse Image</span></p>
              </div>
            )}
          </div>

          {/* Options */}
          <div className="rounded-2xl border border-sand-100 bg-white p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold text-cocoa/60 mb-2">Occasion</p>
                <div className="space-y-2">
                  {['wedding', 'party', 'office', 'casual'].map((o) => (
                    <label key={o} className="flex items-center gap-2.5 cursor-pointer">
                      <input type="radio" name="occasion" value={o} checked={occasion === o} onChange={(e) => setOccasion(e.target.value)} className="accent-sand-900" />
                      <span className="text-sm text-cocoa/70 capitalize">{o}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-cocoa/60 mb-2">Style</p>
                <div className="space-y-2">
                  {['natural', 'soft glam', 'bold'].map((s) => (
                    <label key={s} className="flex items-center gap-2.5 cursor-pointer">
                      <input type="radio" name="style" value={s} checked={style === s} onChange={(e) => setStyle(e.target.value)} className="accent-sand-900" />
                      <span className="text-sm text-cocoa/70 capitalize">{s}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <button disabled={busy || !imageFile} onClick={handleAnalyze} className="mt-5 w-full rounded-xl bg-sand-900 py-3 text-sm font-medium text-white transition hover:bg-sand-800 disabled:opacity-50">
              {busy ? 'Analyzing...' : 'Analyze Face'}
            </button>
            {status && <p className="mt-2 text-xs text-cocoa/50">{status}</p>}
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {attributes.length > 0 && (
            <div className="rounded-2xl border border-sand-100 bg-white p-6">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-cocoa/40">Face Attributes</h3>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {attributes.map((a) => (
                  <div key={a.label} className={`rounded-xl p-4 ${a.color.split(' ')[0]}`}>
                    <p className="text-xs text-cocoa/50">{a.label}</p>
                    <p className={`mt-1 text-sm font-semibold ${a.color.split(' ')[1]}`}>{a.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {analysis?.reasoning && (
            <div className="rounded-2xl border border-sand-100 bg-white p-6">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-cocoa/40">AI Reasoning</h3>
              <p className="mt-3 text-sm leading-relaxed text-cocoa/70">{analysis.reasoning}</p>
            </div>
          )}

          {!analysis && (
            <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-dashed border-sand-200 bg-sand-50/30 text-center">
              <div>
                <p className="text-sm text-cocoa/40">Upload a photo and click Analyze to see results</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
