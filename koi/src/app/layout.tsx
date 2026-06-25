import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Kỹ Năng Chống Lừa Đảo Trên Internet | Làng Rim Nam',
  description: 'Trang web giáo dục về kỹ năng nhận diện và phòng chống lừa đảo trên Internet. Tìm hiểu về Social Engineering, Deepfake, Phishing và các công cụ AI bảo vệ bạn trong kỷ nguyên số.',
  keywords: ['lừa đảo internet', 'chống lừa đảo', 'social engineering', 'phishing', 'deepfake', 'an toàn mạng', 'bảo mật'],
  authors: [{ name: 'Nhóm Làng Rim Nam' }],
  openGraph: {
    title: 'Kỹ Năng Chống Lừa Đảo Trên Internet',
    description: 'Kỷ nguyên thao túng tâm lý số - Trang bị kỹ năng phòng chống lừa đảo trực tuyến',
    type: 'website',
    locale: 'vi_VN',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Orbitron:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
