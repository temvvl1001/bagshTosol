import React from 'react';

export default function HomePage({ items, expanded, setExpanded, messages, chatMessage, setChatMessage, sendMessage }) {
  return (
    <div style={{ 
      display: 'grid',
      gridTemplateColumns: window.innerWidth >= 1024 ? '2fr 1fr' : '1fr',
      gap: '32px'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {items.map((item, index) => (
          <div
            key={index}
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '24px',
              padding: '32px',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s',
              cursor: 'pointer',
              border: '1px solid rgba(147, 51, 234, 0.1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 20px 60px rgba(102, 126, 234, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.1)';
            }}
          >
            <div style={{ 
              display: 'flex',
              flexDirection: window.innerWidth >= 768 ? 'row' : 'column',
              gap: '24px',
              alignItems: 'flex-start'
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{
                    padding: '4px 12px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    fontSize: '11px',
                    fontWeight: '700',
                    borderRadius: '20px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    WORD OF THE DAY
                  </span>
                  <span style={{ fontSize: '16px' }}>✨</span>
                </div>
                <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '16px' }}>
                  {item.date}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <h2 style={{
                    fontSize: '48px',
                    fontWeight: '800',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    margin: 0
                  }}>
                    {item.word}
                  </h2>
                </div>
                <p style={{ 
                  fontFamily: 'monospace',
                  fontSize: '18px',
                  color: '#6b7280',
                  marginBottom: '16px'
                }}>
                  [{item.pronunciation}]
                </p>
                <button style={{
                  background: 'none',
                  border: 'none',
                  color: '#9333ea',
                  fontWeight: '600',
                  fontSize: '16px',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  textUnderlineOffset: '4px',
                  transition: 'color 0.3s'
                }}
                onClick={() => setExpanded(prev => ({ ...prev, [index]: !prev[index] }))}
                onMouseEnter={(e) => e.currentTarget.style.color = '#ec4899'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#9333ea'}
                >
                  Үгийн тайлбар →
                </button>
                <div style={{
                  marginTop: expanded[index] ? '12px' : '0',
                  padding: expanded[index] ? '16px' : '0',
                  borderRadius: '12px',
                  background: '#faf5ff',
                  border: expanded[index] ? '1px solid #e9d5ff' : '1px solid transparent',
                  overflow: 'hidden',
                  maxHeight: expanded[index] ? '300px' : '0',
                  opacity: expanded[index] ? 1 : 0,
                  transform: expanded[index] ? 'translateY(0)' : 'translateY(-4px)',
                  transition: 'max-height 0.6s ease, opacity 0.6s ease, transform 0.6s ease, margin 0.6s ease, padding 0.6s ease, border-color 0.6s ease'
                }}>
                  <p style={{ margin: 0, color: '#4b5563', fontSize: '16px' }}>{item.meaning}</p>
                  <ul style={{ marginTop: '8px', paddingLeft: '18px', color: '#6b7280', fontSize: '14px' }}>
                    {item.examples.map((ex, i) => (
                      <li key={i}>{ex}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div style={{ position: 'relative', width: '192px', height: '192px', cursor: 'pointer' }}
                onClick={() => setExpanded(prev => ({ ...prev, [index]: !prev[index] }))}
              >
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '16px',
                  transition: 'transform 0.3s'
                }}></div>
                <img
                  src={item.image}
                  alt={item.word}
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '16px',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                    transition: 'transform 0.3s'
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div>
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
          position: 'sticky',
          top: '100px',
          border: '1px solid rgba(147, 51, 234, 0.1)'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '24px',
            color: 'white'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ fontSize: '24px' }}>✨</span>
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '700' }}>AI Туслах</h3>
                <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>Таны хэлний хамтрагч</p>
              </div>
            </div>
          </div>
          <div style={{
            height: '400px',
            overflowY: 'auto',
            padding: '24px',
            background: 'linear-gradient(to bottom, rgba(243, 232, 255, 0.3), rgba(251, 207, 232, 0.3))',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  padding: '16px',
                  borderRadius: '16px',
                  maxWidth: '80%',
                  alignSelf: msg.isUser ? 'flex-end' : 'flex-start',
                  background: msg.isUser 
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : 'white',
                  color: msg.isUser ? 'white' : '#374151',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  border: msg.isUser ? 'none' : '1px solid rgba(147, 51, 234, 0.1)'
                }}
              >
                <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.6' }}>
                  {msg.text}
                </p>
              </div>
            ))}
          </div>
          <div style={{
            padding: '16px',
            background: 'white',
            borderTop: '1px solid rgba(147, 51, 234, 0.1)'
          }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="Асуулт асуух..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '2px solid #e9d5ff',
                  outline: 'none',
                  fontSize: '14px'
                }}
                onFocus={(e) => e.target.style.borderColor = '#9333ea'}
                onBlur={(e) => e.target.style.borderColor = '#e9d5ff'}
              />
              <button
                onClick={sendMessage}
                style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: '600',
                  fontSize: '18px',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
                }}
              >
                →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

