'use client';

import { QRCodeSVG } from 'qrcode.react';
import ScrollReveal from './ScrollReveal';
import { Smartphone, Share2 } from 'lucide-react';

export default function QRSection() {
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://chong-lua-dao.vercel.app';

  return (
    <section className="py-24 md:py-32 relative">
      <div className="section-divider" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 text-center">
        <ScrollReveal>
          <div className="glass-card p-12 border border-neon-cyan/10">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Smartphone className="w-8 h-8 text-neon-cyan" />
              <h3 className="text-2xl font-bold font-[family-name:var(--font-heading)] gradient-text">
                Chia Sẻ Để Bảo Vệ
              </h3>
              <Share2 className="w-8 h-8 text-neon-orange" />
            </div>
            <p className="text-gray-400 mb-8 max-w-lg mx-auto">
              Quét mã QR để truy cập website trên điện thoại và chia sẻ cho người thân, đặc biệt là người lớn tuổi.
            </p>
            <div className="inline-block p-6 rounded-2xl bg-white">
              <QRCodeSVG
                value={siteUrl}
                size={200}
                bgColor="#ffffff"
                fgColor="#0a0a0f"
                level="H"
                includeMargin={false}
              />
            </div>
            <p className="mt-6 text-sm text-gray-500 font-mono">{siteUrl}</p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
