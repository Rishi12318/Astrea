export function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/70 bg-white/75 p-4 shadow-sm">
      <p className="text-xs uppercase tracking-[0.25em] text-cocoa/70">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-sand-900">{value}</p>
    </div>
  );
}
