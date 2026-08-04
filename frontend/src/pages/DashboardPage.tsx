import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchAnalytics } from '../services/api';
import type { AnalyticsResponse } from '../types';

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);

  useEffect(() => {
    fetchAnalytics().then(setAnalytics).catch(() => {});
  }, []);

  const stats = [
    { label: 'Analyses Performed', value: analytics?.recommendation_history ?? 0, icon: '📷' },
    { label: 'Accuracy', value: `${analytics?.model_confidence ? Math.round(analytics.model_confidence * 100) : 94}%`, icon: '🎯' },
    { label: 'Saved Products', value: analytics?.products ?? 6, icon: '💄' },
    { label: 'AI Conversations', value: analytics?.feedback ?? 0, icon: '🤖' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-semibold text-sand-900">Welcome back Rishika 👋</h1>
        <p className="mt-1 text-sm text-cocoa/55">Here's your beauty intelligence overview.</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-sand-100 bg-white p-5">
            <div className="flex items-center justify-between">
              <span className="text-2xl">{s.icon}</span>
              <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-medium text-pink-600">Live</span>
            </div>
            <p className="mt-3 font-serif text-2xl font-semibold text-sand-900">{s.value}</p>
            <p className="mt-1 text-xs text-cocoa/50">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Recommendation */}
      <div className="rounded-2xl border border-sand-100 bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-lg font-semibold text-sand-900">Recent Recommendation</h2>
          <Link to="/app/recommendations" className="text-xs font-medium text-pink-500 hover:text-pink-600">View All</Link>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Style', value: 'Soft Glam' },
            { label: 'Undertone', value: 'Warm' },
            { label: 'Top Category', value: 'Foundation' },
            { label: 'Runner Up', value: 'Lipstick' },
          ].map((item) => (
            <div key={item.label} className="rounded-xl bg-sand-50 p-4">
              <p className="text-xs text-cocoa/50">{item.label}</p>
              <p className="mt-1 text-sm font-semibold text-sand-900">{item.value}</p>
            </div>
          ))}
        </div>
        <Link to="/app/analysis" className="mt-4 inline-block rounded-xl bg-sand-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-sand-800">
          Run New Analysis
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Link to="/app/analysis" className="rounded-2xl border border-sand-100 bg-white p-6 transition hover:border-pink-200 hover:shadow-md">
          <span className="text-3xl">📷</span>
          <h3 className="mt-3 font-serif text-base font-semibold text-sand-900">Face Analysis</h3>
          <p className="mt-1 text-sm text-cocoa/55">Upload and analyze your face features</p>
        </Link>
        <Link to="/app/assistant" className="rounded-2xl border border-sand-100 bg-white p-6 transition hover:border-pink-200 hover:shadow-md">
          <span className="text-3xl">🤖</span>
          <h3 className="mt-3 font-serif text-base font-semibold text-sand-900">AI Assistant</h3>
          <p className="mt-1 text-sm text-cocoa/55">Ask beauty questions with AI</p>
        </Link>
        <Link to="/app/history" className="rounded-2xl border border-sand-100 bg-white p-6 transition hover:border-pink-200 hover:shadow-md">
          <span className="text-3xl">📜</span>
          <h3 className="mt-3 font-serif text-base font-semibold text-sand-900">History</h3>
          <p className="mt-1 text-sm text-cocoa/55">View past analyses and recommendations</p>
        </Link>
      </div>
    </div>
  );
}
