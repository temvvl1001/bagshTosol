import React from 'react';

export default function CulturePage() {
  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '24px',
      padding: '48px',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
    }}>
      <h2 style={{
        fontSize: '36px',
        fontWeight: '800',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        marginBottom: '16px'
      }}>Монголын соёл, өв уламжлал</h2>
      <p style={{
        fontSize: '16px',
        color: '#6b7280',
        lineHeight: 1.7
      }}>
        Энэ хэсэгт та монголын түүхэн өв, уламжлалт соёл, ахуй, зан үйл, байгалийн онцлогийн талаарх мэдээллийг олж болно.
        Хэрэв танд асуух зүйл байвал Home хуудсын AI Туслах-аар дамжуулан асуугаарай.
      </p>
    </div>
  );
}
