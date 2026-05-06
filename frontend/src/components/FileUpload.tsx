export function FileUpload({ onChange, fileName }: { onChange: (file: File | null) => void; fileName: string }) {
  return (
    <label className="flex cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-cocoa/30 bg-white/70 p-6 text-center shadow-sm">
      <span className="text-sm font-medium text-sand-900">Upload a face image</span>
      <span className="mt-1 text-xs text-sand-600">PNG, JPG, JPEG supported</span>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => onChange(event.target.files?.[0] ?? null)}
      />
      <span className="mt-4 text-sm text-cocoa">{fileName}</span>
    </label>
  );
}
