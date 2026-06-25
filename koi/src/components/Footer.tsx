import { Shield, Heart } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-dark-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-6 h-6 text-neon-orange" />
              <span className="text-lg font-bold font-[family-name:var(--font-heading)] gradient-text">
                ChốngLừaĐảo
              </span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Trang web giáo dục về kỹ năng nhận diện và phòng chống lừa đảo trên Internet.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">Liên kết</h4>
            <ul className="space-y-2">
              <li><Link href="/#thong-ke" className="text-sm text-gray-500 hover:text-neon-cyan transition-colors">Thống kê</Link></li>
              <li><Link href="/#social-engineering" className="text-sm text-gray-500 hover:text-neon-cyan transition-colors">Social Engineering</Link></li>
              <li><Link href="/#giai-phap" className="text-sm text-gray-500 hover:text-neon-cyan transition-colors">Giải pháp AI</Link></li>
              <li><Link href="/kiem-tra" className="text-sm text-gray-500 hover:text-neon-cyan transition-colors">Kiểm tra</Link></li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">Thông tin</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>Nhóm: <span className="text-neon-orange">Làng Rim Nam</span></li>
              <li>GVHD: <span className="text-neon-emerald">TS. Nguyễn Thị Thu Hằng</span></li>
              <li>Môn: Kỹ năng chống lừa đảo trên Internet</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 text-center">
          <p className="text-sm text-gray-600 flex items-center justify-center gap-1">
            Made with <Heart className="w-4 h-4 text-neon-red fill-neon-red" /> by Làng Rim Nam &copy; {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}
