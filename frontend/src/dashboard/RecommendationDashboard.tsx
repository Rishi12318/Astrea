const recommendations = [
  { title: 'Luminous Skin Foundation', reason: 'Matches warm undertones and medium skin tones.' },
  { title: 'Velvet Matte Lip', reason: 'Balances soft glam and professional wear.' },
  { title: 'Soft Flush Blush', reason: 'Adds healthy warmth to oval face structures.' },
];

export function RecommendationDashboard() {
  return (
    <div className="grid gap-4">
      {recommendations.map((item) => (
        <div key={item.title} className="rounded-2xl border border-sand-200 bg-white p-4">
          <p className="font-semibold text-sand-900">{item.title}</p>
          <p className="mt-1 text-sm text-sand-600">{item.reason}</p>
        </div>
      ))}
    </div>
  );
}
