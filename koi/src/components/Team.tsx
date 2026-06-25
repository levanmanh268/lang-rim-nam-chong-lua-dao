'use client';

import { motion } from 'framer-motion';
import SectionTitle from './SectionTitle';
import ScrollReveal from './ScrollReveal';
import { GraduationCap, Crown } from 'lucide-react';

const members = [
  { name: 'Nguyễn Đức Tín', role: 'Nhóm trưởng', isLeader: true },
  { name: 'Trần Thị Mỹ Duyên', role: 'Thành viên', isLeader: false },
  { name: 'Nguyễn Thị Thanh Ngân', role: 'Thành viên', isLeader: false },
  { name: 'Lê Thị Hồng Nhung', role: 'Thành viên', isLeader: false },
  { name: 'Phạm Thị Kim Oanh', role: 'Thành viên', isLeader: false },
  { name: 'Nguyễn Thị Thanh Tâm', role: 'Thành viên', isLeader: false },
  { name: 'Nguyễn Văn Tấn', role: 'Thành viên', isLeader: false },
  { name: 'Phạm Minh Thắng', role: 'Thành viên', isLeader: false },
  { name: 'Lê Thị Cẩm Tiên', role: 'Thành viên', isLeader: false },
  { name: 'Nguyễn Phước Thiện Toàn', role: 'Thành viên', isLeader: false },
];

function getInitials(name: string) {
  const parts = name.split(' ');
  return parts[parts.length - 1][0];
}

export default function Team() {
  return (
    <section id="nhom" className="py-24 md:py-32 relative">
      <div className="section-divider" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <SectionTitle
          badge="👥 Đội ngũ"
          title="Nhóm Làng Rim Nam"
          subtitle="Những con người đứng sau dự án bảo vệ cộng đồng khỏi lừa đảo trực tuyến"
        />

        {/* Slogan */}
        <ScrollReveal>
          <div className="text-center mb-16">
            <motion.blockquote
              className="text-2xl md:text-3xl font-light italic text-gray-300 max-w-4xl mx-auto leading-relaxed"
            >
              &ldquo;<span className="gradient-text font-semibold">Đừng để sự tin tưởng trở thành vũ khí chống lại chính bạn</span>&rdquo;
            </motion.blockquote>
          </div>
        </ScrollReveal>

        {/* GVHD Card */}
        <ScrollReveal>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="glass-card p-8 max-w-lg mx-auto mb-12 text-center border border-neon-emerald/20 hover:shadow-[0_0_40px_rgba(0,255,136,0.1)] transition-all"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-neon-emerald to-neon-cyan flex items-center justify-center text-3xl font-bold text-dark-900 mx-auto mb-4">
              <GraduationCap className="w-10 h-10" />
            </div>
            <p className="text-sm text-neon-emerald font-semibold mb-1">Giảng viên hướng dẫn</p>
            <h3 className="text-2xl font-bold text-white font-[family-name:var(--font-heading)]">
              TS. Nguyễn Thị Thu Hằng
            </h3>
          </motion.div>
        </ScrollReveal>

        {/* Members Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {members.map((member, index) => (
            <ScrollReveal key={member.name} delay={index * 0.05}>
              <motion.div
                whileHover={{ scale: 1.05, y: -4 }}
                className={`glass-card p-5 text-center transition-all duration-300 ${
                  member.isLeader
                    ? 'border border-neon-orange/30 hover:shadow-[0_0_25px_rgba(255,107,43,0.15)]'
                    : 'hover:border-white/10'
                }`}
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3 ${
                  member.isLeader
                    ? 'bg-gradient-to-br from-neon-orange to-neon-red text-dark-900'
                    : 'bg-dark-600 text-neon-cyan'
                }`}>
                  {member.isLeader && <Crown className="w-6 h-6" />}
                  {!member.isLeader && getInitials(member.name)}
                </div>
                <h4 className={`font-semibold text-sm mb-1 ${
                  member.isLeader ? 'text-neon-orange' : 'text-white'
                }`}>
                  {member.name}
                </h4>
                <p className="text-xs text-gray-500">{member.role}</p>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
