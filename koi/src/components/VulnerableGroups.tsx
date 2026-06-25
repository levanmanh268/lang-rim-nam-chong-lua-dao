'use client';

import { motion } from 'framer-motion';
import SectionTitle from './SectionTitle';
import ScrollReveal from './ScrollReveal';

const groups = [
  {
    emoji: '👴',
    title: 'Người Cao Tuổi',
    subtitle: 'Nhóm có tỷ lệ bị lừa đảo cao nhất',
    color: 'neon-orange',
    borderGradient: 'from-neon-orange to-neon-red',
    factors: [
      'Ít hiểu biết về công nghệ và thiết bị số',
      'Dễ tin lời người lạ, nhất là giả danh cơ quan chức năng',
      'Thường bị lừa qua điện thoại, Zalo, SMS',
      'Khó nhận biết website và ứng dụng giả mạo',
      'Tỷ lệ mất tiền trung bình cao nhất trong các nhóm',
    ],
    protection: 'Hướng dẫn người thân lớn tuổi cài đặt ứng dụng bảo mật, thiết lập xác thực 2 lớp, và luôn hỏi ý kiến gia đình trước khi chuyển tiền.',
  },
  {
    emoji: '🎓',
    title: 'Sinh Viên & Giới Trẻ',
    subtitle: 'Nhóm dễ bị lừa qua mạng xã hội',
    color: 'neon-cyan',
    borderGradient: 'from-neon-cyan to-neon-emerald',
    factors: [
      'Ham "việc nhẹ lương cao", cộng tác viên online',
      'Dễ bị lừa qua mạng xã hội (Facebook, TikTok, Telegram)',
      'Thiếu kinh nghiệm tài chính, dễ bị dụ đầu tư',
      'Tin vào quảng cáo "làm giàu nhanh", crypto scam',
      'Bị lợi dụng cho vay nặng lãi online, tín dụng đen',
    ],
    protection: 'Luôn kiểm tra thông tin tuyển dụng, không chuyển tiền trước, từ chối mọi lời mời đầu tư siêu lợi nhuận.',
  },
];

export default function VulnerableGroups() {
  return (
    <section id="nhom-yeu-the" className="py-24 md:py-32 relative">
      <div className="section-divider" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <SectionTitle
          badge="⚠️ Đối tượng dễ bị tổn thương"
          title="Nhóm Yếu Thế"
          subtitle="Những nhóm người cần được bảo vệ đặc biệt trước các chiêu trò lừa đảo"
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {groups.map((group, index) => (
            <ScrollReveal key={group.title} delay={index * 0.2} direction={index === 0 ? 'left' : 'right'}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="glass-card overflow-hidden h-full"
              >
                <div className={`h-1.5 bg-gradient-to-r ${group.borderGradient}`} />
                <div className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <span className="text-5xl">{group.emoji}</span>
                    <div>
                      <h3 className={`text-2xl font-bold font-[family-name:var(--font-heading)] text-${group.color} mb-1`}>
                        {group.title}
                      </h3>
                      <p className="text-gray-500 text-sm">{group.subtitle}</p>
                    </div>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {group.factors.map((factor, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className={`mt-1.5 w-2 h-2 rounded-full bg-${group.color} shrink-0`} />
                        <span className="text-gray-300">{factor}</span>
                      </li>
                    ))}
                  </ul>
                  <div className={`p-4 rounded-xl bg-${group.color}/5 border border-${group.color}/10`}>
                    <p className="text-sm">
                      <span className={`font-semibold text-${group.color}`}>🛡️ Cách bảo vệ: </span>
                      <span className="text-gray-400">{group.protection}</span>
                    </p>
                  </div>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
