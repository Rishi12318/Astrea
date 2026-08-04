import { useEffect, useState } from 'react';
import { fetchAnalytics } from '../services/api';
import type { AnalyticsResponse } from '../types';

export default function HistoryPage() {
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);

  useEffect(() => {
    fetchAnalytics().then(setAnalytics).catch(() => {});
  }, []);

  const history = [
    { date: '2025-01-15', occasion: 'Party', style: 'Soft Glam', confidence: 94 },
    { date: '2025-01-14', occasion: 'Wedding', style: 'Bridal', confidence: 91 },
    { date: '2025-01-13', occasion: 'Office', style: 'Natural', confidence: 88 },
    { date: '2025-01-12', occasion: 'Casual', style: 'Korean Glass Skin', confidence: 92 },
    { date: '2025-01-11', occasion: 'Party', style: 'Bold', confidence: 89 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif italic text-3xl font-semibold text-[#1a1a1a]">Analysis History</h1>
        <p className="mt-1 text-sm text-[#5A4F43]/55">Your past face analyses and recommendation sessions.</p>
      </div>

      <div className="rounded-2xl border border-[#E5DDD3] bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#E5DDD3] bg-[#F0EBE3]/50">
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[#5A4F43]/50">Date</th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[#5A4F43]/50">Occasion</th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[#5A4F43]/50">Style</th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[#5A4F43]/50">Confidence</th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[#5A4F43]/50">Actions</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h, i) => (
                <tr key={i} className="border-b border-[#F0EBE3] transition hover:bg-[#F0EBE3]/50">
                  <td className="px-6 py-4 text-sm text-[#5A4F43]/70">{h.date}</td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-[#550000]/10 px-3 py-1 text-xs font-medium text-[#550000]">{h.occasion}</span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-[#1a1a1a]">{h.style}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 rounded-full bg-[#E5DDD3]">
                        <div className="h-full rounded-full bg-[#550000]" style={{ width: `${h.confidence}%` }} />
                      </div>
                      <span className="text-xs text-[#5A4F43]/55">{h.confidence}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-xs font-medium text-[#550000] hover:text-[#450000]">View</button>
                    <span className="mx-2 text-[#5A4F43]/20">|</span>
                    <button className="text-xs font-medium text-[#5A4F43]/40 hover:text-[#550000]">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
