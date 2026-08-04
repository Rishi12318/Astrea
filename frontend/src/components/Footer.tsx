export default function Footer() {
  return (
    <footer className="border-t border-[#E5DDD3] bg-white/60">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-[#550000]" />
              <span className="font-serif italic text-base font-bold text-[#1a1a1a]">Astrea</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-[#5A4F43]/60">AI-powered personalized makeup recommendations.</p>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#1a1a1a]">Product</h4>
            <ul className="mt-3 space-y-2 text-sm text-[#5A4F43]/60">
              <li><a href="#features" className="hover:text-[#1a1a1a]">Features</a></li>
              <li><a href="#architecture" className="hover:text-[#1a1a1a]">Architecture</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#1a1a1a]">Legal</h4>
            <ul className="mt-3 space-y-2 text-sm text-[#5A4F43]/60">
              <li><span className="cursor-default">Privacy Policy</span></li>
              <li><span className="cursor-default">Terms of Service</span></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#1a1a1a]">Connect</h4>
            <ul className="mt-3 space-y-2 text-sm text-[#5A4F43]/60">
              <li><a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-[#1a1a1a]">GitHub</a></li>
              <li><a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-[#1a1a1a]">LinkedIn</a></li>
              <li><span className="cursor-default">Email</span></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-[#E5DDD3] pt-6 text-center text-xs text-[#5A4F43]/40">
          &copy; {new Date().getFullYear()} Astrea. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
