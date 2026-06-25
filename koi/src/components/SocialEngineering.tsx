'use client';

import { motion } from 'framer-motion';
import SectionTitle from './SectionTitle';
import ScrollReveal from './ScrollReveal';
import { AlertTriangle, Gem, Handshake } from 'lucide-react';

const tactics = [
  {
    icon: AlertTriangle,
    emoji: '🔴',
    title: 'Nỗi Sợ Hãi',
    subtitle: 'Fear Manipulation',
    description: 'Kẻ lừa đảo tạo ra tình huống khẩn cấp giả, đe dọa tài khoản bị khóa, vi phạm pháp luật... khiến nạn nhân hoảng loạn và hành động theo chỉ dẫn.',
    examples: ['Tài khoản ngân hàng bị khóa', 'Vi phạm pháp luật', 'Người thân gặp nguy hiểm', 'Bị theo dõi/hack'],
    color: 'neon-red',
    borderColor: 'border-red-500/20',
    bgColor: 'bg-red-500/5',
    glowClass: 'hover:shadow-[0_0_30px_rgba(255,51,85,0.15)]',
  },
  {
    icon: Gem,
    emoji: '💰',
    title: 'Lòng Tham',
    subtitle: 'Greed Exploitation',
    description: 'Hứa hẹn phần thưởng lớn, cơ hội đầu tư sinh lời cao, trúng thưởng... để dụ dỗ nạn nhân cung cấp thông tin hoặc chuyển tiền.',
    examples: ['Trúng thưởng xe hơi/tiền mặt', 'Đầu tư lãi suất 50%/tháng', 'Việc nhẹ lương cao', 'Crypto x100'],
    color: 'neon-emerald',
    borderColor: 'border-emerald-500/20',
    bgColor: 'bg-emerald-500/5',
    glowClass: 'hover:shadow-[0_0_30px_rgba(0,255,136,0.15)]',
  },
  {
    icon: Handshake,
    emoji: '🤝',
    title: 'Tin Tưởng Mù Quáng',
    subtitle: 'Blind Trust Abuse',
    description: 'Giả mạo người quen, cơ quan chức năng, thương hiệu uy tín để tạo lòng tin giả tạo, từ đó thao túng hành vi nạn nhân.',
    examples: ['Giả danh công an/ngân hàng', 'Mạo danh người thân', 'Website/app giả mạo', 'Email phishing'],
    color: 'neon-cyan',
    borderColor: 'border-cyan-500/20',
    bgColor: 'bg-cyan-500/5',
    glowClass: 'hover:shadow-[0_0_30px_rgba(0,240,255,0.15)]',
  },
];

export default function SocialEngineering() {
  return (
    <section id="social-engineering" className="py-24 md:py-32 relative">
      <div className="section-divider" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <SectionTitle
          badge="🧠 Social Engineering"
          title="3 Chiêu Thao Túng Tâm Lý"
          subtitle="Hiểu rõ cách kẻ lừa đảo khai thác tâm lý con người để bảo vệ chính mình"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tactics.map((tactic, index) => (
            <ScrollReveal key={tactic.title} delay={index * 0.2}>
              <motion.div
                whileHover={{ scale: 1.03, y: -8 }}
                className={`glass-card p-8 h-full ${tactic.glowClass} transition-all duration-500 border ${tactic.borderColor}`}
              >
                <div className={`text-5xl mb-6`}>{tactic.emoji}</div>
                <div className="flex items-center gap-3 mb-2">
                  <tactic.icon className={`w-6 h-6 text-${tactic.color}`} />
                  <h3 className={`text-2xl font-bold font-[family-name:var(--font-heading)] text-${tactic.color}`}>
                    {tactic.title}
                  </h3>
                </div>
                <p className="text-sm text-gray-500 mb-4 font-mono">{tactic.subtitle}</p>
                <p className="text-gray-300 mb-6 leading-relaxed">{tactic.description}</p>
                <div className="flex flex-wrap gap-2">
                  {tactic.examples.map((example) => (
                    <span
                      key={example}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium ${tactic.bgColor} text-${tactic.color} border ${tactic.borderColor}`}
                    >
                      {example}
                    </span>
                  ))}
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
