'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Link2, Bot, Shield, AlertTriangle, CheckCircle, XCircle, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

type RiskLevel = 'safe' | 'warning' | 'danger' | null;

interface AnalysisResult {
  riskLevel: RiskLevel;
  score: number;
  flags: string[];
  recommendations: string[];
}

function analyzeUrl(url: string): AnalysisResult {
  const flags: string[] = [];
  let score = 0;

  if (!url.startsWith('https://')) {
    flags.push('Không sử dụng HTTPS - kết nối không được mã hóa');
    score += 25;
  }
  if (url.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/)) {
    flags.push('Sử dụng địa chỉ IP thay vì tên miền - dấu hiệu đáng ngờ');
    score += 30;
  }
  if (url.match(/(bit\.ly|tinyurl|t\.co|goo\.gl|is\.gd|buff\.ly)/i)) {
    flags.push('Link rút gọn - có thể ẩn giấu URL thực sự nguy hiểm');
    score += 20;
  }
  if (url.match(/(login|verify|update|secure|confirm|account|banking|password)/i)) {
    flags.push('Chứa từ khóa nhạy cảm (login/verify/update/secure) thường dùng trong phishing');
    score += 20;
  }
  if (url.match(/[\-]{2,}|[_]{2,}/)) {
    flags.push('Tên miền có ký tự lặp bất thường');
    score += 15;
  }
  if ((url.match(/\./g) || []).length > 4) {
    flags.push('Quá nhiều subdomain - dấu hiệu tên miền giả mạo');
    score += 15;
  }
  if (url.match(/(vietcombank|techcombank|agribank|bidv|vietinbank|momo|zalopay)/i) && !url.match(/\.(com\.vn|vn)\/?$/i)) {
    flags.push('Có thể giả mạo thương hiệu ngân hàng/ví điện tử Việt Nam');
    score += 35;
  }
  if (url.includes('@')) {
    flags.push('URL chứa ký tự @ - kỹ thuật đánh lừa URL phổ biến');
    score += 25;
  }

  score = Math.min(score, 100);
  let riskLevel: RiskLevel = 'safe';
  if (score >= 60) riskLevel = 'danger';
  else if (score >= 30) riskLevel = 'warning';

  const recommendations: string[] = [];
  if (riskLevel === 'danger') {
    recommendations.push('KHÔNG truy cập hoặc nhập thông tin vào website này');
    recommendations.push('Báo cáo link này cho cơ quan chức năng hoặc ngân hàng liên quan');
    recommendations.push('Nếu đã nhập thông tin, hãy đổi mật khẩu ngay lập tức');
  } else if (riskLevel === 'warning') {
    recommendations.push('Cẩn thận khi truy cập, kiểm tra kỹ URL trước khi nhập thông tin');
    recommendations.push('So sánh với URL chính thức của tổ chức');
    recommendations.push('Không nhập mật khẩu hoặc OTP nếu không chắc chắn');
  } else {
    recommendations.push('URL có vẻ an toàn, nhưng vẫn nên cẩn thận');
    recommendations.push('Luôn kiểm tra URL trên thanh địa chỉ trước khi đăng nhập');
  }

  if (flags.length === 0) {
    flags.push('Không phát hiện dấu hiệu đáng ngờ rõ ràng');
  }

  return { riskLevel, score, flags, recommendations };
}

function analyzeMessage(message: string): AnalysisResult {
  const flags: string[] = [];
  let score = 0;
  const lowerMsg = message.toLowerCase();

  const urgencyWords = ['khẩn cấp', 'ngay lập tức', 'trong vòng 24h', 'gấp', 'ngay bây giờ', 'còn 2 giờ', 'hết hạn'];
  const foundUrgency = urgencyWords.filter(w => lowerMsg.includes(w));
  if (foundUrgency.length > 0) {
    flags.push(`Ngôn ngữ tạo sự khẩn cấp: "${foundUrgency.join('", "')}"`);
    score += 20;
  }

  const scamWords = ['trúng thưởng', 'nhận thưởng', 'quà tặng', 'miễn phí', 'tặng ngay', 'may mắn'];
  const foundScam = scamWords.filter(w => lowerMsg.includes(w));
  if (foundScam.length > 0) {
    flags.push(`Hứa hẹn phần thưởng/quà tặng: "${foundScam.join('", "')}"`);
    score += 25;
  }

  const authWords = ['công an', 'cơ quan chức năng', 'tòa án', 'viện kiểm sát', 'ngân hàng nhà nước'];
  const foundAuth = authWords.filter(w => lowerMsg.includes(w));
  if (foundAuth.length > 0) {
    flags.push(`Giả danh cơ quan chức năng: "${foundAuth.join('", "')}"`);
    score += 25;
  }

  const actionWords = ['chuyển khoản', 'chuyển tiền', 'nạp tiền', 'thanh toán', 'đặt cọc'];
  const foundAction = actionWords.filter(w => lowerMsg.includes(w));
  if (foundAction.length > 0) {
    flags.push(`Yêu cầu chuyển tiền/thanh toán: "${foundAction.join('", "')}"`);
    score += 30;
  }

  const infoWords = ['otp', 'mã xác nhận', 'mã xác minh', 'mật khẩu', 'password', 'cccd', 'cmnd', 'số tài khoản'];
  const foundInfo = infoWords.filter(w => lowerMsg.includes(w));
  if (foundInfo.length > 0) {
    flags.push(`Yêu cầu thông tin nhạy cảm: "${foundInfo.join('", "')}"`);
    score += 25;
  }

  const linkPattern = /(https?:\/\/|bit\.ly|tinyurl|click vào|bấm vào|truy cập|link bên dưới)/i;
  if (linkPattern.test(message)) {
    flags.push('Chứa link hoặc yêu cầu click vào link');
    score += 15;
  }

  const jobWords = ['việc nhẹ lương cao', 'thu nhập', 'cộng tác viên', 'tuyển dụng', 'kiếm tiền online', 'làm giàu'];
  const foundJob = jobWords.filter(w => lowerMsg.includes(w));
  if (foundJob.length > 0) {
    flags.push(`Lừa đảo việc làm: "${foundJob.join('", "')}"`);
    score += 20;
  }

  score = Math.min(score, 100);
  let riskLevel: RiskLevel = 'safe';
  if (score >= 60) riskLevel = 'danger';
  else if (score >= 25) riskLevel = 'warning';

  const recommendations: string[] = [];
  if (riskLevel === 'danger') {
    recommendations.push('Đây rất có thể là tin nhắn LỪA ĐẢO - KHÔNG làm theo hướng dẫn');
    recommendations.push('KHÔNG chuyển tiền, cung cấp OTP hoặc thông tin cá nhân');
    recommendations.push('Chặn số/tài khoản gửi tin nhắn này ngay');
    recommendations.push('Báo cáo cho cơ quan chức năng (đường dây nóng: 113)');
  } else if (riskLevel === 'warning') {
    recommendations.push('Tin nhắn có dấu hiệu đáng ngờ - hãy cẩn thận');
    recommendations.push('Xác minh thông tin qua kênh chính thức trước khi hành động');
    recommendations.push('Hỏi ý kiến người thân hoặc bạn bè trước khi quyết định');
  } else {
    recommendations.push('Tin nhắn có vẻ bình thường, không phát hiện dấu hiệu lừa đảo rõ ràng');
    recommendations.push('Tuy nhiên, luôn cảnh giác với tin nhắn từ người lạ');
  }

  if (flags.length === 0) {
    flags.push('Không phát hiện mẫu ngôn ngữ lừa đảo phổ biến');
  }

  return { riskLevel, score, flags, recommendations };
}

const riskConfig = {
  safe: { label: 'An toàn', color: 'text-neon-emerald', bg: 'bg-neon-emerald/10', border: 'border-neon-emerald/20', icon: CheckCircle },
  warning: { label: 'Nghi ngờ', color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20', icon: AlertTriangle },
  danger: { label: 'Nguy hiểm', color: 'text-neon-red', bg: 'bg-neon-red/10', border: 'border-neon-red/20', icon: XCircle },
};

function ResultPanel({ result }: { result: AnalysisResult | null }) {
  if (!result || !result.riskLevel) return null;
  const config = riskConfig[result.riskLevel];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mt-6 p-6 rounded-xl ${config.bg} border ${config.border}`}
    >
      <div className="flex items-center gap-3 mb-4">
        <Icon className={`w-8 h-8 ${config.color}`} />
        <div>
          <span className={`text-2xl font-bold font-[family-name:var(--font-heading)] ${config.color}`}>
            {config.label}
          </span>
          <div className="text-sm text-gray-400">Điểm rủi ro: {result.score}/100</div>
        </div>
        {/* Score bar */}
        <div className="flex-1 ml-4">
          <div className="h-3 rounded-full bg-dark-700 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${result.score}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className={`h-full rounded-full ${
                result.score >= 60 ? 'bg-neon-red' : result.score >= 30 ? 'bg-yellow-400' : 'bg-neon-emerald'
              }`}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-semibold text-gray-300 mb-2">🔍 Dấu hiệu phát hiện:</h4>
          <ul className="space-y-1">
            {result.flags.map((flag, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className={`mt-0.5 ${config.color}`}>•</span>
                <span className="text-gray-400">{flag}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-300 mb-2">💡 Khuyến nghị:</h4>
          <ul className="space-y-1">
            {result.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <Shield className={`w-4 h-4 mt-0.5 shrink-0 ${config.color}`} />
                <span className="text-gray-400">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

export default function KiemTraPage() {
  const [url, setUrl] = useState('');
  const [message, setMessage] = useState('');
  const [urlResult, setUrlResult] = useState<AnalysisResult | null>(null);
  const [msgResult, setMsgResult] = useState<AnalysisResult | null>(null);
  const [urlLoading, setUrlLoading] = useState(false);
  const [msgLoading, setMsgLoading] = useState(false);

  const handleUrlCheck = async () => {
    if (!url.trim()) return;
    setUrlLoading(true);
    setUrlResult(null);
    await new Promise(r => setTimeout(r, 1500));
    setUrlResult(analyzeUrl(url));
    setUrlLoading(false);
  };

  const handleMsgCheck = async () => {
    if (!message.trim()) return;
    setMsgLoading(true);
    setMsgResult(null);
    await new Promise(r => setTimeout(r, 1500));
    setMsgResult(analyzeMessage(message));
    setMsgLoading(false);
  };

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12">
            <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-neon-cyan transition-colors mb-6">
              <ArrowLeft className="w-4 h-4" />
              Quay lại trang chủ
            </Link>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl sm:text-4xl md:text-5xl font-bold font-[family-name:var(--font-heading)] gradient-text mb-4"
            >
              Công Cụ Kiểm Tra AI
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-gray-400"
            >
              Sử dụng AI để phân tích và phát hiện các dấu hiệu lừa đảo trực tuyến
            </motion.p>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* URL Checker */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-8 border border-cyan-500/10"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-neon-cyan/10">
                  <Link2 className="w-7 h-7 text-neon-cyan" />
                </div>
                <div>
                  <h2 className="text-xl font-bold font-[family-name:var(--font-heading)] text-neon-cyan">URL Checker</h2>
                  <p className="text-sm text-gray-500">Kiểm tra link đáng ngờ</p>
                </div>
              </div>

              <div className="space-y-4">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Dán URL đáng ngờ vào đây..."
                  className="w-full px-5 py-4 rounded-xl bg-dark-900 border border-cyan-500/20 text-white placeholder-gray-600 focus:outline-none focus:border-neon-cyan/50 focus:shadow-[0_0_20px_rgba(0,240,255,0.1)] transition-all text-lg"
                  onKeyDown={(e) => e.key === 'Enter' && handleUrlCheck()}
                />
                <button
                  onClick={handleUrlCheck}
                  disabled={urlLoading || !url.trim()}
                  className="w-full py-4 rounded-xl bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20 font-bold text-lg hover:bg-neon-cyan/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  {urlLoading ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Đang phân tích...</>
                  ) : (
                    <><Shield className="w-5 h-5" /> Kiểm tra URL</>
                  )}
                </button>
              </div>

              <AnimatePresence>
                {urlResult && <ResultPanel result={urlResult} />}
              </AnimatePresence>
            </motion.div>

            {/* Message Checker */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card p-8 border border-emerald-500/10"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-neon-emerald/10">
                  <Bot className="w-7 h-7 text-neon-emerald" />
                </div>
                <div>
                  <h2 className="text-xl font-bold font-[family-name:var(--font-heading)] text-neon-emerald">AI Phishing Checker</h2>
                  <p className="text-sm text-gray-500">Phân tích tin nhắn lừa đảo</p>
                </div>
              </div>

              <div className="space-y-4">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Dán tin nhắn, email đáng ngờ vào đây..."
                  rows={5}
                  className="w-full px-5 py-4 rounded-xl bg-dark-900 border border-emerald-500/20 text-white placeholder-gray-600 focus:outline-none focus:border-neon-emerald/50 focus:shadow-[0_0_20px_rgba(0,255,136,0.1)] transition-all resize-none text-lg"
                />
                <button
                  onClick={handleMsgCheck}
                  disabled={msgLoading || !message.trim()}
                  className="w-full py-4 rounded-xl bg-neon-emerald/10 text-neon-emerald border border-neon-emerald/20 font-bold text-lg hover:bg-neon-emerald/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  {msgLoading ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Đang phân tích...</>
                  ) : (
                    <><Bot className="w-5 h-5" /> Phân tích tin nhắn</>
                  )}
                </button>
              </div>

              <AnimatePresence>
                {msgResult && <ResultPanel result={msgResult} />}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Tips section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 glass-card p-8 border border-neon-orange/10"
          >
            <h3 className="text-xl font-bold font-[family-name:var(--font-heading)] text-neon-orange mb-4">
              💡 Mẹo sử dụng
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-400">
              <div className="flex items-start gap-3">
                <span className="text-neon-cyan">01.</span>
                <p>Thử dán link: <code className="text-neon-cyan bg-neon-cyan/10 px-2 py-0.5 rounded">http://vietcombank-verify.xyz/login</code></p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-neon-cyan">02.</span>
                <p>Thử dán tin nhắn: <code className="text-neon-emerald bg-neon-emerald/10 px-2 py-0.5 rounded">&quot;Tài khoản của bạn bị khóa khẩn cấp, chuyển khoản 500k để xác minh&quot;</code></p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-neon-cyan">03.</span>
                <p>Công cụ sử dụng phân tích rule-based, sẽ được nâng cấp AI trong tương lai.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-neon-cyan">04.</span>
                <p>Kết quả chỉ mang tính tham khảo - luôn kết hợp với sự cảnh giác cá nhân.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
