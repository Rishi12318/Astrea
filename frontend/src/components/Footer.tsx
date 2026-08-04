export default function Footer() {
  return (
    <footer className="border-t border-sand-100 bg-white/60">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-pink-400 to-rose-300" />
              <span className="font-serif text-base font-bold text-sand-900">ASTREA</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-cocoa/60">AI-powered personalized makeup recommendations.</p>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-sand-900">Product</h4>
            <ul className="mt-3 space-y-2 text-sm text-cocoa/60">
              <li><a href="#features" className="hover:text-sand-900">Features</a></li>
              <li><a href="#tech" className="hover:text-sand-900">Tech Stack</a></li>
              <li><a href="#architecture" className="hover:text-sand-900">Architecture</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-sand-900">Legal</h4>
            <ul className="mt-3 space-y-2 text-sm text-cocoa/60">
              <li><span className="cursor-default">Privacy Policy</span></li>
              <li><span className="cursor-default">Terms of Service</span></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-sand-900">Connect</h4>
            <ul className="mt-3 space-y-2 text-sm text-cocoa/60">
              <li><a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-sand-900">GitHub</a></li>
              <li><a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-sand-900">LinkedIn</a></li>
              <li><span className="cursor-default">Email</span></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-sand-100 pt-6 text-center text-xs text-cocoa/40">
          &copy; {new Date().getFullYear()} ASTREA. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
