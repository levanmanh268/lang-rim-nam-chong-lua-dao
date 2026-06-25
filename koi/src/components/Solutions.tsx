'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Link2, Bot, CheckCircle, ArrowRight } from 'lucide-react';
import SectionTitle from './SectionTitle';
import ScrollReveal from './ScrollReveal';

const tools = [
  {
    icon: Link2,
    title: 'URL Checker',
    subtitle: 'Kiểm tra link đáng ngờ',
    description: 'Phân tích URL để phát hiện website lừa đảo, kiểm tra domain, SSL và cảnh báo nguy hiểm.',
    features: [
      'Phân tích domain và phát hiện giả mạo',
      'Kiểm tra chứng chỉ SSL/TLS',
      'Phát hiện link rút gọn ẩn giấu',
      'Đánh giá độ tin cậy website',
    ],
    color: 'neon-cyan',
    placeholder: 'https://example-suspicious.com/login...',
    borderColor: 'border-cyan-500/20',
  },
  {
    icon: Bot,
    title: 'AI Phishing Checker',
    subtitle: 'Phân tích tin nhắn lừa đảo',
    description: 'AI phân tích nội dung tin nhắn, email để phát hiện các mẫu ngôn ngữ thao túng tâm lý.',
    features: [
      'Phân tích ngôn ngữ thao túng tâm lý',
      'Phát hiện mẫu tin nhắn phishing',
      'Đánh giá mức độ nguy hiểm',
      'Gợi ý cách xử lý an toàn',
    ],
    color: 'neon-emerald',
    placeholder: 'Dán tin nhắn đáng ngờ vào đây...',
    borderColor: 'border-emerald-500/20',
  },
];

export default function Solutions() {
  return (
    <section id="giai-phap" className="py-24 md:py-32 relative">
      <div className="section-divider" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(0,255,136,0.05)_0%,transparent_60%)]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative pt-24">
        <SectionTitle
          badge="🤖 Công cụ AI"
          title="Giải Pháp Bảo Vệ"
          subtitle="Sử dụng trí tuệ nhân tạo để phát hiện và ngăn chặn lừa đảo trước khi bạn trở thành nạn nhân"
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {tools.map((tool, index) => (
            <ScrollReveal key={tool.title} delay={index * 0.2}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className={`glass-card p-8 h-full border ${tool.borderColor} transition-all duration-500`}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className={`p-3 rounded-2xl bg-${tool.color}/10`}>
                    <tool.icon className={`w-8 h-8 text-${tool.color}`} />
                  </div>
                  <div>
                    <h3 className={`text-2xl font-bold font-[family-name:var(--font-heading)] text-${tool.color}`}>
                      {tool.title}
                    </h3>
                    <p className="text-gray-500 text-sm">{tool.subtitle}</p>
                  </div>
                </div>

                <p className="text-gray-300 mb-6 leading-relaxed">{tool.description}</p>

                {/* Feature list */}
                <ul className="space-y-3 mb-8">
                  {tool.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <CheckCircle className={`w-5 h-5 text-${tool.color} shrink-0`} />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Mock preview */}
                <div className={`p-4 rounded-xl bg-dark-900 border ${tool.borderColor} mb-6`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full bg-${tool.color}/30 animate-pulse`} />
                    <span className="text-gray-600 text-sm font-mono">{tool.placeholder}</span>
                  </div>
                </div>

                {/* CTA */}
                <Link
                  href="/kiem-tra"
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-${tool.color}/10 text-${tool.color} border border-${tool.color}/20 font-semibold hover:bg-${tool.color}/20 transition-all group`}
                >
                  Thử ngay
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
