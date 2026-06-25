'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

// ─── Types ────────────────────────────────────────────────────────────────────
type RiskLevel = 'HIGH' | 'MEDIUM' | 'LOW' | 'SAFE' | 'UNKNOWN';
type AnalysisType = 'url' | 'message';

interface AnalysisResult {
  id: string;
  type: AnalysisType;
  input: string;
  risk_level: RiskLevel;
  confidence: number;
  summary: string;
  is_scam: boolean;
  red_flags: string[];
  manipulation_techniques: string[];
  recommendation: string;
  detailed_analysis: string;
  timestamp: string;
  error?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const RISK_CONFIG: Record<RiskLevel, { label: string; color: string; bg: string; border: string; emoji: string }> = {
  HIGH:    { label: 'NGUY HIỂM CAO', color: '#FF3B30', bg: 'rgba(255,59,48,0.08)',   border: 'rgba(255,59,48,0.4)',   emoji: '🚨' },
  MEDIUM:  { label: 'ĐÁNG NGỜ',      color: '#FF9F0A', bg: 'rgba(255,159,10,0.08)',  border: 'rgba(255,159,10,0.4)',  emoji: '⚠️' },
  LOW:     { label: 'RỦI RO THẤP',   color: '#FFD60A', bg: 'rgba(255,214,10,0.08)',  border: 'rgba(255,214,10,0.4)',  emoji: '🟡' },
  SAFE:    { label: 'AN TOÀN',        color: '#30D158', bg: 'rgba(48,209,88,0.08)',   border: 'rgba(48,209,88,0.4)',   emoji: '✅' },
  UNKNOWN: { label: 'KHÔNG RÕ',       color: '#8E8E93', bg: 'rgba(142,142,147,0.08)', border: 'rgba(142,142,147,0.4)', emoji: '❓' },
};

const SCAN_STEPS = [
  'Kết nối Gemini AI...',
  'Phân tích cấu trúc...',
  'Nhận diện mẫu lừa đảo...',
  'Đánh giá rủi ro...',
  'Tổng hợp kết quả...',
];

// ─── Prompt Builder ───────────────────────────────────────────────────────────
function buildPrompt(input: string, type: AnalysisType): string {
  const schema = `{
  "risk_level": "HIGH | MEDIUM | LOW | SAFE",
  "confidence": <số nguyên 0-100>,
  "is_scam": <true | false>,
  "summary": "<1 câu tóm tắt bằng tiếng Việt>",
  "red_flags": ["<dấu hiệu 1>", "<dấu hiệu 2>"],
  "manipulation_techniques": ["<kỹ thuật 1>", "<kỹ thuật 2>"],
  "recommendation": "<lời khuyên hành động cụ thể bằng tiếng Việt>",
  "detailed_analysis": "<phân tích 3-5 câu bằng tiếng Việt>"
}`;

  const base = `Bạn là chuyên gia an ninh mạng hàng đầu Việt Nam, chuyên phát hiện lừa đảo. 
Phân tích ${type === 'url' ? 'URL' : 'tin nhắn'} sau và trả về DUY NHẤT một JSON hợp lệ, không có markdown, không có giải thích ngoài JSON.

Schema bắt buộc:
${schema}

Lưu ý phân tích:
- HIGH: rõ ràng lừa đảo, cần chặn ngay
- MEDIUM: nhiều dấu hiệu đáng ngờ, cần cẩn thận  
- LOW: một vài dấu hiệu nhỏ, nên xác minh
- SAFE: không có dấu hiệu lừa đảo

${type === 'url' ? 'URL cần phân tích' : 'Tin nhắn cần phân tích'}:
${input}`;

  return base;
}

// ─── Parse AI response ────────────────────────────────────────────────────────
function parseGeminiResponse(raw: string): Partial<AnalysisResult> {
  try {
    const clean = raw
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```\s*$/i, '')
      .trim();
    const firstBrace = clean.indexOf('{');
    const lastBrace = clean.lastIndexOf('}');
    if (firstBrace === -1 || lastBrace === -1) throw new Error('No JSON found');
    return JSON.parse(clean.slice(firstBrace, lastBrace + 1));
  } catch {
    return {
      risk_level: 'UNKNOWN',
      confidence: 50,
      is_scam: false,
      summary: 'Không thể phân tích cấu trúc phản hồi',
      red_flags: [],
      manipulation_techniques: [],
      recommendation: 'Hãy cẩn thận và xác minh thông tin từ nguồn đáng tin cậy.',
      detailed_analysis: raw,
    };
  }
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function Home() {
  const [activeTab, setActiveTab]   = useState<AnalysisType>('url');
  const [url, setUrl]               = useState('');
  const [message, setMessage]       = useState('');
  const [result, setResult]         = useState<AnalysisResult | null>(null);
  const [loading, setLoading]       = useState(false);
  const [scanStep, setScanStep]     = useState(0);
  const [history, setHistory]       = useState<AnalysisResult[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [copied, setCopied]         = useState(false);
  const intervalRef                 = useRef<ReturnType<typeof setInterval> | null>(null);

  // Scan step animation
  useEffect(() => {
    if (loading) {
      let step = 0;
      intervalRef.current = setInterval(() => {
        step = (step + 1) % SCAN_STEPS.length;
        setScanStep(step);
      }, 900);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [loading]);

  // ── Main analysis function ──────────────────────────────────────────────────
  const analyze = useCallback(async () => {
    const input = activeTab === 'url' ? url.trim() : message.trim();

    if (!input) {
      alert(activeTab === 'url' ? 'Vui lòng nhập URL cần kiểm tra!' : 'Vui lòng nhập tin nhắn cần phân tích!');
      return;
    }
    if (!GEMINI_API_KEY) {
      alert('Thiếu NEXT_PUBLIC_GEMINI_API_KEY trong file .env.local!');
      return;
    }

    setLoading(true);
    setResult(null);
    setScanStep(0);

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: buildPrompt(input, activeTab) }] }],
            generationConfig: { 
              temperature: 0.75, 
              topK: 40, 
              topP: 0.92, 
              maxOutputTokens: 1800 
            },
            safetySettings: [
              { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
            ],
          }),
        }
      );

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData?.error?.message || `HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();

      // Handle blocked response
      if (data.promptFeedback?.blockReason) {
        throw new Error(`Gemini đã chặn yêu cầu: ${data.promptFeedback.blockReason}`);
      }

      const rawText: string = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
      if (!rawText) throw new Error('Gemini trả về phản hồi trống.');

      const parsed = parseGeminiResponse(rawText);

      const final: AnalysisResult = {
        id: Date.now().toString(),
        type: activeTab,
        input,
        risk_level:              (parsed.risk_level as RiskLevel) || 'UNKNOWN',
        confidence:              typeof parsed.confidence === 'number' ? Math.min(100, Math.max(0, parsed.confidence)) : 50,
        is_scam:                 Boolean(parsed.is_scam),
        summary:                 parsed.summary || '',
        red_flags:               Array.isArray(parsed.red_flags) ? parsed.red_flags : [],
        manipulation_techniques: Array.isArray(parsed.manipulation_techniques) ? parsed.manipulation_techniques : [],
        recommendation:          parsed.recommendation || '',
        detailed_analysis:       parsed.detailed_analysis || '',
        timestamp:               new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      };

      setResult(final);
      setHistory(prev => [final, ...prev].slice(0, 20));
    } catch (err: any) {
      const errorResult: AnalysisResult = {
        id: Date.now().toString(),
        type: activeTab,
        input,
        risk_level: 'UNKNOWN', confidence: 0, is_scam: false,
        summary: '', red_flags: [], manipulation_techniques: [],
        recommendation: '', detailed_analysis: '',
        timestamp: new Date().toLocaleTimeString('vi-VN'),
        error: err.message || 'Lỗi không xác định. Vui lòng thử lại.',
      };
      setResult(errorResult);
    } finally {
      setLoading(false);
    }
  }, [activeTab, url, message]);

  // ── Copy result ─────────────────────────────────────────────────────────────
  const copyResult = async () => {
    if (!result) return;
    const text = [
      `[ScamShield AI – ${result.timestamp}]`,
      `Loại: ${result.type === 'url' ? 'URL' : 'Tin nhắn'}`,
      `Mức độ: ${RISK_CONFIG[result.risk_level].label}`,
      `Độ tin cậy: ${result.confidence}%`,
      `Tóm tắt: ${result.summary}`,
      result.red_flags.length > 0 ? `Dấu hiệu: ${result.red_flags.join(', ')}` : '',
      `Chi tiết: ${result.detailed_analysis}`,
      `Khuyến nghị: ${result.recommendation}`,
    ].filter(Boolean).join('\n');
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const inputValue  = activeTab === 'url' ? url : message;
  const riskCfg     = result ? RISK_CONFIG[result.risk_level] : null;
  const scanPercent = ((scanStep + 1) / SCAN_STEPS.length) * 100;

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Global styles ─────────────────────────────────────────────────── */}
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #070A12; }

        @keyframes spin  { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scanLine {
          0%   { top: 0%; opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes progressBar {
          from { width: 0%; }
        }
        @keyframes ripple {
          0%   { transform: scale(1);   opacity: 0.6; }
          100% { transform: scale(2.2); opacity: 0; }
        }

        .tab-btn:hover  { color: #E8EAED !important; background: rgba(255,255,255,0.04) !important; }
        .scan-btn:hover { opacity: 0.88 !important; transform: translateY(-1px); }
        .scan-btn:active { transform: translateY(0); }
        .hist-item:hover { background: rgba(255,255,255,0.04) !important; }
        .copy-btn:hover  { background: rgba(255,255,255,0.08) !important; }

        input::placeholder  { color: #3A3D47; }
        textarea::placeholder { color: #3A3D47; }
        input:focus  { outline: none; }
        textarea:focus { outline: none; }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
      `}</style>

      {/* ── Page wrapper ─────────────────────────────────────────────────── */}
      <div style={{
        minHeight: '100vh',
        background: '#070A12',
        color: '#E8EAED',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        position: 'relative',
        overflow: 'hidden',
      }}>

        {/* Grid bg */}
        <div style={{
          position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
          backgroundImage: `linear-gradient(rgba(0,212,170,0.025) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0,212,170,0.025) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }} />
        {/* Glow top-left */}
        <div style={{
          position: 'fixed', top: 0, left: 0, width: 500, height: 500,
          background: 'radial-gradient(circle at 0 0, rgba(0,212,170,0.07) 0%, transparent 65%)',
          pointerEvents: 'none', zIndex: 0,
        }} />
        {/* Glow bottom-right */}
        <div style={{
          position: 'fixed', bottom: 0, right: 0, width: 600, height: 600,
          background: 'radial-gradient(circle at 100% 100%, rgba(255,59,48,0.06) 0%, transparent 65%)',
          pointerEvents: 'none', zIndex: 0,
        }} />

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <header style={{
          position: 'sticky', top: 0, zIndex: 200,
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          background: 'rgba(7,10,18,0.85)',
          backdropFilter: 'blur(20px)',
          padding: '0 32px',
          height: 60,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 9,
              background: 'linear-gradient(135deg, #00D4AA 0%, #0099FF 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, flexShrink: 0,
            }}>🛡️</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: '-0.3px', lineHeight: 1.2 }}>ScamShield AI</div>
              <div style={{ fontSize: 10, color: '#4A4E5A', letterSpacing: '0.8px', textTransform: 'uppercase' }}>by Gemini 1.5 Flash</div>
            </div>
          </div>

          {/* History toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {history.length > 0 && (
              <button
                className="copy-btn"
                onClick={() => setShowHistory(v => !v)}
                style={{
                  padding: '6px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)',
                  background: showHistory ? 'rgba(255,255,255,0.06)' : 'transparent',
                  color: '#8E8E93', fontSize: 12, cursor: 'pointer', fontWeight: 600,
                  display: 'flex', alignItems: 'center', gap: 6,
                }}
              >
                <span style={{
                  background: '#00D4AA', color: '#070A12', borderRadius: 4,
                  padding: '0 5px', fontSize: 10, fontWeight: 800,
                }}>{history.length}</span>
                Lịch sử
              </button>
            )}
            <div style={{ display: 'flex', gap: 5 }}>
              {history.slice(0, 5).map(h => (
                <div key={h.id} style={{
                  width: 7, height: 7, borderRadius: '50%',
                  background: RISK_CONFIG[h.risk_level].color,
                  opacity: 0.6,
                }} />
              ))}
            </div>
          </div>
        </header>

        {/* ── Main ──────────────────────────────────────────────────────────── */}
        <main style={{ position: 'relative', zIndex: 1, maxWidth: 860, margin: '0 auto', padding: '56px 20px 100px' }}>

          {/* Hero text */}
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              background: 'rgba(0,212,170,0.07)', border: '1px solid rgba(0,212,170,0.2)',
              borderRadius: 100, padding: '5px 14px', marginBottom: 20,
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: '50%', background: '#00D4AA',
                display: 'inline-block', animation: 'pulse 2s ease-in-out infinite',
              }} />
              <span style={{ fontSize: 11, color: '#00D4AA', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 600 }}>
                Phân tích thời gian thực
              </span>
            </div>
            <h1 style={{
              fontSize: 'clamp(28px, 6vw, 52px)',
              fontWeight: 800,
              letterSpacing: '-1.5px',
              lineHeight: 1.1,
              marginBottom: 14,
            }}>
              Phát Hiện Lừa Đảo{' '}
              <span style={{
                background: 'linear-gradient(90deg, #00D4AA 0%, #0099FF 60%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Thông Minh
              </span>
            </h1>
            <p style={{ fontSize: 15, color: '#5F6368', lineHeight: 1.6, maxWidth: 480, margin: '0 auto' }}>
              Kiểm tra link và tin nhắn đáng ngờ ngay lập tức. Bảo vệ bạn và gia đình khỏi các chiêu trò lừa đảo tinh vi.
            </p>
          </div>

          {/* ── Analyzer card ────────────────────────────────────────────── */}
          <div style={{
            background: 'rgba(255,255,255,0.018)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 24,
            overflow: 'hidden',
            marginBottom: 28,
          }}>
            {/* Tabs */}
            <div style={{
              display: 'flex', gap: 4,
              background: 'rgba(0,0,0,0.25)',
              margin: 8, borderRadius: 14, padding: 4,
            }}>
              {(['url', 'message'] as AnalysisType[]).map(tab => (
                <button
                  key={tab}
                  className="tab-btn"
                  onClick={() => { setActiveTab(tab); setResult(null); }}
                  style={{
                    flex: 1, padding: '11px 16px', borderRadius: 10,
                    border: 'none', cursor: 'pointer',
                    fontSize: 13, fontWeight: 600,
                    transition: 'all 0.18s',
                    background: activeTab === tab ? 'rgba(255,255,255,0.07)' : 'transparent',
                    color: activeTab === tab ? '#E8EAED' : '#4A4E5A',
                  }}
                >
                  {tab === 'url' ? '🔗  Kiểm tra Link / URL' : '💬  Phân tích Tin nhắn'}
                </button>
              ))}
            </div>

            {/* Input */}
            <div style={{ padding: '20px 20px 24px' }}>
              {activeTab === 'url' ? (
                /* ── URL input ── */
                <div style={{
                  display: 'flex', gap: 10, alignItems: 'center',
                  background: 'rgba(0,0,0,0.35)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 14,
                  padding: '0 6px 0 16px',
                  transition: 'border-color 0.2s',
                }}>
                  <span style={{ color: '#3A3D47', fontSize: 15, flexShrink: 0 }}>🔗</span>
                  <input
                    type="url"
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && analyze()}
                    placeholder="https://example.com hoặc dán link đáng ngờ..."
                    style={{
                      flex: 1, background: 'transparent', border: 'none',
                      color: '#E8EAED', fontSize: 14, padding: '14px 0',
                      fontFamily: 'ui-monospace, monospace',
                    }}
                  />
                  <button
                    className="scan-btn"
                    onClick={analyze}
                    disabled={loading || !url.trim()}
                    style={{
                      padding: '11px 22px', borderRadius: 10,
                      background: 'linear-gradient(135deg, #00D4AA 0%, #0099FF 100%)',
                      border: 'none', color: '#fff',
                      fontWeight: 700, fontSize: 13, cursor: 'pointer',
                      flexShrink: 0, transition: 'all 0.18s',
                      opacity: loading || !url.trim() ? 0.4 : 1,
                      pointerEvents: loading || !url.trim() ? 'none' : 'auto',
                    }}
                  >
                    Quét ngay →
                  </button>
                </div>
              ) : (
                /* ── Message input ── */
                <>
                  <div style={{
                    background: 'rgba(0,0,0,0.35)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 14, overflow: 'hidden', marginBottom: 12,
                  }}>
                    <textarea
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      placeholder="Dán tin nhắn đáng ngờ vào đây... (SMS, Zalo, Telegram, Facebook, Email, v.v.)"
                      rows={6}
                      style={{
                        width: '100%', background: 'transparent', border: 'none',
                        color: '#E8EAED', fontSize: 14, padding: '16px',
                        resize: 'vertical', lineHeight: 1.65,
                        fontFamily: "'Inter', sans-serif",
                      }}
                    />
                    <div style={{
                      padding: '8px 16px',
                      borderTop: '1px solid rgba(255,255,255,0.04)',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    }}>
                      <span style={{ fontSize: 11, color: '#3A3D47' }}>{message.length.toLocaleString()} ký tự</span>
                      {message && (
                        <button onClick={() => setMessage('')} style={{
                          fontSize: 11, color: '#4A4E5A', background: 'none',
                          border: 'none', cursor: 'pointer',
                        }}>✕ Xóa</button>
                      )}
                    </div>
                  </div>
                  <button
                    className="scan-btn"
                    onClick={analyze}
                    disabled={loading || !message.trim()}
                    style={{
                      width: '100%', padding: '15px',
                      background: 'linear-gradient(135deg, #00D4AA 0%, #0099FF 100%)',
                      border: 'none', borderRadius: 14,
                      color: '#fff', fontWeight: 700, fontSize: 14,
                      cursor: 'pointer', transition: 'all 0.18s',
                      opacity: loading || !message.trim() ? 0.4 : 1,
                      pointerEvents: loading || !message.trim() ? 'none' : 'auto',
                      letterSpacing: '0.2px',
                    }}
                  >
                    🛡️ &nbsp;Phân tích với Gemini AI
                  </button>
                </>
              )}
            </div>
          </div>

          {/* ── Loading ─────────────────────────────────────────────────── */}
          {loading && (
            <div style={{
              background: 'rgba(255,255,255,0.018)',
              border: '1px solid rgba(0,212,170,0.15)',
              borderRadius: 24, padding: '44px 32px', textAlign: 'center',
              animation: 'fadeUp 0.3s ease',
            }}>
              {/* Ripple ring */}
              <div style={{ position: 'relative', width: 88, height: 88, margin: '0 auto 28px' }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    position: 'absolute', inset: -(i * 10),
                    border: `1.5px solid rgba(0,212,170,${0.25 - i * 0.07})`,
                    borderRadius: '50%',
                    animation: `ripple ${1.4 + i * 0.4}s ease-out ${i * 0.3}s infinite`,
                  }} />
                ))}
                <div style={{
                  position: 'absolute', inset: 0,
                  border: '2.5px solid transparent',
                  borderTopColor: '#00D4AA',
                  borderRadius: '50%',
                  animation: 'spin 0.9s linear infinite',
                }} />
                <div style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 28,
                }}>🛡️</div>
              </div>

              <div style={{ fontSize: 15, fontWeight: 600, color: '#00D4AA', marginBottom: 6 }}>
                {SCAN_STEPS[scanStep]}
              </div>
              <div style={{ fontSize: 12, color: '#3A3D47', marginBottom: 20 }}>
                Bước {scanStep + 1}/{SCAN_STEPS.length}
              </div>

              {/* Progress bar */}
              <div style={{
                height: 3, background: 'rgba(0,212,170,0.12)',
                borderRadius: 2, width: '100%', overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%',
                  width: `${scanPercent}%`,
                  background: 'linear-gradient(90deg, #00D4AA, #0099FF)',
                  borderRadius: 2,
                  transition: 'width 0.9s ease',
                }} />
              </div>
            </div>
          )}

          {/* ── Result ──────────────────────────────────────────────────── */}
          {result && !loading && (
            <div style={{
              borderRadius: 24, overflow: 'hidden',
              border: result.error
                ? '1px solid rgba(255,59,48,0.2)'
                : `1px solid ${riskCfg?.border}`,
              animation: 'fadeUp 0.35s ease',
            }}>

              {result.error ? (
                /* Error state */
                <div style={{ padding: '28px 28px', background: 'rgba(255,59,48,0.05)' }}>
                  <div style={{ color: '#FF3B30', fontWeight: 700, marginBottom: 8, fontSize: 15 }}>
                    ⚠️ Lỗi phân tích
                  </div>
                  <div style={{ color: '#6E7178', fontSize: 13, lineHeight: 1.6 }}>{result.error}</div>
                  <div style={{ marginTop: 16 }}>
                    <button onClick={analyze} style={{
                      padding: '8px 18px', borderRadius: 8,
                      background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
                      color: '#E8EAED', fontSize: 13, cursor: 'pointer', fontWeight: 600,
                    }}>Thử lại</button>
                  </div>
                </div>
              ) : (
                <>
                  {/* ── Risk banner ──────────────────────────────────────── */}
                  <div style={{
                    padding: '28px 28px',
                    background: riskCfg?.bg,
                    borderBottom: `1px solid ${riskCfg?.border}30`,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                      {/* Left: badge + summary */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1, minWidth: 220 }}>
                        <div style={{
                          width: 58, height: 58, borderRadius: 16, flexShrink: 0,
                          background: `${riskCfg?.color}18`,
                          border: `2px solid ${riskCfg?.color}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 26,
                        }}>
                          {riskCfg?.emoji}
                        </div>
                        <div>
                          <div style={{
                            fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase',
                            color: riskCfg?.color, fontWeight: 700, marginBottom: 5,
                          }}>
                            {riskCfg?.label}
                          </div>
                          <div style={{ fontSize: 17, fontWeight: 700, color: '#E8EAED', lineHeight: 1.3 }}>
                            {result.summary || (result.is_scam ? 'Phát hiện dấu hiệu lừa đảo' : 'Không có dấu hiệu lừa đảo rõ ràng')}
                          </div>
                          <div style={{ fontSize: 11, color: '#4A4E5A', marginTop: 4 }}>
                            {result.type === 'url' ? '🔗 Phân tích URL' : '💬 Phân tích tin nhắn'} • {result.timestamp}
                          </div>
                        </div>
                      </div>

                      {/* Right: confidence + copy */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: 11, color: '#4A4E5A', marginBottom: 4 }}>Độ tin cậy AI</div>
                          <div style={{ fontSize: 38, fontWeight: 800, color: riskCfg?.color, lineHeight: 1 }}>
                            {result.confidence}<span style={{ fontSize: 18 }}>%</span>
                          </div>
                        </div>
                        {/* Mini confidence bar */}
                        <div style={{
                          width: 80, height: 3, background: 'rgba(255,255,255,0.08)',
                          borderRadius: 2, overflow: 'hidden',
                        }}>
                          <div style={{
                            height: '100%', width: `${result.confidence}%`,
                            background: riskCfg?.color, borderRadius: 2,
                            transition: 'width 1.2s cubic-bezier(0.16,1,0.3,1)',
                          }} />
                        </div>
                        <button
                          className="copy-btn"
                          onClick={copyResult}
                          style={{
                            padding: '6px 12px', borderRadius: 8,
                            border: '1px solid rgba(255,255,255,0.08)',
                            background: copied ? 'rgba(48,209,88,0.12)' : 'transparent',
                            color: copied ? '#30D158' : '#5F6368',
                            fontSize: 11, cursor: 'pointer', fontWeight: 600,
                            transition: 'all 0.2s',
                          }}
                        >
                          {copied ? '✓ Đã sao chép' : '📋 Sao chép'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* ── Detail sections ───────────────────────────────────── */}
                  <div style={{
                    background: 'rgba(7,10,18,0.7)',
                    padding: '24px 28px',
                    display: 'flex', flexDirection: 'column', gap: 24,
                  }}>

                    {/* Red flags */}
                    {result.red_flags.length > 0 && (
                      <div>
                        <SectionLabel icon="🚩" text="Dấu hiệu cảnh báo" />
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
                          {result.red_flags.map((flag, i) => (
                            <Tag key={i} color="#FF3B30" text={flag} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Manipulation techniques */}
                    {result.manipulation_techniques.length > 0 && (
                      <div>
                        <SectionLabel icon="🧠" text="Kỹ thuật thao túng tâm lý" />
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
                          {result.manipulation_techniques.map((t, i) => (
                            <Tag key={i} color="#FF9F0A" text={t} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Detailed analysis */}
                    {result.detailed_analysis && (
                      <div>
                        <SectionLabel icon="📋" text="Phân tích chi tiết" />
                        <div style={{
                          marginTop: 12, fontSize: 14, color: '#9EA3AD',
                          lineHeight: 1.75,
                          background: 'rgba(0,0,0,0.25)',
                          padding: '16px 18px', borderRadius: 12,
                          border: '1px solid rgba(255,255,255,0.04)',
                        }}>
                          {result.detailed_analysis}
                        </div>
                      </div>
                    )}

                    {/* Recommendation */}
                    {result.recommendation && (
                      <div style={{
                        display: 'flex', gap: 14, alignItems: 'flex-start',
                        background: result.is_scam
                          ? 'rgba(255,59,48,0.06)'
                          : 'rgba(48,209,88,0.06)',
                        border: `1px solid ${result.is_scam ? 'rgba(255,59,48,0.15)' : 'rgba(48,209,88,0.15)'}`,
                        borderRadius: 12, padding: '16px 18px',
                      }}>
                        <div style={{ fontSize: 20, flexShrink: 0, marginTop: 1 }}>
                          {result.is_scam ? '🔴' : '🟢'}
                        </div>
                        <div>
                          <div style={{ fontSize: 11, letterSpacing: '1px', textTransform: 'uppercase', color: '#5F6368', fontWeight: 700, marginBottom: 6 }}>
                            Khuyến nghị hành động
                          </div>
                          <div style={{ fontSize: 14, color: '#E8EAED', lineHeight: 1.65 }}>
                            {result.recommendation}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Input preview */}
                    <details>
                      <summary style={{
                        fontSize: 12, color: '#3A3D47', cursor: 'pointer',
                        listStyle: 'none', display: 'flex', alignItems: 'center', gap: 6,
                      }}>
                        <span>▶</span> Xem nội dung đã phân tích
                      </summary>
                      <div style={{
                        marginTop: 10, padding: '12px 14px', borderRadius: 10,
                        background: 'rgba(0,0,0,0.3)',
                        border: '1px solid rgba(255,255,255,0.04)',
                        fontSize: 12, color: '#4A4E5A',
                        fontFamily: 'ui-monospace, monospace',
                        wordBreak: 'break-all', lineHeight: 1.6,
                        maxHeight: 120, overflowY: 'auto',
                      }}>
                        {result.input}
                      </div>
                    </details>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── History panel ──────────────────────────────────────────── */}
          {showHistory && history.length > 0 && (
            <div style={{
              marginTop: 28,
              background: 'rgba(255,255,255,0.018)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 24, overflow: 'hidden',
              animation: 'fadeUp 0.3s ease',
            }}>
              <div style={{
                padding: '18px 24px',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#E8EAED' }}>
                  📂 Lịch sử phân tích ({history.length})
                </span>
                <button onClick={() => setHistory([])} style={{
                  fontSize: 11, color: '#4A4E5A', background: 'none',
                  border: 'none', cursor: 'pointer',
                }}>Xóa tất cả</button>
              </div>
              <div style={{ maxHeight: 340, overflowY: 'auto' }}>
                {history.map(h => {
                  const cfg = RISK_CONFIG[h.risk_level];
                  return (
                    <button
                      key={h.id}
                      className="hist-item"
                      onClick={() => { setResult(h); setShowHistory(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      style={{
                        width: '100%', textAlign: 'left',
                        padding: '14px 24px',
                        borderBottom: '1px solid rgba(255,255,255,0.03)',
                        background: 'transparent', border: 'none', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: 12,
                        transition: 'background 0.15s',
                      }}
                    >
                      <div style={{
                        width: 8, height: 8, borderRadius: '50%',
                        background: cfg.color, flexShrink: 0,
                      }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontSize: 13, color: '#C5C8CC', fontWeight: 500,
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          fontFamily: h.type === 'url' ? 'ui-monospace, monospace' : 'inherit',
                        }}>
                          {h.input.slice(0, 80)}{h.input.length > 80 ? '…' : ''}
                        </div>
                        <div style={{ fontSize: 11, color: '#3A3D47', marginTop: 2 }}>
                          {h.type === 'url' ? '🔗' : '💬'} {cfg.label} • {h.timestamp}
                        </div>
                      </div>
                      <div style={{
                        fontSize: 11, fontWeight: 700, color: cfg.color,
                        background: `${cfg.color}18`, padding: '3px 8px',
                        borderRadius: 6, flexShrink: 0,
                      }}>
                        {h.confidence}%
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Empty state / Tips ─────────────────────────────────────── */}
          {!loading && !result && (
            <div style={{
              marginTop: 20,
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 12,
            }}>
              {[
                { icon: '🏦', text: 'Tin nhắn giả mạo ngân hàng' },
                { icon: '🎁', text: 'Thông báo trúng thưởng giả' },
                { icon: '🔗', text: 'Link lừa đăng nhập tài khoản' },
                { icon: '👮', text: 'Giả mạo cơ quan nhà nước' },
              ].map((tip, i) => (
                <div key={i} style={{
                  padding: '14px 16px',
                  background: 'rgba(255,255,255,0.015)',
                  border: '1px solid rgba(255,255,255,0.04)',
                  borderRadius: 12,
                  display: 'flex', alignItems: 'center', gap: 10,
                }}>
                  <span style={{ fontSize: 18 }}>{tip.icon}</span>
                  <span style={{ fontSize: 12, color: '#4A4E5A', lineHeight: 1.4 }}>{tip.text}</span>
                </div>
              ))}
            </div>
          )}
        </main>

        {/* Footer */}
        <footer style={{
          textAlign: 'center', padding: '24px',
          borderTop: '1px solid rgba(255,255,255,0.04)',
          fontSize: 11, color: '#2A2D35',
          position: 'relative', zIndex: 1,
        }}>
          ScamShield AI • Powered by Google Gemini 1.5 Flash • Chỉ mang tính tham khảo
        </footer>
      </div>
    </>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────
function SectionLabel({ icon, text }: { icon: string; text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
      <span style={{ fontSize: 14 }}>{icon}</span>
      <span style={{
        fontSize: 11, letterSpacing: '1px', textTransform: 'uppercase',
        color: '#4A4E5A', fontWeight: 700,
      }}>{text}</span>
    </div>
  );
}

function Tag({ color, text }: { color: string; text: string }) {
  return (
    <span style={{
      padding: '5px 12px',
      background: `${color}12`,
      border: `1px solid ${color}25`,
      borderRadius: 100,
      fontSize: 12, color: color,
      lineHeight: 1,
    }}>
      {text}
    </span>
  );
}