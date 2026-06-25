'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

/* ── Floating particle component ── */
function Particles() {
  const dots = Array.from({ length: 18 }, (_, i) => i);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {dots.map((i) => {
        const size = 2 + (i % 4);
        const x = ((i * 37 + 11) % 100);
        const y = ((i * 53 + 7) % 100);
        const dur = 6 + (i % 8);
        const delay = (i % 5) * 0.7;
        const color = i % 3 === 0 ? '#ff6b2b' : i % 3 === 1 ? '#00f0ff' : '#00ff88';
        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: size,
              height: size,
              left: `${x}%`,
              top: `${y}%`,
              backgroundColor: color,
              opacity: 0.25,
            }}
            animate={{
              y: [0, -30, 0, 20, 0],
              x: [0, 15, -10, 5, 0],
              opacity: [0.15, 0.4, 0.2, 0.35, 0.15],
            }}
            transition={{
              duration: dur,
              repeat: Infinity,
              delay,
              ease: 'easeInOut',
            }}
          />
        );
      })}
    </div>
  );
}

/* ── Detailed Neon Brain SVG ── */
function NeonBrain() {
  return (
    <svg
      width="320"
      height="320"
      viewBox="0 0 320 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] drop-shadow-[0_0_40px_rgba(255,107,43,0.25)]"
    >
      {/* ── Outer glow ring ── */}
      <circle cx="160" cy="160" r="150" stroke="url(#ringGrad)" strokeWidth="0.7" opacity="0.25" />
      <circle cx="160" cy="160" r="140" stroke="#00f0ff" strokeWidth="0.4" opacity="0.12" strokeDasharray="6 10" />

      {/* ── Left hemisphere outline ── */}
      <path
        d="M160 38 C115 38 78 56 60 88 C42 120 44 160 60 192 C76 224 108 250 148 262 L160 262"
        stroke="url(#hemisphereL)" strokeWidth="2.2" fill="none" opacity="0.85"
      />
      <path
        d="M160 50 C120 50 88 66 72 94 C56 122 58 156 72 184 C86 212 112 234 148 244"
        stroke="#00f0ff" strokeWidth="1.2" fill="none" opacity="0.45"
      />

      {/* ── Right hemisphere outline ── */}
      <path
        d="M160 38 C205 38 242 56 260 88 C278 120 276 160 260 192 C244 224 212 250 172 262 L160 262"
        stroke="url(#hemisphereR)" strokeWidth="2.2" fill="none" opacity="0.85"
      />
      <path
        d="M160 50 C200 50 232 66 248 94 C264 122 262 156 248 184 C234 212 208 234 172 244"
        stroke="#00f0ff" strokeWidth="1.2" fill="none" opacity="0.45"
      />

      {/* ── Left brain folds (gyri) ── */}
      <path d="M82 78 C100 72 118 84 112 102 C106 120 88 114 82 126 C76 138 90 148 108 142" stroke="#ff6b2b" strokeWidth="1.6" fill="none" opacity="0.7" />
      <path d="M68 112 C82 106 100 118 94 136 C88 154 70 148 66 166 C62 184 80 190 100 182" stroke="#00ff88" strokeWidth="1.5" fill="none" opacity="0.55" />
      <path d="M86 160 C104 154 116 170 110 188 C104 206 116 218 136 216" stroke="#00f0ff" strokeWidth="1.4" fill="none" opacity="0.5" />
      <path d="M74 92 C64 98 56 114 66 128" stroke="#ff6b2b" strokeWidth="1" fill="none" opacity="0.35" />
      <path d="M72 148 C60 158 56 176 68 188" stroke="#00ff88" strokeWidth="1" fill="none" opacity="0.3" />

      {/* ── Right brain folds (gyri) ── */}
      <path d="M238 78 C220 72 202 84 208 102 C214 120 232 114 238 126 C244 138 230 148 212 142" stroke="#ff6b2b" strokeWidth="1.6" fill="none" opacity="0.7" />
      <path d="M252 112 C238 106 220 118 226 136 C232 154 250 148 254 166 C258 184 240 190 220 182" stroke="#00ff88" strokeWidth="1.5" fill="none" opacity="0.55" />
      <path d="M234 160 C216 154 204 170 210 188 C216 206 204 218 184 216" stroke="#00f0ff" strokeWidth="1.4" fill="none" opacity="0.5" />
      <path d="M246 92 C256 98 264 114 254 128" stroke="#ff6b2b" strokeWidth="1" fill="none" opacity="0.35" />
      <path d="M248 148 C260 158 264 176 252 188" stroke="#00ff88" strokeWidth="1" fill="none" opacity="0.3" />

      {/* ── Central sulcus ── */}
      <line x1="160" y1="44" x2="160" y2="258" stroke="#ff6b2b" strokeWidth="0.8" opacity="0.2" strokeDasharray="5 5" />

      {/* ── Corpus callosum bridge lines ── */}
      <path d="M120 120 Q140 110 160 120 Q180 110 200 120" stroke="#00f0ff" strokeWidth="0.8" fill="none" opacity="0.3" />
      <path d="M118 150 Q140 140 160 150 Q180 140 202 150" stroke="#00f0ff" strokeWidth="0.8" fill="none" opacity="0.25" />
      <path d="M124 180 Q140 172 160 180 Q180 172 196 180" stroke="#00f0ff" strokeWidth="0.8" fill="none" opacity="0.2" />

      {/* ── Neural network nodes (major) ── */}
      <circle cx="112" cy="102" r="5" fill="#ff6b2b" opacity="0.9">
        <animate attributeName="opacity" values="0.9;0.4;0.9" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="208" cy="102" r="5" fill="#ff6b2b" opacity="0.9">
        <animate attributeName="opacity" values="0.9;0.4;0.9" dur="3s" repeatCount="indefinite" begin="0.5s" />
      </circle>
      <circle cx="94" cy="136" r="4" fill="#00f0ff" opacity="0.85">
        <animate attributeName="opacity" values="0.85;0.35;0.85" dur="2.8s" repeatCount="indefinite" begin="0.3s" />
      </circle>
      <circle cx="226" cy="136" r="4" fill="#00f0ff" opacity="0.85">
        <animate attributeName="opacity" values="0.85;0.35;0.85" dur="2.8s" repeatCount="indefinite" begin="0.8s" />
      </circle>
      <circle cx="100" cy="182" r="3.5" fill="#00ff88" opacity="0.8">
        <animate attributeName="opacity" values="0.8;0.3;0.8" dur="3.2s" repeatCount="indefinite" begin="0.6s" />
      </circle>
      <circle cx="220" cy="182" r="3.5" fill="#00ff88" opacity="0.8">
        <animate attributeName="opacity" values="0.8;0.3;0.8" dur="3.2s" repeatCount="indefinite" begin="1.1s" />
      </circle>

      {/* ── Central axis nodes ── */}
      <circle cx="160" cy="80" r="6" fill="#ff6b2b" opacity="0.95">
        <animate attributeName="r" values="6;7.5;6" dur="2.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="160" cy="140" r="5" fill="#00f0ff" opacity="0.9">
        <animate attributeName="r" values="5;6.5;5" dur="3s" repeatCount="indefinite" begin="0.4s" />
      </circle>
      <circle cx="160" cy="200" r="5" fill="#00ff88" opacity="0.9">
        <animate attributeName="r" values="5;6.5;5" dur="2.8s" repeatCount="indefinite" begin="0.8s" />
      </circle>

      {/* ── Minor nodes ── */}
      <circle cx="82" cy="78" r="2.5" fill="#ff6b2b" opacity="0.6" />
      <circle cx="238" cy="78" r="2.5" fill="#ff6b2b" opacity="0.6" />
      <circle cx="66" cy="166" r="2" fill="#00ff88" opacity="0.5" />
      <circle cx="254" cy="166" r="2" fill="#00ff88" opacity="0.5" />
      <circle cx="136" cy="216" r="2.5" fill="#00f0ff" opacity="0.5" />
      <circle cx="184" cy="216" r="2.5" fill="#00f0ff" opacity="0.5" />
      <circle cx="108" cy="142" r="2" fill="#ff6b2b" opacity="0.5" />
      <circle cx="212" cy="142" r="2" fill="#ff6b2b" opacity="0.5" />

      {/* ── Neural connections (internal wiring) ── */}
      <line x1="112" y1="102" x2="160" y2="80" stroke="#ff6b2b" strokeWidth="0.7" opacity="0.35" />
      <line x1="208" y1="102" x2="160" y2="80" stroke="#ff6b2b" strokeWidth="0.7" opacity="0.35" />
      <line x1="94" y1="136" x2="160" y2="140" stroke="#00f0ff" strokeWidth="0.7" opacity="0.3" />
      <line x1="226" y1="136" x2="160" y2="140" stroke="#00f0ff" strokeWidth="0.7" opacity="0.3" />
      <line x1="100" y1="182" x2="160" y2="200" stroke="#00ff88" strokeWidth="0.7" opacity="0.3" />
      <line x1="220" y1="182" x2="160" y2="200" stroke="#00ff88" strokeWidth="0.7" opacity="0.3" />
      <line x1="160" y1="80" x2="160" y2="140" stroke="#ff6b2b" strokeWidth="0.5" opacity="0.2" />
      <line x1="160" y1="140" x2="160" y2="200" stroke="#00f0ff" strokeWidth="0.5" opacity="0.2" />
      <line x1="112" y1="102" x2="94" y2="136" stroke="#ff6b2b" strokeWidth="0.5" opacity="0.2" />
      <line x1="208" y1="102" x2="226" y2="136" stroke="#ff6b2b" strokeWidth="0.5" opacity="0.2" />
      <line x1="94" y1="136" x2="100" y2="182" stroke="#00f0ff" strokeWidth="0.5" opacity="0.2" />
      <line x1="226" y1="136" x2="220" y2="182" stroke="#00f0ff" strokeWidth="0.5" opacity="0.2" />

      {/* ── Cross-hemisphere connections ── */}
      <line x1="112" y1="102" x2="208" y2="102" stroke="#ff6b2b" strokeWidth="0.4" opacity="0.12" strokeDasharray="3 6" />
      <line x1="94" y1="136" x2="226" y2="136" stroke="#00f0ff" strokeWidth="0.4" opacity="0.12" strokeDasharray="3 6" />
      <line x1="100" y1="182" x2="220" y2="182" stroke="#00ff88" strokeWidth="0.4" opacity="0.12" strokeDasharray="3 6" />

      {/* ── Circuit board traces – left ── */}
      <path d="M60 88 L36 88 L36 64" stroke="#00f0ff" strokeWidth="1" opacity="0.3" />
      <path d="M60 192 L28 192 L28 226" stroke="#00ff88" strokeWidth="1" opacity="0.3" />
      <path d="M68 112 L42 112 L42 96 L26 96" stroke="#ff6b2b" strokeWidth="0.8" opacity="0.25" />
      <path d="M72 148 L46 148 L46 170" stroke="#00f0ff" strokeWidth="0.8" opacity="0.2" />

      {/* ── Circuit board traces – right ── */}
      <path d="M260 88 L284 88 L284 64" stroke="#00f0ff" strokeWidth="1" opacity="0.3" />
      <path d="M260 192 L292 192 L292 226" stroke="#00ff88" strokeWidth="1" opacity="0.3" />
      <path d="M252 112 L278 112 L278 96 L294 96" stroke="#ff6b2b" strokeWidth="0.8" opacity="0.25" />
      <path d="M248 148 L274 148 L274 170" stroke="#00f0ff" strokeWidth="0.8" opacity="0.2" />

      {/* ── Circuit board traces – top & bottom ── */}
      <path d="M160 38 L160 18 L180 18" stroke="#ff6b2b" strokeWidth="0.8" opacity="0.25" />
      <path d="M160 38 L160 18 L140 18" stroke="#00f0ff" strokeWidth="0.8" opacity="0.25" />
      <path d="M160 262 L160 284 L180 284" stroke="#00ff88" strokeWidth="0.8" opacity="0.25" />
      <path d="M160 262 L160 284 L140 284" stroke="#ff6b2b" strokeWidth="0.8" opacity="0.25" />

      {/* ── Circuit endpoint dots ── */}
      <circle cx="36" cy="64" r="2.5" fill="#00f0ff" opacity="0.6" />
      <circle cx="284" cy="64" r="2.5" fill="#00f0ff" opacity="0.6" />
      <circle cx="28" cy="226" r="2.5" fill="#00ff88" opacity="0.6" />
      <circle cx="292" cy="226" r="2.5" fill="#00ff88" opacity="0.6" />
      <circle cx="26" cy="96" r="2" fill="#ff6b2b" opacity="0.5" />
      <circle cx="294" cy="96" r="2" fill="#ff6b2b" opacity="0.5" />
      <circle cx="46" cy="170" r="2" fill="#00f0ff" opacity="0.5" />
      <circle cx="274" cy="170" r="2" fill="#00f0ff" opacity="0.5" />
      <circle cx="180" cy="18" r="2" fill="#ff6b2b" opacity="0.5" />
      <circle cx="140" cy="18" r="2" fill="#00f0ff" opacity="0.5" />
      <circle cx="180" cy="284" r="2" fill="#00ff88" opacity="0.5" />
      <circle cx="140" cy="284" r="2" fill="#ff6b2b" opacity="0.5" />

      {/* ── Data-pulse lines (animated dashes) ── */}
      <path d="M36 64 L36 88 L60 88" stroke="#00f0ff" strokeWidth="1.5" opacity="0.6" strokeDasharray="4 12" strokeDashoffset="0">
        <animate attributeName="stroke-dashoffset" values="0;-16" dur="1.5s" repeatCount="indefinite" />
      </path>
      <path d="M284 64 L284 88 L260 88" stroke="#00f0ff" strokeWidth="1.5" opacity="0.6" strokeDasharray="4 12" strokeDashoffset="0">
        <animate attributeName="stroke-dashoffset" values="0;-16" dur="1.5s" repeatCount="indefinite" begin="0.3s" />
      </path>
      <path d="M28 226 L28 192 L60 192" stroke="#00ff88" strokeWidth="1.5" opacity="0.6" strokeDasharray="4 12">
        <animate attributeName="stroke-dashoffset" values="0;-16" dur="1.8s" repeatCount="indefinite" begin="0.6s" />
      </path>
      <path d="M292 226 L292 192 L260 192" stroke="#00ff88" strokeWidth="1.5" opacity="0.6" strokeDasharray="4 12">
        <animate attributeName="stroke-dashoffset" values="0;-16" dur="1.8s" repeatCount="indefinite" begin="0.9s" />
      </path>

      {/* ── Gradients ── */}
      <defs>
        <linearGradient id="ringGrad" x1="10" y1="10" x2="310" y2="310" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ff6b2b" />
          <stop offset="50%" stopColor="#00f0ff" />
          <stop offset="100%" stopColor="#00ff88" />
        </linearGradient>
        <linearGradient id="hemisphereL" x1="60" y1="38" x2="160" y2="262" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ff6b2b" />
          <stop offset="100%" stopColor="#00ff88" />
        </linearGradient>
        <linearGradient id="hemisphereR" x1="260" y1="38" x2="160" y2="262" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ff6b2b" />
          <stop offset="100%" stopColor="#00ff88" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════ */

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage:
          'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }}
    >
      {/* ── Background ambient lights ── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,107,43,0.07)_0%,transparent_70%)]" />
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#00f0ff]/[0.04] rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#ff6b2b]/[0.04] rounded-full blur-[140px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00ff88]/[0.02] rounded-full blur-[160px]" />
      </div>

      {/* ── Floating particles ── */}
      <Particles />

      {/* ── Main content ── */}
      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
        {/* Brain SVG */}
        <motion.div
          initial={{ opacity: 0, scale: 0.4, rotate: -8 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 flex justify-center"
        >
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="drop-shadow-[0_0_60px_rgba(255,107,43,0.3)]"
          >
            <NeonBrain />
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: 'easeOut' }}
          className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black font-[family-name:var(--font-heading)] leading-[1.08] tracking-tight mb-6"
        >
          <span className="bg-gradient-to-r from-[#ff6b2b] via-[#00f0ff] to-[#00ff88] bg-clip-text text-transparent">
            KỸ NĂNG CHỐNG
          </span>
          <br />
          <span
            className="text-[#ff6b2b]"
            style={{ textShadow: '0 0 30px rgba(255,107,43,0.5), 0 0 60px rgba(255,107,43,0.2)' }}
          >
            LỪA ĐẢO
          </span>
          <br />
          <span className="bg-gradient-to-r from-[#00f0ff] to-[#00ff88] bg-clip-text text-transparent">
            TRÊN INTERNET
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="text-xl sm:text-2xl md:text-3xl text-[#00f0ff] font-light mb-5 font-[family-name:var(--font-heading)]"
          style={{ textShadow: '0 0 20px rgba(0,240,255,0.35)' }}
        >
          Kỷ nguyên thao túng tâm lý số
        </motion.p>

        {/* Group info */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-gray-400 text-base sm:text-lg mb-12"
        >
          Nhóm:{' '}
          <span className="text-[#ff6b2b] font-semibold">Làng Rim Nam</span>
          &nbsp;&nbsp;|&nbsp;&nbsp;GVHD:{' '}
          <span className="text-[#00ff88] font-semibold">TS. Nguyễn Thị Thu Hằng</span>
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-5 justify-center items-center"
        >
          <a
            href="#thong-ke"
            className="group relative px-9 py-4 text-lg font-bold rounded-xl border border-[#00f0ff]/40 text-[#00f0ff] min-w-[220px] text-center overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,240,255,0.25)] hover:-translate-y-0.5"
          >
            <span className="absolute inset-0 bg-[#00f0ff]/[0.06] group-hover:bg-[#00f0ff]/[0.12] transition-colors" />
            <span className="relative">🔍 Khám Phá Ngay</span>
          </a>
          <Link
            href="/kiem-tra"
            className="px-9 py-4 text-lg font-bold rounded-xl bg-[#ff6b2b] text-[#0a0a0f] min-w-[220px] text-center transition-all duration-300 hover:bg-[#ff6b2b]/90 hover:shadow-[0_0_30px_rgba(255,107,43,0.35)] hover:-translate-y-0.5"
          >
            🛡️ Kiểm Tra URL
          </Link>
        </motion.div>
      </div>

      {/* ── Scroll indicator ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-8 h-8 text-[#00f0ff]/50" />
        </motion.div>
      </motion.div>
    </section>
  );
}
