'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { DollarSign, Users, TrendingUp, EyeOff } from 'lucide-react';
import SectionTitle from './SectionTitle';
import ScrollReveal from './ScrollReveal';

const stats = [
  {
    value: '10.7',
    suffix: ' tỷ USD',
    label: 'Thiệt hại toàn cầu 2023',
    description: 'Tổng thiệt hại do lừa đảo trực tuyến gây ra trên toàn thế giới',
    icon: DollarSign,
    color: 'neon-orange',
    glowClass: 'glow-orange',
  },
  {
    value: '2.3',
    suffix: ' tỷ',
    label: 'Nạn nhân lừa đảo mạng',
    description: 'Số người bị ảnh hưởng bởi các hình thức lừa đảo trực tuyến',
    icon: Users,
    color: 'neon-cyan',
    glowClass: 'glow-cyan',
  },
  {
    value: '323',
    suffix: '%',
    label: 'Gia tăng Deepfake',
    description: 'Mức tăng trưởng đáng báo động của công nghệ Deepfake lừa đảo',
    icon: TrendingUp,
    color: 'neon-emerald',
    glowClass: 'glow-emerald',
  },
  {
    value: '57',
    suffix: '%',
    label: 'Không báo cáo vụ việc',
    description: 'Phần trăm nạn nhân im lặng, không trình báo cơ quan chức năng',
    icon: EyeOff,
    color: 'neon-red',
    glowClass: 'glow-orange',
  },
];

function AnimatedCounter({ value, suffix }: { value: string; suffix: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    if (!isInView) return;
    const numValue = parseFloat(value);
    const duration = 2000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = numValue * eased;

      if (value.includes('.')) {
        setDisplay(current.toFixed(1));
      } else {
        setDisplay(Math.floor(current).toString());
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {display}{suffix}
    </span>
  );
}

export default function Statistics() {
  return (
    <section id="thong-ke" className="py-24 md:py-32 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,240,255,0.05)_0%,transparent_60%)]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <SectionTitle
          badge="📊 Thống kê đáng báo động"
          title="Bức Tranh Toàn Cảnh"
          subtitle="Những con số gây sốc về tình trạng lừa đảo trực tuyến trên toàn cầu"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <ScrollReveal key={stat.label} delay={index * 0.15}>
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className={`glass-card p-8 text-center group cursor-default transition-all duration-300 hover:${stat.glowClass}`}
              >
                <div className={`inline-flex p-4 rounded-2xl bg-${stat.color}/10 mb-6 group-hover:bg-${stat.color}/20 transition-colors`}>
                  <stat.icon className={`w-8 h-8 text-${stat.color}`} />
                </div>
                <div className={`text-4xl md:text-5xl font-black font-[family-name:var(--font-heading)] text-${stat.color} mb-3`}>
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-lg font-semibold text-white mb-2">{stat.label}</div>
                <p className="text-sm text-gray-500">{stat.description}</p>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
