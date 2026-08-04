import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

const reviews = [
  { name: 'Priya S.', role: 'Makeup Artist', text: 'ASTREA accurately detected my warm undertone and recommended shades I never would have tried. The AI reasoning is spot-on.', avatar: 'P' },
  { name: 'Ananya M.', role: 'Beauty Blogger', text: 'The face analysis is incredibly precise. It identified my face shape and eye shape perfectly. Game changer for content creators.', avatar: 'A' },
  { name: 'Ritika K.', role: 'Bridal Client', text: 'Used this before my wedding consultation. The bridal recommendations matched exactly what my makeup artist suggested. Impressed!', avatar: 'R' },
];

const slides = [
  {
    video: 'https://v1.pinimg.com/videos/iht/expMp4/68/81/5e/68815e08d2c14dfbf89a8f7d18258aaf_720w.mp4',
    title: 'This is your time to shine, diva',
    desc: 'Let AI find the shades that make you glow. Your beauty, amplified by intelligence.',
  },
  {
    video: 'https://v1.pinimg.com/videos/iht/720p/73/90/c4/7390c46af4c2b04106ef003291f74ee7.mp4',
    title: 'Know your skin type',
    desc: 'Our CNN detects your exact skin tone, undertone, and face shape in seconds. Precision beauty starts with understanding you.',
  },
];

function PaletteCard() {
  const [active, setActive] = useState(0);
  const [fading, setFading] = useState(false);
  const videoRef1 = useRef<HTMLVideoElement>(null);
  const videoRef2 = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = active === 0 ? videoRef1.current : videoRef2.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (video.currentTime >= video.duration - 0.5) {
        setFading(true);
        setTimeout(() => {
          setActive((prev) => (prev + 1) % 2);
          setFading(false);
        }, 600);
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, [active]);

  useEffect(() => {
    const video = active === 0 ? videoRef1.current : videoRef2.current;
    if (video) {
      video.currentTime = 0;
      video.play().catch(() => {});
    }
  }, [active]);

  const panColors = [
    ['from-[#550000]/60 to-[#550000]/40', 'from-[#3A332B]/80 to-[#5A4F43]/60', 'from-[#550000]/80 to-[#550000]/60', 'from-[#1a1a1a]/80 to-[#1a1a1a]/60', 'from-[#5A4F43]/60 to-[#3A332B]/80', 'from-[#550000]/70 to-[#550000]/50', 'from-[#C4B5A6]/50 to-[#B3A291]/60', 'from-[#550000]/90 to-[#550000]/70', 'from-[#1a1a1a]/70 to-[#1a1a1a]/50', 'from-[#5A4F43]/50 to-[#3A332B]/70'],
    ['from-[#C4B5A6]/60 to-[#D4C9BB]/50', 'from-[#550000]/60 to-[#550000]/40', 'from-[#3A332B]/80 to-[#5A4F43]/60', 'from-[#550000]/80 to-[#550000]/60', 'from-[#D4C9BB]/50 to-[#C4B5A6]/60', 'from-[#550000]/70 to-[#550000]/50', 'from-[#E5DDD3]/50 to-[#D4C9BB]/60', 'from-[#5A4F43]/60 to-[#3A332B]/80', 'from-[#1a1a1a]/70 to-[#1a1a1a]/50', 'from-[#C4B5A6]/40 to-[#B3A291]/50'],
  ];

  return (
    <div className="flex flex-col items-center gap-10 md:flex-row md:items-center md:justify-center">
      {/* Palette Card */}
      <div className="relative w-full max-w-md">
        <div className="rounded-[2rem] border-2 border-[#550000]/30 bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] p-6 shadow-2xl">
          <div className="mb-4 flex items-center justify-between">
            <span className="font-serif text-sm font-semibold tracking-wider text-white/70">ASTREA</span>
            <span className="text-[0.6rem] uppercase tracking-widest text-white/30">Palette</span>
          </div>
          <div className="grid grid-cols-4 grid-rows-3 gap-2.5">
            {panColors[active].slice(0, 5).map((c, i) => (
              <div key={`a-${i}`} className={`aspect-square rounded-xl bg-gradient-to-br ${c} shadow-inner transition-all duration-700`} />
            ))}
            <div className="col-span-2 row-span-2 aspect-square overflow-hidden rounded-2xl border-2 border-white/20 shadow-lg relative">
              <video
                ref={videoRef1}
                autoPlay={active === 0}
                muted
                playsInline
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-600 ${active === 0 ? 'opacity-100' : 'opacity-0'}`}
              >
                <source src={slides[0].video} type="video/mp4" />
              </video>
              <video
                ref={videoRef2}
                autoPlay={active === 1}
                muted
                playsInline
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-600 ${active === 1 ? 'opacity-100' : 'opacity-0'}`}
              >
                <source src={slides[1].video} type="video/mp4" />
              </video>
            </div>
            {panColors[active].slice(5).map((c, i) => (
              <div key={`b-${i}`} className={`aspect-square rounded-xl bg-gradient-to-br ${c} shadow-inner transition-all duration-700`} />
            ))}
          </div>
          <div className="mt-4 flex items-center justify-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => { setFading(true); setTimeout(() => { setActive(i); setFading(false); }, 300); }}
                className={`h-1.5 rounded-full transition-all duration-300 ${active === i ? 'w-6 bg-white/60' : 'w-1.5 bg-white/20'}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Text */}
      <div className="text-center md:text-left md:max-w-sm">
        <div className={`transition-opacity duration-500 ${fading ? 'opacity-0' : 'opacity-100'}`}>
          <p className="font-serif text-4xl leading-snug italic tracking-wide text-[#1a1a1a] md:text-5xl">
            {slides[active].title}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-[#5A4F43]/55">
            {slides[active].desc}
          </p>
        </div>
      </div>
    </div>
  );
}

function GetStartedSection() {
  const { ref, visible } = useInView(0.15);
  const steps = [
    { num: '01', title: 'Sign Up', desc: 'Create your free account in seconds.' },
    { num: '02', title: 'Upload Photo', desc: 'Take a selfie or upload any face photo.' },
    { num: '03', title: 'AI Analysis', desc: 'Get instant face and skin tone analysis.' },
    { num: '04', title: 'Get Matched', desc: 'Receive personalized product recommendations.' },
  ];

  return (
    <section className="px-6 py-24 md:py-32 bg-[#F0EBE3]/50">
      <div className="mx-auto max-w-5xl" ref={ref}>
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#550000]/40">How It Works</p>
          <h2 className="mt-3 font-serif text-3xl tracking-tight text-[#1a1a1a] md:text-5xl">Get Started in 4 Steps</h2>
        </div>

        <div className="relative mt-20">
          {/* Connecting line */}
          <div className="absolute top-6 left-[calc(12.5%+12px)] right-[calc(12.5%+12px)] h-px bg-[#550000]/20 hidden md:block" />

          <div className="grid gap-12 md:grid-cols-4 md:gap-8">
            {steps.map((s, i) => (
              <div
                key={s.num}
                className="flex flex-col items-center text-center transition-all duration-700"
                style={{ transitionDelay: `${i * 150}ms`, opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)' }}
              >
                {/* Circle */}
                <div className="relative flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#550000]/30 bg-white text-sm font-semibold text-[#550000] shadow-sm transition-all duration-500 hover:border-[#550000] hover:bg-[#550000] hover:text-white hover:shadow-md hover:scale-110">
                  {s.num}
                </div>
                <h3 className="mt-5 font-serif text-base font-semibold text-[#1a1a1a]">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#5A4F43]/60">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 text-center">
          <Link
            to="/auth"
            className="inline-block rounded-full bg-[#550000] px-10 py-4 text-sm font-semibold text-white shadow-glow transition hover:translate-y-[-2px]"
          >
            Get Started Free
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-16">

      {/* ── Hero ── */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video autoPlay loop muted playsInline className="h-full w-full object-cover">
            <source src="https://v1.pinimg.com/videos/iht/720p/f1/44/46/f14446ab19c46e69104b8e08d65f720f.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10 text-center">
          <h1 className="font-serif italic font-bold text-white tracking-wide"
              style={{ fontSize: 'clamp(3rem, 8vw, 8rem)', animation: 'fadeInOut 4s ease-in-out infinite' }}>
            Astrea
          </h1>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <svg className="h-6 w-6 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ── About ── */}
      <section id="about" className="relative overflow-hidden">
        <div className="absolute inset-0 flex">
          <div className="w-[80%] bg-[#F0EBE3]" />
          <div className="w-[20%] bg-[#550000]" />
        </div>

        <div className="relative px-6 py-24 md:py-32">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#550000]/40">About ASTREA</p>
              <h2 className="mt-3 font-serif text-3xl tracking-tight text-[#1a1a1a] md:text-5xl">Intelligence Meets Beauty</h2>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[#5A4F43]/60">
                We combine deep learning, computer vision, and large language models to deliver hyper-personalized makeup recommendations that understand you.
              </p>
            </div>

            {/* Palette Card with rotating videos */}
            <div className="mt-16">
              <PaletteCard />
            </div>

          </div>
        </div>
      </section>

      {/* ── Get Started ── */}
      <GetStartedSection />

      {/* ── Reviews ── */}
      <section className="px-6 py-24 md:py-32 bg-[#FAF8F5]">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#550000]/40">Testimonials</p>
            <h2 className="mt-3 font-serif text-3xl tracking-tight text-[#1a1a1a] md:text-5xl">Loved by Beauty Enthusiasts</h2>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {reviews.map((r) => (
              <div key={r.name} className="rounded-2xl border border-[#E5DDD3] bg-white p-6 transition hover:shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#550000] font-serif text-sm font-semibold text-white">
                    {r.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1a1a1a]">{r.name}</p>
                    <p className="text-xs text-[#5A4F43]/50">{r.role}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-[#5A4F43]/65">{r.text}</p>
                <div className="mt-3 flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <svg key={s} className="h-4 w-4 text-[#550000]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <div className="overflow-hidden rounded-3xl bg-[#550000] p-12 text-center text-white shadow-glow md:p-16">
            <h2 className="font-serif text-3xl leading-tight md:text-5xl">Ready to discover your perfect shade?</h2>
            <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-white/70">
              Join ASTREA and experience AI-powered beauty recommendations tailored to your unique features.
            </p>
            <Link to="/auth" className="mt-10 inline-block rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-[#550000] shadow-lg transition hover:translate-y-[-2px]">
              Start Now — It's Free
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
