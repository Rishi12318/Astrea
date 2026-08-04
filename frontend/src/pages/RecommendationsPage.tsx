import { useState } from 'react';
import { recommendProducts } from '../services/api';
import type { MakeupRecommendation, RecommendationResponse } from '../types';

export default function RecommendationsPage() {
  const [recommendation, setRecommendation] = useState<RecommendationResponse | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleGenerate() {
    try {
      setBusy(true);
      const rec = await recommendProducts({ user_id: 1, occasion: 'party', style_preference: 'soft glam' });
      setRecommendation(rec);
    } catch {
    } finally {
      setBusy(false);
    }
  }

  const products = recommendation?.products ?? [];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-sand-900">Recommendations</h1>
          <p className="mt-1 text-sm text-cocoa/55">Personalized product matches based on your profile.</p>
        </div>
        <button disabled={busy} onClick={handleGenerate} className="rounded-xl bg-sand-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-sand-800 disabled:opacity-50">
          {busy ? 'Generating...' : 'Generate Recommendations'}
        </button>
      </div>

      {products.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-4 rounded-2xl bg-sand-50 p-4">
            <div className="rounded-xl bg-sand-900 px-4 py-2 text-sm font-medium text-white">{recommendation?.style}</div>
            <p className="text-sm text-cocoa/60">Confidence: {Math.round((recommendation?.confidence ?? 0) * 100)}%</p>
          </div>
          {products.map((item: MakeupRecommendation, i: number) => (
            <div key={item.name} className="rounded-2xl border border-sand-100 bg-white p-6 transition hover:shadow-md">
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-pink-100 to-rose-100 font-serif text-lg font-semibold text-pink-600">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-sand-900">{item.name}</h3>
                    <p className="text-sm text-cocoa/55">{item.category} &middot; {item.shade}</p>
                    <p className="mt-2 text-sm text-cocoa/65">{item.reason}</p>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <span className="rounded-full bg-sand-900 px-3 py-1 text-xs font-medium text-white">{Math.round(item.score * 100)}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!recommendation && !busy && (
        <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-dashed border-sand-200 bg-sand-50/30">
          <div className="text-center">
            <span className="text-4xl">💄</span>
            <p className="mt-3 text-sm text-cocoa/45">Click Generate to see personalized product recommendations</p>
          </div>
        </div>
      )}
    </div>
  );
}
